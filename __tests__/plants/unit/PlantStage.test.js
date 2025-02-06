import Plant from "../../../src/plants/Plant"

describe("Plant - Stage property", () => {
  test("should throw an error when stage sent to constructor is invalid", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: "Bob", stage: 1 })).toThrow("Invalid stage")
  })

  test("should throw an error when setting stage to invalid value", () => {
    const plant = new Plant({ name: "Bob" })
    // @ts-expect-error
    expect(() => (plant.stage = undefined)).toThrow("Stage is required")
    expect(() => (plant.stage = "left")).toThrow("Invalid stage")
    expect(() => (plant.stage = "")).toThrow("Invalid stage")
    expect(() => (plant.stage = true)).toThrow("Invalid stage")
  })

  test("should default to seedling when stage not provided to constructor", () => {
    const plant = new Plant({ name: "Bob" })
    expect(plant.stage).toEqual("seedling")
  })

  test("should set the stage correctly if stage is provided to constructor", () => {
    const plant = new Plant({ name: "Bob", stage: "veg" })
    expect(plant.stage).toBe("veg")
  })

  test("should set the stage correctly", () => {
    const plant = new Plant({ name: "Bob", stage: "veg" })
    plant.stage = "flower"
    expect(plant.stage).toBe("flower")
  })
})
