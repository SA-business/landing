import express from 'express';
import { connectToDb, getDb } from './db.js';
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
        console.log(`Server is running on port ${port}`);
    });
    db = getDb();
   }
});

app.get('/user', async (req, res) => {
    try {
        const users = await db.collection('user').find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error('Failed to retrieve users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})