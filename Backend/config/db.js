const mongoose = require("mongoose");
require('dotenv').config();

const ConnectDb = async () => {
  try {
    const uri = process.env.MONGO;
    if (!uri) throw new Error("MONGO environment variable is missing!");

    console.log("Connecting to MongoDB:", uri); // optional for debugging

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Error failed connecting MongoDb:", error.message);
  }
};

module.exports = ConnectDb;
