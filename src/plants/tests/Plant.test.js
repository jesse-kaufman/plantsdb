import Plant from "../classes/Plant"

describe("Plant Constructor", () => {
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

describe("Plant Name", () => {
  test("should throw an error when name is not provided", () => {
    expect(() => new Plant({})).toThrow("Name is required")
  })
  test("should throw an error when name is empty string", () => {
    expect(() => new Plant({ name: "" })).toThrow("Name is required")
  })
  test("should throw an error when name is not string", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: true })).toThrow("Invalid name")
    // @ts-expect-error
    expect(() => new Plant({ name: 123 })).toThrow("Invalid name")
    // @ts-expect-error
    expect(() => new Plant({ name: null })).toThrow("Invalid name")
    expect(() => new Plant({ name: undefined })).toThrow("Name is required")
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
