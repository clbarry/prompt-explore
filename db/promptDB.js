import { MongoClient, ObjectId } from "mongodb";
function PromptExplorerDB() {
  const me = {};

  const URI = "mongodb://localhost:27017";
  const DB_NAME = "promptexplore";
  const COLLECTION = "prompts";
  const RECENTLY_DELETED = "recently_deleted";
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

  me.addRating = async (promptId, rating) => {
    const { client, prompts } = connect();

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
  return me;
}

const promptDB = PromptExplorerDB();
export default promptDB;
