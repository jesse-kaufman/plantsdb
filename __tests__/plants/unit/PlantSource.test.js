/**
 * @file Plant source tests.
 */

import { describe, it, expect } from "vitest"
import Plant from "../../../src/plants/Plant.js"
import { validSeedlingPlant as validPlant } from "../testConstants.js"

describe("Plant source property", () => {
  it("should set the source correctly", () => {
    const plant = new Plant(validPlant)
    plant.source = "seed"
    expect(plant.source).toBe("seed")
  })

  it("should throw TypeError when provided source is not string", () => {
    // Test sending non-string value to constructor
    expect(() => new Plant({ ...validPlant, source: true })).toThrow(
      new TypeError("source must be a string")
    )
    expect(() => new Plant({ ...validPlant, source: 123 })).toThrow(
      new TypeError("source must be a string")
    )
    expect(() => new Plant({ ...validPlant, source: null })).toThrow(
      new TypeError("source must be a string")
    )

    // Test setting source to non-string value
    const plant = new Plant(validPlant)
    expect(() => (plant.source = true)).toThrow(
      new TypeError("source must be a string")
    )
    expect(() => (plant.source = 123)).toThrow(
      new TypeError("source must be a string")
    )
    expect(() => (plant.source = null)).toThrow(
      new TypeError("source must be a string")
    )
  })

  it("should throw an error when setting source to an unknown source", () => {
    const plant = new Plant(validPlant)
    expect(() => (plant.source = "Mars")).toThrow("Unknown source: Mars")
  })
})
