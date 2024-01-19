import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db("my-mongo"); // Replace with your database name

      // Replace this with your logic
      const user = req.body;
      const result = await db.collection('users').insertOne(user);

      res.json({ message: 'User added successfully', result });
    } catch (e) {
      res.json({ error: e.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
