import Plant from "../../plants/Plant"

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
})

describe("Plant name", () => {
  test("should throw an error when name is not provided", () => {
    // @ts-expect-error
    expect(() => new Plant({})).toThrow("Name is required")
  })
  test("should throw an error when name is empty string", () => {
    expect(() => new Plant({ name: "" })).toThrow("Name is required")
  })
  test("should throw an error when name is not string", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: undefined })).toThrow("Name is required")
    // @ts-expect-error
    expect(() => new Plant({ name: true })).toThrow("Invalid name")
    // @ts-expect-error
    expect(() => new Plant({ name: 123 })).toThrow("Invalid name")
    // @ts-expect-error
    expect(() => new Plant({ name: null })).toThrow("Invalid name")
  })
  test("should initialize the name correctly", () => {
    const plant = new Plant({ name: "Bob" })
    expect(plant.name).toBe("Bob")
  })
  test("should set the name correctly", () => {
    const plant = new Plant({ name: "Bob" })
    plant.name = "Alice"
    expect(plant.name).toBe("Alice")
  })
})

describe("Plant status", () => {
  test("should throw an error when status sent to constructor is invalid", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: "Bob", status: 1 })).toThrow(
      "Invalid status"
    )
  })
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

describe("Plant stage", () => {
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

describe("Plant started on date", () => {
  test("should throw an error when startedOn sent to constructor is invalid", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: "Bob", startedOn: false })).toThrow(
      "Invalid started on date"
    )
  })
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
    console.log(
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    )

    expect(
      () =>
        (plant.startedOn = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0])
    ).toThrow("Started on date cannot be in the future")
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
