/**
 * @file Tests for Plant class.
 */

/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { describe, it, expect, vi } from "vitest"
import { validSeedlingPlant } from "../testConstants.js"
import Plant from "@/plants/PlantClass.js"

const validPlant = { ...validSeedlingPlant }

describe("Plant class", () => {
  describe("constructor", () => {
    it("should initialize properties with values sent to constructor", () => {
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
          new TypeError("source must be a string")
        )
      })

      it("should throw TypeError when passing invalid source to constructor", () => {
        // @ts-expect-error
        expect(() => new Plant({ ...validPlant, source: "Mars" })).toThrow(
          "Unknown source: Mars"
        )
      })
    })
  })
})

describe("printing", () => {
  it("should print the expected plant information", () => {
    // Capture console output
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {
      // Do nothing.
    })

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
