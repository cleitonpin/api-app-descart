import express, { Request, Response, Application } from "express";
import cors from "cors";

import routes from "./routes";
import connect from "./connect";
const app: Application = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req: Request, res: Response) =>
  res.send("Welcome to the Mongoose & TypeScript example")
);

app.listen(port, () =>
  console.log(`Application started successfully on port ${port}.`)
);
const db =
  "mongodb+srv://admin:Iow8tF6wmhvxT9I1@cluster0.k4x76.mongodb.net/descartfarm?retryWrites=true&w=majority";

connect({ db });
routes({ app });
