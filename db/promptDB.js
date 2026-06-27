import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";

function PromptExplorerDB() {
  const me = {};

  const USER = process.env.MONGOUSER;
  const PASS = process.env.MONGOPASS;
  if (!USER || !PASS) {
    throw new Error("Missing MONGOUSER or MONGOPASS environment variable");
  }

  const encodedUser = encodeURIComponent(USER);
  const encodedPass = encodeURIComponent(PASS);
  const URI = `mongodb+srv://${encodedUser}:${encodedPass}@prompt-explore-cluster.bu1xeuj.mongodb.net/?appName=prompt-explore-cluster`;
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

      const del = await prompts.deleteOne({ _id: id });
      if (del.deletedCount === 0) {
        await client.db(DB_NAME).collection(RECENTLY_DELETED).deleteOne({ _id: prompt._id });
        throw new Error("Failed to delete original prompt");
      }
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

  /* LOAD MODERATOR HTML */
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

  /* Load the first prompt from Recently Deleted */
  me.countRecentlyDeleted = async () => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.countDocuments();
    } finally {
      await client.close();
    }
  };

  me.getFirstRecentlyDeleted = async () => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.findOne(
        {},
        { sort: { deletedAt: 1, _id: 1 } },
      );
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  /* Load the next prompt from Recently Deleted */
  me.getNextRecentlyDeleted = async (afterId) => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.findOne(
        { _id: { $gt: new ObjectId(afterId) } },
        { sort: { _id: 1 } },
      );
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  /* DELETE MODERATOR HTML */
  /* Delete a prompt by ID from Recently Deleted */
  me.deleteRecentlyDeletedById = async (promptId) => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      const result = await recentlyDeleted.deleteOne({
        _id: new ObjectId(promptId),
      });
      return { deleted: result.deletedCount === 1 };
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  /* APPROVE MODERATOR HTML */
  /* Move a prompt from Recently Deleted back to Prompts Saving Edits */
  me.approveRecentlyDeletedById = async (promptId) => {
    const { client, prompts } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      const prompt = await recentlyDeleted.findOne({
        _id: new ObjectId(promptId),
      });
      if (!prompt) return { approved: false, reason: "not found" };

      const { _id, deletedAt, ...promptToApprove } = prompt;

      await prompts.insertOne(promptToApprove);

      await recentlyDeleted.deleteOne({ _id: new ObjectId(promptId) });
      return { approved: true };
    } catch (err) {
      throw err;
    } finally {
      await client.close();
    }
  };

  /* SAVE EDITS MODERATOR HTML */
  /* Update a recently_deleted prompt by ID with new data */
  me.updateRecentlyDeletedById = async (promptId, updates) => {
    const { client } = connect();
    const recentlyDeleted = client.db(DB_NAME).collection(RECENTLY_DELETED);
    try {
      return await recentlyDeleted.updateOne(
        { _id: new ObjectId(promptId) },
        { $set: updates },
      );
    } finally {
      await client.close();
    }
  };

  return me;
}

const promptDB = PromptExplorerDB();
export default promptDB;
