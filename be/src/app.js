import "dotenv/config";
import express from "express";
import cors from "cors";
import parameterRoutes from "./routes/parameters.js";
import { checkApiToken } from "./middlewares/checkApiToken.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(checkApiToken);

app.use("/parameters", parameterRoutes);

export default app;
