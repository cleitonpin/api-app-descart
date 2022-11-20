import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import connect from "./connect";
import credentials from "./middleware/credentials";
import { corsOptionsDelegate } from "./config/allowedOrigins";
import { franchiseRoutes } from "./routes";

const app = express();
const port = process.env.PORT || 8080;

app.use(credentials);
app.use(cors(corsOptionsDelegate));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(franchiseRoutes);

app.listen(port, () =>
  console.log(`Application started successfully on port ${port}.`)
);
const db = process.env.MONGO_URI;

connect({ db });
