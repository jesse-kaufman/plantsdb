/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi } from "vitest"
import PlantModel from "@/plants/models/plantModel" // Import your Mongoose model
import { plantRepository } from "@/plants/repositories/plantRepository"

// Mock the PlantModel.find method
vi.mock("@/plants/models/plantModel")

const activePlant = { status: "active", name: "Plant 1" }
const inactivePlant = { status: "inactive", name: "Plant 2" }
const mockPlants = [activePlant, inactivePlant]

describe("plantRepository", () => {
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
})
