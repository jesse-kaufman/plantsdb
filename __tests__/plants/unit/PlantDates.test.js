/**
 * Tests for Plant dates
 */

import Plant from "../../../src/plants/Plant"

const validateErrorThrown = (plant, datePropertyName, expectedErrorThrown) => {
  let errorThrown = false

  // Common check: Ensure the date isn't in the future
  if (new Date(plant[datePropertyName]) > new Date()) {
    try {
      throw new Error(`${datePropertyName} cannot be in the future`)
    } catch (error) {
      errorThrown = true
      expect(error.message).toBe(expectedErrorMessage)
    }
  }

  if (!errorThrown) {
    throw new Error(`Expected error to be thrown for ${datePropertyName}`)
  }
}

describe("Plant started on date", () => {
  test("should throw an error when startedOn is set to invalid value", () => {
    const plant = new Plant({ name: "Bob" })
    expect(() => (plant.startedOn = "invalid date")).toThrow(
      "Invalid started on date"
    )
    // @ts-expect-error
    expect(() => (plant.startedOn = undefined)).toThrow(
      "Invalid started on date"
    )
  })
  test("should throw an error when startedOn is in the future", () => {
    const plant = new Plant({ name: "Bob" })

    expect(
      () =>
        (plant.startedOn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0])
    ).toThrow("Started on date cannot be in the future")
  })
  test("should throw an error when startedOn sent to constructor is in the future", () => {
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]

    expect(() => new Plant({ name: "Bob", startedOn: tomorrow })).toThrow(
      "Started on date cannot be in the future"
    )
  })
  test("should default to today's date when startedOn not provided to constructor", () => {
    const plant = new Plant({ name: "Bob" })
    expect(plant.startedOn).toEqual(
      new Date(new Date().toISOString().split("T")[0])
    )
  })

  test("should set the startedOn property correctly when provided to constructor", () => {
    const plant = new Plant({
      name: "Bob",
      stage: "veg",
      startedOn: "2023-01-01",
    })
    expect(plant.startedOn).toEqual(new Date("2023-01-01"))
  })

  test("should set the startedOn property correctly", () => {
    const plant = new Plant({ name: "Bob", stage: "veg" })
    plant.startedOn = "2023-01-01"
    expect(plant.startedOn).toEqual(new Date("2023-01-01"))
  })
})

// describe("Plant archived on date", () => {
//   test("should throw an error when archivedOn sent to constructor is invalid", () => {
//     // @ts-expect-error
//     expect(() => new Plant({ name: "Bob", archivedOn: false })).toThrow(
//       "Invalid archived on date"
//     )
//   })
//   test("should throw an error when archivedOn is set to invalid value", () => {
//     const plant = new Plant({ name: "Bob" })
//     expect(() => (plant.archivedOn = "invalid date")).toThrow(
//       "Invalid archived on date"
//     )
//     // @ts-expect-error
//     expect(() => (plant.archivedOn = undefined)).toThrow(
//       "Invalid archived on date"
//     )
//   })

//   test("should default to null when archivedOn is not provided to constructor", () => {
//     const plant = new Plant({ name: "Bob" })
//     expect(plant.archivedOn).toBeNull()
//   })

//   test("should throw an error when archivedOn is in the future", () => {
//     const plant = new Plant({ name: "Bob" })

//     expect(
//       () =>
//         (plant.archivedOn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
//           .toISOString()
//           .split("T")[0])
//     ).toThrow("Archived on date cannot be in the future")
//   })

//   test("should throw an error when archivedOn sent to constructor is in the future", () => {
//     const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0]

//     expect(() => new Plant({ name: "Bob", archivedOn: tomorrow })).toThrow(
//       "Archived on date cannot be in the future"
//     )
//   })

//   test("should throw an error if archivedOn is set and status isn't `archived`", () => {
//     const plant = new Plant({
//       name: "Bob",
//       status: "active",
//       archivedOn: "2023-01-01",
//     })
//     expect(plant.startedOn).toEqual(new Date("2023-01-01"))
//   })

//   test("should set the archivedOn property correctly when provided to constructor", () => {
//     const plant = new Plant({
//       name: "Bob",
//       status: "archived",
//       archivedOn: "2023-01-01",
//     })
//     expect(plant.startedOn).toEqual(new Date("2023-01-01"))
//   })

//   test("should set the startedOn property correctly", () => {
//     const plant = new Plant({ name: "Bob", stage: "veg" })
//     plant.startedOn = "2023-01-01"
//     expect(plant.startedOn).toEqual(new Date("2023-01-01"))
//   })
// })
