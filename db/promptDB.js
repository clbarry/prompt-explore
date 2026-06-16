import { MongoClient } from "mongodb";
function PromptExplorerDB() {
  const me = {};

  const URI = "mongodb://localhost:27017";
  const DB_NAME = "promptexplore";
  const COLLECTION = "prompts";

  const connect = () => {
    const client = new MongoClient(URI);
    const prompts = client.db(DB_NAME).collection(COLLECTION);
    return { client, prompts };
  };
  me.getPrompts = async (query = {}) => {
    const { client, prompts } = connect();

    try {
      const data = await prompts.find(query).toArray();
      console.log("Fetched data from Mongo:", data);
      return data;
      // return prompts.find({}).toArray().finally(() => client.close());
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };
  return me;
}

const promptDB = PromptExplorerDB();
export default promptDB;
