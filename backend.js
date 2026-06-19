import express from "express";

import promptsRouter from "./routes/prompts.js";
import rateRouter from "./routes/rate.js"
import deleteRouter from './routes/delete.js';

import createRouter from "./routes/create.js";

//import modApproveRouter from "./routes/mod_approve.js";
//import modDeleteRouter from "./routes/mod_delete.js";
import modLoadRouter from "./routes/mod_load.js";
import modSaveRouter from "./routes/mod_saveedit.js";


console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json()); 
app.use(express.static("frontend"));

app.use("/api", promptsRouter);
app.use("/api", rateRouter);
app.use("/api", deleteRouter);

app.use("/api", createRouter);
app.use("/api", modSaveRouter);
//app.use("/api", modDeleteRouter);
app.use("/api", modLoadRouter);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
