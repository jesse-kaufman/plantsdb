/** @file Configuration for app. */
import dotenv from "dotenv"

// Load environment variables from .env file.
dotenv.config()

// List of required env vars.
const requiredEnvVars = ["MONGODB_URI", "PORT"]

/** MongoDB URI for db connection. */
export const mongoDbUri = process.env.MONGODB_URI || ""
/** Port on which to run API. */
export const port = process.env.PORT || ""

// Check for required environment variables.
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.log(`Missing required environment variable: ${varName}`)
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

export default {
  mongoDbUri,
  port,
}
