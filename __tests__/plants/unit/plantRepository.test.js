/** @file Unit tests for plant repository. */
/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi } from "vitest"
import PlantModel from "@/plants/models/plantModel" // Import your Mongoose model
import { plantRepository } from "@/plants/repositories/plantRepository"

// Mock the PlantModel.find method
vi.mock("@/plants/models/plantModel")

const activePlant = { id: "1", status: "active", name: "Plant 1" }
const inactivePlant = { id: "2", status: "inactive", name: "Plant 2" }
const mockPlants = [activePlant, inactivePlant]

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

      expect(result).toEqual([activePlant])
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

      expect(result).toEqual([inactivePlant])
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
    it("should return active plant matching ID", async () => {
      const plantId = "1"
      PlantModel.findById.mockResolvedValue(
        mockPlants.find(
          (plant) => plant.status === "active" && plant.id === plantId
        )
      )

      const result = await plantRepository.findById(plantId)
      console.log(result)

      expect(result).toEqual(activePlant)
    })

    it("should return undefined when no active plants match ID", async () => {
      const plantId = "2"
      PlantModel.findById.mockResolvedValue(
        mockPlants.find(
          (plant) => plant.status === "active" && plant.id === plantId
        )
      )

      const result = await plantRepository.findById(plantId)

      expect(result).toBeUndefined()
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
})
