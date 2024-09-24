import express from 'express';
import { connectToDb, getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { sendEmail } from './src/lib/nodemailer.mjs';
dotenv.config();
const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.use(express.json());

//db connection
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

sendEmail('howingyam0350@gmail.com', 'Hello from Nodemailer', 'Hello world!', '<b>Hello world!</b>')
.then(info => {
  console.log('Email sent: ' + info.response);
})
.catch(error => {
  console.log(error);
});



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
        const newUser = { email, hashedPassword, id: uuidv4() };
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



app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
})