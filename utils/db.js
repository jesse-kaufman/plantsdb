//

const mongoose = require("mongoose");

/// Connect to MongoDB
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
