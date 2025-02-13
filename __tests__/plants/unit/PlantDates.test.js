/* eslint-disable no-magic-numbers */
/**
 * @file Tests for Plant dates.
 */

/* eslint-disable max-lines-per-function */

import Plant from "../../../src/plants/Plant"

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 1) // Set to tomorrow
const tomorrow = futureDate.toISOString().split("T")[0]

/**
 * Helper function to assert that setting an invalid date throws the expected error.
 * @param {Plant} plant - The Plant instance to test.
 * @param {string} property - The name of the date property being tested.
 * @param {any} expectedError - The expected error to be thrown.
 */
function expectInvalidDateError(plant, property, expectedError) {
  expect(() => (plant[property] = "invalid-date")).toThrow(expectedError)
  expect(() => (plant[property] = null)).toThrow(expectedError)
  expect(() => (plant[property] = undefined)).toThrow(expectedError)
  expect(() => (plant[property] = 123)).toThrow(expectedError)
}

/**
 * Helper function to assert that setting a future date throws the expected error.
 * @param {Plant} plant - The Plant instance to test.
 * @param {string} property - The name of the date property being tested.
 */
function expectFutureDateError(plant, property) {
  expect(() => (plant[property] = tomorrow)).toThrow("cannot be in the future")
}

describe("Plant startedOn date", () => {
  // Test sending startedOn to constructor
  it("should set the startedOn property correctly when provided to constructor", () => {
    const plant = new Plant({
      name: "Bob",
      stage: "seedling",
      startedOn: "2023-01-01",
    })
    expect(plant.startedOn).toEqual(new Date("2023-01-01"))
  })

  // Test setting startedOn with setter
  it("should set the startedOn property correctly", () => {
    const plant = new Plant({ name: "Bob", stage: "veg" })
    plant.startedOn = "2023-01-01"
    expect(plant.startedOn).toEqual(new Date("2023-01-01"))
  })

  // Test setting startedOn to invalid date in constructor
  it("should throw an error when startedOn sent to constructor is invalid", () => {
    expect(() => new Plant({ name: "Bob", startedOn: "invalid-date" })).toThrow(
      "Invalid startedOn date"
    )
    expect(() => new Plant({ name: "Bob", startedOn: null })).toThrow(
      "Invalid startedOn date"
    )
    expect(() => new Plant({ name: "Bob", startedOn: 123 })).toThrow(
      "Invalid startedOn date"
    )
  })

  // Test setting startedOn to invalid date with setter
  // eslint-disable-next-line jest/expect-expect
  it("should throw an error when startedOn is set to invalid value", () => {
    expectInvalidDateError(
      new Plant({ name: "Bob" }),
      "startedOn",
      "Invalid startedOn date"
    )
  })

  // Test setting startedOn to future date in constructor
  test("should throw an error when startedOn sent to constructor is in the future", () => {
    expect(() => new Plant({ name: "Bob", startedOn: tomorrow })).toThrow(
      "startedOn date cannot be in the future"
    )
  })

  // Test initializing startedOn date to today when not provided to constructor
  it("should default to today's date when startedOn not provided to constructor", () => {
    const plant = new Plant({ name: "Bob" })
    expect(plant.startedOn).toEqual(
      new Date(new Date().toISOString().split("T")[0])
    )
  })

  // Test when startedOn is in the future
  // eslint-disable-next-line jest/expect-expect
  it("should throw an error when startedOn is in the future", () => {
    const plant = new Plant({ name: "Bob" })
    expectFutureDateError(plant, "startedOn")
  })
})

describe("Plant archivedOn date", () => {
  // Test sending invalid date to constructor
  it("should throw an error when archivedOn sent to constructor is invalid", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: "Bob", archivedOn: false })).toThrow(
      "Invalid archivedOn date"
    )
  })

  // Test setting archivedOn to invalid value
  it("should throw an error when archivedOn is set to invalid value", () => {
    const plant = new Plant({ name: "Bob" })
    expect(() => (plant.archivedOn = "invalid date")).toThrow(
      "Invalid archivedOn date"
    )

    // @ts-expect-error
    expect(() => (plant.archivedOn = undefined)).toThrow(
      "Invalid archivedOn date"
    )
  })

  it("should default to null when archivedOn is not provided to constructor", () => {
    const plant = new Plant({ name: "Bob" })
    expect(plant.archivedOn).toBeNull()
  })

  it("should throw an error when archivedOn is in the future", () => {
    const plant = new Plant({ name: "Bob" })
    expect(
      () =>
        (plant.archivedOn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0])
    ).toThrow("archivedOn date cannot be in the future")
  })

  // Test sending future archivedOn date to constructor
  it("should throw an error when archivedOn sent to constructor is in the future", () => {
    expect(() => new Plant({ name: "Bob", archivedOn: tomorrow })).toThrow(
      "archivedOn date cannot be in the future"
    )
  })

  // Test that archivedOn is set correctly when sent to constructors and plant is archived
  it("should set the archivedOn property correctly when provided to constructor", () => {
    const date = "2023-01-01"
    const plant = new Plant({
      name: "Bob",
      status: "archived",
      archivedOn: date,
    })
    expect(plant.archivedOn).toEqual(new Date(date))
  })

  it("should set the archivedOn property correctly", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    const date = "2023-01-01"
    plant.archivedOn = date
    expect(plant.archivedOn).toEqual(new Date(date))
  })
})
