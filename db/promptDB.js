import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";

function PromptExplorerDB() {
  const me = {};


  const USER = process.env.MONGOUSER;
  const PASS = process.env.MONGOPASS;
  console.log("USER:", process.env.MONGOUSER, "PASS set?", !!process.env.MONGOPASS);
  const URI = `mongodb+srv://${USER}:${PASS}@prompt-explore-cluster.bu1xeuj.mongodb.net/?appName=prompt-explore-cluster`;
  // const URI = "mongodb://localhost:27017";
  const DB_NAME = "promptexplore";
  const COLLECTION = "prompts";
  const RECENTLY_DELETED = "recently_deleted";
  const connect = () => {
    const client = new MongoClient(URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
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

  me.addRating = async (promptId, rating) => {
    const { client, prompts } = await connect();

    try {
      const result = await prompts.updateOne(
        { _id: new ObjectId(promptId) },
        { $inc: { [`rating.${rating}`]: 1 } },
      );
      return result;
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  me.createRecentlyDeleted = async (record) => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.insertOne({
        ...record,
        deletedAt: new Date(),
      });
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  me.deletePrompt = async (promptId) => {
    const { client, prompts } = connect();
    try {
      const id = new ObjectId(promptId);
      const prompt = await prompts.findOne({ _id: id });
      if (!prompt) return { deleted: false, reason: "not found" };

      await me.createRecentlyDeleted(prompt);

      await prompts.deleteOne({ _id: id });
      return { deleted: true };
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };


  /* CREATE HTML */
  /* create a new prompt */
  me.createPrompt = async (record) => {
    const { client, prompts } = connect();
    try {
      return await prompts.insertOne(record);
    } finally {
      await client.close();
    }
  };

  /* MODERATOR HTML */

  /* SAVE EDITS MODERATOR HTML */
  /* Update a prompt by ID with new data */
  me.updatePromptById = async (promptId, updates) => {
    const { client, prompts } = connect();
    try {
      return await prompts.updateOne(
        { _id: new ObjectId(promptId) },
        { $set: updates },
      );
    } finally {
      await client.close();
    }
  };

  /* Load a prompt by ID from Recently Deleted */
  me.getRecentlyDeletedById = async (promptId) => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.findOne({ _id: new ObjectId(promptId) });
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  me.getFirstRecentlyDeleted = async () => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.findOne({}, { sort: { deletedAt: 1, _id: 1 } });
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
