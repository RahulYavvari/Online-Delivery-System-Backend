export {};

const mongoose = require("mongoose");
const config = require("../../config.json");

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
try {
  mongoose
    .connect(
      process.env.MONGODB_URI || config.connectionString,
      connectionOptions
    )
    .then((res: any) => console.log(`MongoDB connected Successfully..!`));
} catch (error: any) {
  console.log(`MongoDB Error: `, error.message);
  process.exit(1);
}

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/user"),
};