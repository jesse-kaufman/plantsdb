import Plant from "../../../src/plants/Plant"

describe("Plant constructor", () => {
  test("should throw an error if a non-object is passed to constructor", () => {
    // @ts-expect-error
    expect(() => new Plant("Bob")).toThrow("Invalid plant object")
    // @ts-expect-error
    expect(() => new Plant(123)).toThrow("Invalid plant object")
    // @ts-expect-error
    expect(() => new Plant(null)).toThrow("Invalid plant object")
    // @ts-expect-error
    expect(() => new Plant(undefined)).toThrow("Invalid plant object")
  })
  test("should throw an error when status sent to constructor is invalid", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: "Bob", status: 1 })).toThrow(
      "Invalid status"
    )
  })
})

describe("Plant - Status property", () => {
  test("should set status to `inactive` when delete() is called on an active plant", () => {
    const plant = new Plant({ name: "Bob", status: "active" })
    plant.delete()
    expect(plant.status).toEqual("inactive")
  })
  test("should set status to `inactive` when delete() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.delete()
    expect(plant.status).toEqual("inactive")
  })
  test("should set status to `active` when undelete() is called on an inactive plant", () => {
    const plant = new Plant({ name: "Bob", status: "inactive" })
    plant.undelete()
    expect(plant.status).toEqual("active")
  })
  test("should set status to `archived` when archive() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.archive()
    expect(plant.status).toEqual("archived")
  })
  test("should set status to `active` when unarchive() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.unarchive()
    expect(plant.status).toEqual("active")
  })
})

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
