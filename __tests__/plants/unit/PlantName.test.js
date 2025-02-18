/**
 * @file Plant name tests.
 */

/* eslint-disable max-lines-per-function */

import Plant from "../../../src/plants/Plant"

const validPlant = {
  name: "Bob",
  status: "active",
  stage: "seedling",
  startedOn: "2023-01-01",
}

describe("Plant name property", () => {
  test("should set the name correctly", () => {
    const plant = new Plant(validPlant)
    plant.name = "Alice"
    expect(plant.name).toBe("Alice")
  })

  test("should throw an error when name is empty string or whitespace", () => {
    // Test the constructor with an empty string
    expect(() => new Plant({ ...validPlant, name: "" })).toThrow(
      "name is required"
    )

    // Test setting the name property to an empty string after initialization
    const plant = new Plant({ ...validPlant, name: "Bob" })
    expect(() => (plant.name = "")).toThrow("name is required")

    // Test the constructor with an empty string
    expect(() => new Plant({ ...validPlant, name: "   " })).toThrow(
      "name is required"
    )

    // Test setting the name property to an empty string after initialization
    expect(() => (plant.name = "   ")).toThrow("name is required")
  })

  test("should throw TypeError when provided name is not string", () => {
    // Test sending non-string value to constructor
    expect(() => new Plant({ ...validPlant, name: true })).toThrow(
      new TypeError("Name must be a string")
    )
    expect(() => new Plant({ ...validPlant, name: 123 })).toThrow(
      new TypeError("Name must be a string")
    )
    expect(() => new Plant({ ...validPlant, name: null })).toThrow(
      new TypeError("Name must be a string")
    )

    // Test setting name to non-string value
    const plant = new Plant(validPlant)
    expect(() => (plant.name = true)).toThrow(
      new TypeError("Name must be a string")
    )
    expect(() => (plant.name = 123)).toThrow(
      new TypeError("Name must be a string")
    )
    expect(() => (plant.name = null)).toThrow(
      new TypeError("Name must be a string")
    )
  })

  test("should throw an error when setting name to undefined", () => {
    const plant = new Plant(validPlant)
    expect(() => (plant.name = undefined)).toThrow("name is required")
  })

  test("should throw an error when provided name is too short", () => {
    // Test sending short name to constructor
    expect(() => new Plant({ ...validPlant, name: "A" })).toThrow(
      "Name must be at least 2 characters"
    )

    // Test setting short name in setter
    const plant = new Plant(validPlant)
    expect(() => (plant.name = "A")).toThrow(
      "Name must be at least 2 characters"
    )
  })

  test("should trim whitespace from name", () => {
    // Test trimming whitespace in constructor
    const plant = new Plant({ ...validPlant, name: "   Bob   " })
    expect(plant.name).toBe("Bob")

    // Test trimming whitespace in setter
    plant.name = " Alice\t"
    expect(plant.name).toBe("Alice")
  })
})
