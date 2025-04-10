/**
 * @file Plant notes tests.
 */

/* eslint-disable max-lines-per-function */
import { describe, it, expect } from "vitest"
import Plant from "../../../src/plants/Plant.js"
import { validSeedlingPlant as validPlant } from "../testConstants.js"

describe("Plant notes property", () => {
  it("should set the notes property correctly", () => {
    // Test sending string to constructor
    const plant = new Plant({ ...validPlant, notes: "This is a note." })
    expect(plant.notes).toBe("This is a note.")

    // Send empty string to constructor
    const plant2 = new Plant({ ...validPlant, notes: "" })
    expect(plant2.notes).toBe("")

    // Set notes to string
    plant.notes = "This is a note."
    expect(plant.notes).toBe("This is a note.")

    // Set notes to empty string
    plant.notes = ""
    expect(plant.notes).toBe("")
  })

  it("should throw TypeError when provided notes property is not string", () => {
    // Test sending non-string value to constructor
    expect(() => new Plant({ ...validPlant, notes: true })).toThrow(
      new TypeError("notes must be a string")
    )
    expect(() => new Plant({ ...validPlant, notes: 123 })).toThrow(
      new TypeError("notes must be a string")
    )
    expect(() => new Plant({ ...validPlant, notes: null })).toThrow(
      new TypeError("notes must be a string")
    )

    // Test setting notes to non-string value
    const plant = new Plant(validPlant)
    expect(() => (plant.notes = true)).toThrow(
      new TypeError("notes must be a string")
    )
    expect(() => (plant.notes = 123)).toThrow(
      new TypeError("notes must be a string")
    )
    expect(() => (plant.notes = null)).toThrow(
      new TypeError("notes must be a string")
    )
    expect(() => (plant.notes = undefined)).toThrow(
      new TypeError("notes must be a string")
    )
  })

  it("should throw an error when provided notes is too long", () => {
    // Test sending short notes to constructor
    // eslint-disable-next-line no-magic-numbers
    expect(() => new Plant({ ...validPlant, notes: "a".repeat(256) })).toThrow(
      "notes must be 255 characters or fewer"
    )

    const plant = new Plant(validPlant)
    // eslint-disable-next-line no-magic-numbers
    expect(() => (plant.notes = "a".repeat(256))).toThrow(
      "notes must be 255 characters or fewer"
    )
  })

  it("should trim whitespace from notes", () => {
    // Test trimming whitespace in constructor
    const plant = new Plant({ ...validPlant, notes: "   Bob   " })
    expect(plant.notes).toBe("Bob")

    // Test trimming whitespace in setter
    plant.notes = " Alice\t"
    expect(plant.notes).toBe("Alice")
  })
})
