const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // get mongoURI from config

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
    console.log('MondoDB connected....');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
