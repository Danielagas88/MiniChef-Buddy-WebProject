import express from "express";

const cors = require("cors");
require("dotenv").config();
const app = express();
import { connect as mongoConnect } from "mongoose";
import { userRouter } from "./src/features/auth/userRoute";

const port = process.env.port || 3000;

const MONGO_URI = (process.env.MONGO_URI || "").replace(
  "<password>",
  process.env.MONGO_PASSWORD || ""
);
const MONGO_CONNECTION_SUCCESS = `server is connected with the MongoDB cluster!`;
const MONGO_CONNECTION_FAIL = `Connection error - server failed to connect with the MongoDB cluster...`;
const SERVER_SUCCESS = `${process.env.NODE_ENV} - server is listening on port ${port}`;
const SERVER_FAIL = `${process.env.NODE} = server failed on port ${port}...`;

mongoConnect(MONGO_URI)
  .then((): void => {
    console.log(MONGO_CONNECTION_SUCCESS);
  })
  .catch((err): void => {
    console.log(err);
    console.log(MONGO_CONNECTION_FAIL);
  });

app.use(express.json());
app.use(cors());

//////////////////////////////////////////////////////////

app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Server api");
});

app
  .listen(port, (): void => {
    console.log(SERVER_SUCCESS);
  })
  .on("error", (): void => {
    console.log(SERVER_FAIL);
  });
