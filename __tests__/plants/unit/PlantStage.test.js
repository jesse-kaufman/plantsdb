/**
 * @file Plant stage tests.
 */
import Plant from "../../../src/plants/Plant"

import {
  validSeedlingPlant as validPlant,
  validVegPlant,
} from "../testConstants"

describe("Plant - Stage property", () => {
  it("should throw an error when stage sent to constructor is invalid", () => {
    expect(
      () =>
        new Plant({
          ...validPlant,
          stage: "",
        })
    ).toThrow("Unknown plant stage: ")

    expect(
      () => new Plant({ name: "Bob", status: "active", stage: true })
    ).toThrow("Invalid stage")
  })

  it("should throw an error when setting stage to invalid value", () => {
    const plant = new Plant(validPlant)
    expect(() => (plant.stage = undefined)).toThrow("stage is required")
    expect(() => (plant.stage = "")).toThrow("Unknown plant stage: ")
    expect(() => (plant.stage = "left")).toThrow("Unknown plant stage: left")
    expect(() => (plant.stage = true)).toThrow("Invalid stage")
  })

  it("should set the stage correctly when provided to constructor", () => {
    const plant = new Plant(validVegPlant)
    expect(plant.stage).toBe("veg")
  })

  it("should set the stage correctly", () => {
    const plant = new Plant(validVegPlant)
    plant.stage = "flower"
    expect(plant.stage).toBe("flower")
  })
})
