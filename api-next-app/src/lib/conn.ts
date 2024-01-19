import { MongoClient, Db } from 'mongodb';

const url: string = 'mongodb://admin:secret@localhost:27017'; // Replace with your MongoDB URL
const dbName: string = 'testing'; // Replace with your database name

let db: Db;

try {
  const client = await MongoClient.connect(url);
  console.log('Connected successfully to MongoDB');
  db = client.db(dbName);
} catch (err: any) {
  console.error('An error occurred connecting to MongoDB: ', err);
}

export const getDb = (): Db => {
  if (!db) {
    throw 'No database found!';
  }
  console.log('Returning database');
  return db;
};
