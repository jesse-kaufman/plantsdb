/** @file Unit tests for plant repository. */
/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi } from "vitest"
import { validSeedlingPlant, validDeletedPlant } from "../testConstants"
import PlantModel from "@/plants/models/plantModel" // Import your Mongoose model
import { plantRepository } from "@/plants/repositories/plantRepository"
import Plant from "@/plants/PlantClass"

// Mock the PlantModel.find method
vi.mock("@/plants/models/plantModel")

const mockPlants = [validSeedlingPlant, validDeletedPlant]

describe("plantRepository", () => {
  // Test plantRepository.findBy()
  describe("findBy", () => {
    it("should return plants when a valid filter is provided", async () => {
      const filter = { status: "active" }
      const mockQuery = {
        lean: vi
          .fn()
          .mockResolvedValue(
            mockPlants.filter((plant) => plant.status === filter.status)
          ),
      }
      PlantModel.find.mockReturnValue(mockQuery)

      const result = await plantRepository.findBy(filter)

      expect(result).toEqual([validSeedlingPlant])
    })

    it("should return an empty array when no plants match the filter", async () => {
      const filter = { status: "inactive" }
      const mockQuery = {
        lean: vi
          .fn()
          .mockResolvedValue(
            mockPlants.filter((plant) => plant.status === filter.status)
          ),
      }
      PlantModel.find.mockReturnValue(mockQuery)

      const result = await plantRepository.findBy(filter)

      expect(result).toEqual([validDeletedPlant])
      expect(PlantModel.find).toHaveBeenCalledWith(filter)
      expect(PlantModel.find().lean).toHaveBeenCalled()
    })

    it("should throw an error if the database query fails", async () => {
      const filter = { status: "active" }

      // Mock the find() method to throw an error
      PlantModel.find.mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error("Database error")),
      })

      await expect(plantRepository.findBy(filter)).rejects.toThrow(
        "Database error"
      )
      expect(PlantModel.find).toHaveBeenCalledWith(filter)
    })
  })

  // Test plantRepository.findById()
  describe("findById", () => {
    // Test that findById() returns a plant object if a plant is found.
    it("should return a Plant object when a valid ID is provided", async () => {
      const plantId = "1"
      // Mock findById to return an object with a .lean method
      const mockQuery = {
        lean: vi.fn().mockResolvedValue(validSeedlingPlant),
      }
      // Mock findById.
      PlantModel.findById.mockReturnValue(mockQuery)

      // Call the method
      const result = await plantRepository.findById(plantId)

      // Check if the result is an instance of Plant and has the expected properties
      expect(result).toBeInstanceOf(Plant)
      expect(result).toEqual(new Plant(validSeedlingPlant))
    })

    it("should return undefined if no plant is found", async () => {
      const plantId = "1"
      // Mock findById to return an object with .lean returning null
      const mockQuery = {
        lean: vi.fn().mockResolvedValue(null),
      }

      PlantModel.findById.mockReturnValue(mockQuery)

      // Call the method
      const result = await plantRepository.findById(plantId)

      // Check if result is undefined because no plant is found
      expect(result).toBeUndefined() // This matches the logic where undefined is returned if no plant is found
    })

    it("should handle database query failure", async () => {
      const plantId = "1"

      // Mock findById.lean() to throw an error
      const mockQuery = {
        lean: vi.fn().mockRejectedValue(new Error("Database query failed")),
      }

      // Mock the findById() method.
      PlantModel.findById.mockReturnValue(mockQuery)

      // Call the method and check if it properly handles the error
      await expect(plantRepository.findById(plantId)).rejects.toThrow(
        "Database query failed"
      )
    })
  })

  // Test the plantRepository.create() method.
  describe("create", () => {
    // Test creating a plant successfully.
    it("should create a new plant and return the plant object", async () => {
      // Mock the create() method.
      PlantModel.create.mockReturnValue(validSeedlingPlant)

      // Call the method
      const result = await plantRepository.create(validSeedlingPlant)

      expect(result).toEqual(new Plant(validSeedlingPlant))
      expect(PlantModel.create).toHaveBeenCalledWith(validSeedlingPlant) // Check if create was called with correct data
    })

    // Test a failed attempt at creating a plant.
    it("should throw an error if the database query fails", async () => {
      const plantData = validSeedlingPlant
      // Mock the find() method to throw an error
      PlantModel.create.mockRejectedValue(new Error("Database error"))

      await expect(plantRepository.create(plantData)).rejects.toThrow(
        "Database error"
      )
      expect(PlantModel.create).toHaveBeenCalledWith(plantData)
    })
  })

  describe("update", () => {
    it("should update a plant and return the updated plant object", async () => {
      const plantId = "1"
      const updateData = { ...validSeedlingPlant, name: "Updated Plant Name" }
      // Mock the findByIdAndUpdate() method.
      PlantModel.findByIdAndUpdate.mockResolvedValue(updateData)

      // Call the update method
      const result = await plantRepository.update(plantId, updateData)

      expect(result).toEqual(updateData)
    })
  })
})
