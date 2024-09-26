import express from 'express';
import { connectToDb, getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { sendEmail } from './nodemailer.mjs';
dotenv.config();
const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());

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
        const newUser = { email, hashedPassword, id: uuidv4(), createdAt: new Date() };
        await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: '用戶註冊成功' });
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
        const validPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!validPassword) {
            return res.status(400).json({ error: '用戶不存在或密碼不正確' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token, message: "登入成功" } );
    } catch (err) {
        console.error('Failed to retrieve users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/recover', async (req, res) => {
    try{
        const { resetEmail } = req.body;
        console.log('recovering password for:', resetEmail);
        let email = resetEmail;
        const user = await db.collection('users').findOne({email});
        res.json({message: "if this email exist, a password reset link has been sent."})
        if(!user){
            return 
        }

        const secret = process.env.JWT_SECRET + user.password;
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, secret, { expiresIn: '30m' });

        const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`;

        console.log('sending reset email')
        sendEmail(user.email, 'Password Reset Request',  `Click the link to reset your password: ${resetUrl}`)
    }
    catch (err){
        console.error('failed to reset password:', err);
        res.status(500).json({ error: 'Internal server error'})
    }
})

app.get('/api/getProfile' , authenticateToken, async (req, res) => {
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

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
})