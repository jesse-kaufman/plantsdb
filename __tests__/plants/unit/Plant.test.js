/**
 * @file Tests for Plant class.
 */

/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { describe, it, expect, beforeEach, vi } from "vitest"
import Plant from "../../../src/plants/Plant.js"
import { validSeedlingPlant } from "../testConstants.js"

const validPlant = { ...validSeedlingPlant }

describe("Plant class", () => {
  describe("constructor", () => {
    it("should initialize properties with default values", () => {
      const plant = new Plant(validPlant)
      expect(plant.name).toBe("Bob")
      expect(plant.source).toBe("seed")
      expect(plant.status).toBe("active")
      expect(plant.stage).toBe("seedling")
      expect(plant.startedOn).toEqual(new Date("2023-01-01"))
    })

    it("should throw TypeError when passing non-object to constructor", () => {
      // @ts-expect-error
      expect(() => new Plant("Bob")).toThrow(
        new TypeError("Invalid plant object")
      )
      // @ts-expect-error
      expect(() => new Plant(123)).toThrow(
        new TypeError("Invalid plant object")
      )
      // @ts-expect-error
      expect(() => new Plant(null)).toThrow(
        new TypeError("Invalid plant object")
      )
      // @ts-expect-error
      expect(() => new Plant(undefined)).toThrow(
        new TypeError("Invalid plant object")
      )
    })

    it("should throw an error when any required property is missing in constructor", () => {
      const requiredProps = ["name", "status", "source", "stage", "startedOn"]
      requiredProps.forEach((prop) => {
        const newPlant = { ...validPlant }
        delete newPlant[prop]
        // @ts-expect-error
        expect(() => new Plant(newPlant)).toThrow(`${prop} is required`)
      })
    })

    // Tests for status property
    describe("status property", () => {
      it("should throw TypeError when passing non-string status to constructor", () => {
        // @ts-expect-error
        expect(() => new Plant({ ...validPlant, status: 1 })).toThrow(
          new TypeError("Status must be a string")
        )
      })

      it("should throw TypeError when passing invalid status to constructor", () => {
        // @ts-expect-error
        expect(
          () => new Plant({ ...validPlant, status: "invalid status" })
        ).toThrow("Unknown status: invalid status")
      })
    })

    // Tests for source property
    describe("source property", () => {
      it("should throw TypeError when passing non-string source to constructor", () => {
        // @ts-expect-error
        expect(() => new Plant({ ...validPlant, source: 1 })).toThrow(
          new TypeError("Source must be a string")
        )
      })

      it("should throw TypeError when passing invalid source to constructor", () => {
        // @ts-expect-error
        expect(() => new Plant({ ...validPlant, source: "Mars" })).toThrow(
          "Unknown status: invalid status"
        )
      })
    })
  })

  // Test transitioning between different plant statuses
  describe("status transitions", () => {
    let plant = {}

    // Reset plant before each test
    beforeEach(() => {
      plant = new Plant(validPlant)
    })

    // Test deleting a plant
    it("should set status to 'inactive' when delete() is called on a plant", () => {
      // Test deleting an active plant
      plant.delete() // Delete the plant
      expect(plant.status).toBe("inactive") // Ensure status is inactive

      // Test deleting an archived plant
      plant.undelete() // Restore the plant
      plant.archive() // Archive the plant
      plant.delete() // Delete the plant again
      expect(plant.status).toBe("inactive") // Ensure status is inactive

      // Repeat to verify that calling delete() again doesn't change the status
      plant.delete()
      expect(plant.status).toBe("inactive") // Status should stay inactive
    })

    // Test restoring a plant
    it("should set status to 'active' when undelete() is called on an inactive plant", () => {
      plant.delete() // First delete the plant
      plant.undelete() // Then restore it
      expect(plant.status).toBe("active") // Ensure status is active

      // Repeat to verify that calling undelete() again doesn't change the status
      plant.undelete()
      expect(plant.status).toBe("active") // Ensure status is active
    })

    // Test archiving an active plant
    it("should set status to 'archived' when archive() is called on an active or archived plant", () => {
      plant.archive() // Archive the plant
      expect(plant.status).toBe("archived") // Ensure status becomes archived

      // Repeat to verify that calling archive() again doesn't change the status
      plant.archive()
      expect(plant.status).toBe("archived") // Status should stay archived
    })

    // Test archiving a deleted plant
    it("should leave status as-is when archive() is called on an deleted plant", () => {
      plant.delete() // Delete the plant first
      plant.archive() // Then archive it
      expect(plant.status).toBe("inactive") // Status should stay inactive
    })

    // Test unarchiving a plant
    it("should set status to 'active' when unarchive() is called on an archived or active plant", () => {
      plant.archive() // Archive the plant first
      plant.unarchive() // Unarchive the plant
      expect(plant.status).toBe("active") // Ensure status becomes active

      // Repeat to verify that calling unarchive() again doesn't change the status
      plant.unarchive()
      expect(plant.status).toBe("active") // Ensure status becomes active
    })

    // Test deleting an archived plant
    it("should set status to 'inactive' when delete() is called on an archived plant", () => {
      plant.archive() // Archive the plant first
      plant.delete() // Then delete it
      expect(plant.status).toBe("inactive") // Ensure status becomes inactive
    })

    // Test restoring a plant that isn't deleted
    it("should leave status as-is if undelete() is called on an active or archived plant", () => {
      // Test restoring an active plant
      plant.undelete() // Restore the active plant
      expect(plant.status).toBe("active") // Active plant remains active

      // Test restoring an archived plant
      plant.archive() // First archive the plant
      plant.undelete() // Then try to restore it
      expect(plant.status).toBe("archived") // Archived plant remains archived
    })
  })
})

describe("printing", () => {
  it("should print the expected plant information", () => {
    // Capture console output
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    const plant = new Plant(validPlant)
    plant.print()

    // Expected formatted output (ensure exact match)
    const expectedOutput = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Plant Information for: Bob",
      "───────────────────────────────────────────────────",
      "Stage:  seedling                           Status: active",
      "Started: Jan 1, 2023",
      "───────────────────────────────────────────────────",
    ]

    // Check each call to console.log
    expectedOutput.forEach((line, index) => {
      expect(consoleSpy).toHaveBeenNthCalledWith(index + 1, line)
    })

    // Restore console.log
    consoleSpy.mockRestore()
  })
})
