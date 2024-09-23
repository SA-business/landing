import express from 'express';
import { connectToDb, getDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
const app = express();
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

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { email, hashedPassword, id: uuidv4() };
        await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
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
            return res.status(400).json({ error: 'User does not exist' });
        }
        const validPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token, message: "Logged in successfully" } );
    } catch (err) {
        console.error('Failed to retrieve users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})