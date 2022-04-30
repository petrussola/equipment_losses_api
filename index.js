const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { limiter } = require("./config/rate-limit");

require("dotenv").config();
const { router } = require("./routes/index");

const config = {
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DB_NAME,
};

const app = express();
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use("/", router);

// mongoDB stuff

const mongoDB = `mongodb+srv://${config.username}:${config.password}@cluster0.oubn8.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

const connectDb = () => {
  return mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = process.env.PORT || 3000;

connectDb().then(async () => {
  console.log("\n\n ## Connected to mongoDB ## \n\n");
  app.listen(port, () => {
    console.log(`\n\n ## Server running on port ${port}## \n\n`);
  });
});
