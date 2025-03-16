/** @file MongoDB connection function. */
import mongoose from "mongoose"
import { mongoDbUri } from "../config/config.js"

/** Sets up MongoDB connection. */
const connectDb = async () => {
  try {
    const connection = await mongoose.connect(mongoDbUri)
    console.log("MongoDB connected:", connection.connection.name)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1) // Exit process with failure
  }
}

export default connectDb
