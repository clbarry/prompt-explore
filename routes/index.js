/* * This file is for the backend code that will run on the server. 
You can use this file to connect to a database, and perform other server-side tasks. */
/* https://www.mongodb.com/docs/get-started/?language=nodejs */

/* *** NOTE CUSTOMIZE THIS CODE TO CONNECT TO OUR MONGODB DATABASE *** */
import { MongoClient } from "mongodb";

async function runGetStarted() {
  // Replace the uri string with your connection string
  const uri = "<connection string URI>";
  const client = new MongoClient(uri);

  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await client.close();
  }
}
runGetStarted().catch(console.dir);
