/* eslint-disable max-lines-per-function */
/** @file Integration tests for plantModel. */
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { describe, beforeAll, expect, afterAll, it } from "vitest"
import { validSeedlingPlant } from "../testConstants"
import PlantModel from "@/plants/models/plantModel"

let mongoServer = null

describe("plantModel", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  // Test creating and finding a plant by ID.
  it("should create a plant in the database", async () => {
    const plant = new PlantModel(validSeedlingPlant)
    await plant.save()

    const savedPlant = await PlantModel.findById(plant._id)
    expect(savedPlant).toBeTruthy()
    expect(savedPlant.name).toBe(validSeedlingPlant.name)
  })

  // Test creating and finding a plant by name.
  it("should find a plant by name", async () => {
    await PlantModel.create(validSeedlingPlant)
    const foundPlant = await PlantModel.findOne({
      name: validSeedlingPlant.name,
    })

    expect(foundPlant).toBeTruthy()
    expect(foundPlant.name).toBe(validSeedlingPlant.name)
  })

  // Test updating a plant.
  it("should update a plant and return the updated plant", async () => {
    const plant = await PlantModel.create(validSeedlingPlant)

    const updatedData = { name: "Updated Plant Name" }
    const updatedPlant = await PlantModel.findByIdAndUpdate(
      plant._id,
      updatedData,
      { new: true }
    )

    expect(updatedPlant.name).toBe("Updated Plant Name")
  })
})
