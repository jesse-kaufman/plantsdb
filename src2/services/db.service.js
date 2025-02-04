/** @file Configures and connects to MongoDB. */
import { MongoClient } from "mongodb"

const user = process.env.MONGO_USER
const pass = process.env.MONGO_PASS
const host = process.env.MONGO_HOST
const dbName = process.env.MONGO_DB
const port = process.env.MONGO_PORT

const uri = `mongodb://${user}:${pass}@${host}:${port}`

// Connect to MongoDB server
const client = new MongoClient(uri)
// Select database
const mongodb = client.db(dbName)

export default mongodb
