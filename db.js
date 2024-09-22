import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let dbConnection;

const connectToDb = (cb) => {
    MongoClient.connect(`mongodb+srv://simcard01668:${process.env.password}@internship.bt2y1.mongodb.net/?retryWrites=true&w=majority&appName=Internship`)
    .then((client) =>{
        dbConnection = client.db("internship");
        return cb();
    })
    .catch((err) => {
        console.log(err)
        return cb(err);
    }
    )
};
const getDb = () => dbConnection;

export { connectToDb, getDb };
