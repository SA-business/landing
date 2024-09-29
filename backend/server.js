import express from 'express';
import { connectToDb, getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { sendEmail } from './nodemailer.mjs';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();
const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

app.use(express.json());

// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.url}`);
//     next();
//   });

let db;
connectToDb((err) => {
    if (err) {
        console.error('Failed to connect to database');
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`server is running on localhost:${port}`);
        });
        db = getDb();
    }
});

// sendEmail('howingyam0350@gmail.com', 'Hello ', 'Hello world!')
// .then(info => {
//   console.log('Email sent: ' + info.response);
// })
// .catch(error => {
//   console.log(error);
// });



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (user) {
            return res.status(400).json({ error: '用戶已存在' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser = { email, hashedPassword, id: uuidv4(), createdAt: new Date(), verificationToken, emailVerified: false };
        await db.collection('users').insertOne(newUser);

        const verificationLink = `http://localhost:3000/api/verify-email?token=${verificationToken}`

        sendEmail(email, 'Email Verification', `Click the link to verify your email: ${verificationLink}`)

        res.status(201).json({ message: '用戶註冊成功, please verify your account by email' });
    }
    catch (err) {
        console.error('Failed to register user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(400).json({ error: '用戶不存在或密碼不正確' });
        }
        if (!user.emailVerified) {
            return res.status(400).json({ error: 'Please verify your email' });
        }
        const validPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!validPassword) {
            return res.status(400).json({ error: '用戶不存在或密碼不正確' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
        res.json({ token, message: "登入成功" });
    } catch (err) {
        console.error('Failed to retrieve users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/recover', async (req, res) => {
    try {
        const { resetEmail } = req.body;
        console.log('recovering password for:', resetEmail);
        let email = resetEmail;
        const user = await db.collection('users').findOne({ email });
        res.json({ message: "if this email exist, a password reset link has been sent." })
        if (!user) {
            return
        }

        const secret = process.env.JWT_SECRET + user.hashedPassword;
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, secret, { expiresIn: '30m' });

        const resetUrl = `http://localhost:5173/reset-password/${user.id}/${token}`;

        console.log('sending reset email')
        sendEmail(user.email, 'Password Reset Request', `Click the link to reset your password: ${resetUrl}`)
    }
    catch (err) {
        console.error('failed to reset password:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.get('/api/getProfile', authenticateToken, async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ id: req.user.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ name: user.name, email: user.email, id: user.id });
    }
    catch (err) {
        console.error('Failed to retrieve user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
)

app.get('/api/verify-email', async (req, res) => {
    const { token } = req.query;
    try {
        const user = await db.collection('users').findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ error: 'Invalid token' });

        }
        console.log(user)
        await db.collection('users').updateOne({ verificationToken: token }, { $set: { emailVerified: true }, $unset: { verificationToken: '' } });

        res.status(200).json({ message: 'Email verified successfully' });

    }
    catch (err) {
        console.error('Failed to verify email:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
)

app.post('/api/reset-password', async (req, res) => {
    const { userId, token, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: 'Invalid user' });
        }
        const secret = process.env.JWT_SECRET + user.hashedPassword;
        let payload;
        try {
            payload = jwt.verify(token, secret);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await db.collection('users').updateOne({ id: userId }, { $set: { hashedPassword } });
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (err) {
        console.error('Failed to reset password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
)

app.get('/api/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await db.collection('users').findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to retrieve user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/profile/personal-statement', authenticateToken, async (req, res) => {
    const { personalStatement } = req.body;
    const userId = req.user.id; // Assuming 'id' is stored in the JWT payload

    if (!personalStatement) {
        return res.status(400).json({ error: 'Personal statement is required.' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { id: userId },
            { $set: { personalStatement } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update personal statement.' });
        }

        res.status(200).json({ message: 'Personal statement updated successfully.' });
    } catch (err) {
        console.error('Failed to update personal statement:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put('/api/profile/personal-info', authenticateToken, async (req, res) => {
    const { firstName, lastName, chineseName, chineseLastName, sex } = req.body;
    const userId = req.user.id;
    
    if (!firstName || !lastName || !chineseName || !chineseLastName || !sex) {
        return res.status(400).json({ error: 'All fields are required' });
        }

    try {
        const result = await db.collection('users').updateOne(
            { id: userId },
            { $set: { firstName, lastName, chineseName, chineseLastName, sex } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update personal statement.' });
        }
  
        res.status(200).json({ message: 'Personal statement updated successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

app.put('/api/profile/education', authenticateToken, async (req, res) => {
    const { education } = req.body;
    const userId = req.user.id;

    if (!education) {
        return res.status(400).json({ error: 'Education information is required.' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { id: userId },
            { $set: { education } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update education information.' });
        }

        res.status(200).json({ message: 'Education information updated successfully.' });
    } catch (err) {
        console.error('Failed to update education:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put('/api/profile/experience', authenticateToken, async (req, res) => {
    const { experience } = req.body;
    const userId = req.user.id;

    if (!experience) {
        return res.status(400).json({ error: 'Experience information is required.' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { id: userId },
            { $set: { experience } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update experience information.' });
        }

        res.status(200).json({ message: 'Experience information updated successfully.' });
    } catch (err) {
        console.error('Failed to update experience:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.put('/api/profile/skills', authenticateToken, async (req, res) => {
    const { skills } = req.body;
    const userId = req.user.id;

    if (!skills) {
        return res.status(400).json({ error: 'Skills information is required.' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { id: userId },
            { $set: { skills } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update skills information.' });
        }

        res.status(200).json({ message: 'Skills information updated successfully.' });
    } catch (err) {
        console.error('Failed to update skills:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/profile/avatar-url', authenticateToken, async (req, res) => {
    const { fileName, fileType } = req.body;
     if (!fileName || !fileType) {
        return res.status(400).json({ error: 'File name and type are required.' });
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    try {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        res.status(200).json({ signedUrl });
    } catch (err) {
        console.error('Failed to generate signed URL:', err);
        res.status(500).json({ error: 'Internal server error.' });
        
    }
}
);

app.put('/api/profile/avatar', authenticateToken, async (req, res) => {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
        return res.status(400).json({ error: 'Avatar URL is required.' });
    }

    try {
        // Update the user's avatar URL in the database
        const result = await db.collection('users').updateOne(
            { id: req.user.id },
            { $set: { avatar: avatarUrl } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Failed to update avatar.' });
        }

        res.status(200).json({ message: 'Avatar updated successfully.', avatarUrl });
    } catch (err) {
        console.error('Failed to update avatar:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});




app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
})