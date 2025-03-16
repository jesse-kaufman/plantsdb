/** @file Configuration for app. */
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

console.log(process.env.MONGODB_URI)
/** MongoDB URI for db connection. */
export const mongoDbUri = process.env.MONGODB_URI || ""

export default {
  mongoDbUri,
}
