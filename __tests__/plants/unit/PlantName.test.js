import Plant from "../../../src/plants/Plant"

describe("Plant - Name property", () => {
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

  test("should trim whitespace from name", () => {
    const plant = new Plant({ name: "  Bob  " })
    expect(plant.name).toBe("Basil")
  })

  test("should throw an error if name is too short", () => {
    expect(() => new Plant({ name: "A" })).toThrow(
      "Name must be at least 2 characters"
    )
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
