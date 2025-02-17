/* eslint-disable max-lines-per-function */
/**
 * @file Plant stage tests.
 */
import Plant from "../../../src/plants/Plant"

describe("Plant - Stage property", () => {
  test("should throw an error when stage sent to constructor is invalid", () => {
    expect(
      () =>
        new Plant({
          name: "Bob",
          status: "active",
          stage: "",
          startedOn: "2023-01-01",
        })
    ).toThrow("Unknown plant stage: ")
    expect(() => new Plant({ name: "Bob", stage: true })).toThrow(
      "Invalid stage"
    )
  })

  test("should throw an error when setting stage to invalid value", () => {
    const plant = new Plant({
      name: "Bob",
      status: "active",
      stage: "seedling",
      startedOn: "2023-01-01",
    })
    expect(() => (plant.stage = undefined)).toThrow("Stage is required")
    expect(() => (plant.stage = "")).toThrow("Unknown plant stage: ")
    expect(() => (plant.stage = "left")).toThrow("Unknown plant stage: left")
    expect(() => (plant.stage = true)).toThrow("Invalid stage")
  })

  test("should default to seedling when stage not provided to constructor", () => {
    const plant = new Plant({
      name: "Bob",
      status: "active",
      stage: "seedling",
    })
    expect(plant.stage).toEqual("seedling")
  })

  test("should set the stage correctly when provided to constructor", () => {
    const plant = new Plant({
      name: "Bob",
      status: "active",
      startedOn: "2023-01-01",
      vegStartedOn: "2023-01-08",
      stage: "veg",
    })
    expect(plant.stage).toBe("veg")
  })

  test("should set the stage correctly", () => {
    const plant = new Plant({
      name: "Bob",
      status: "active",
      startedOn: "2023-01-01",
      vegStartedOn: "2023-01-08",
      stage: "veg",
    })
    plant.stage = "flower"
    expect(plant.stage).toBe("flower")
  })
})
