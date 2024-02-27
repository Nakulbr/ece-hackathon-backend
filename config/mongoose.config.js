const mongoose = require("mongoose");

const mongooseConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongoose connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongooseConfig;
