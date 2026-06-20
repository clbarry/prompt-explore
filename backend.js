import express from "express";

/* Route Imports */

/* PROMPTS PAGE */
import promptsRouter from "./routes/prompts.js";
import rateRouter from "./routes/rate.js"
import deleteRouter from './routes/delete.js';

/* CREATE PAGE */
import createRouter from "./routes/create.js";

/* MODERATOR PAGE */
import modLoadRouter from "./routes/mod_load.js";
import modDeleteRouter from "./routes/mod_delete.js";
import modApproveRouter from "./routes/mod_approve.js";
import modSaveEditRouter from "./routes/mod_saveedit.js";


console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json()); 
app.use(express.static("frontend"));

/* PROMPTS PAGE */
app.use("/api", promptsRouter);
app.use("/api", rateRouter);
app.use("/api", deleteRouter);

/* CREATE PAGE */
app.use("/api", createRouter);

/* MODERATOR PAGE */
app.use("/api", modLoadRouter);
app.use("/api", modDeleteRouter);
app.use("/api", modApproveRouter);
app.use("/api", modSaveEditRouter);


app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
