import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import "./config/passport.js";

//for safety
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!");
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {
  console.log("DB connection successful!");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//for safety
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
