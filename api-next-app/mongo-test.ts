const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb://admin:secret@localhost:27017/?retryWrites=true&w=majority";

// Connect to your Atlas cluster

const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");

  } catch (err: any) {
    console.log(err.stack);
  }
  finally {
    await client.close();
  }
}

run().catch(console.dir);