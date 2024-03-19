const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log(`Connected successfully to database`);
  } catch (err) {
    console.log(`Error in connection to mongoDb ${err}`);
  }
};

module.exports = connectDb;
