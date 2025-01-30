import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/taskModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config({ path: '../config.env' });


// Get the current directory of the module
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/data/10tasks.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Task.create(tasks);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Task.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
