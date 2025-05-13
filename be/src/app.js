import "dotenv/config";

import express from "express";
import parameterRoutes from "./routes/parameters.js";

const app = express();
app.use(express.json());

app.use("/parameters", parameterRoutes);

export default app;
