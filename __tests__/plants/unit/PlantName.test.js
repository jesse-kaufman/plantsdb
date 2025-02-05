import Plant from "../../../src/plants/Plant"

describe("Plant name property", () => {
  test("should set the name correctly", () => {
    const plant = new Plant({ name: "Bob" })
    plant.name = "Alice"
    expect(plant.name).toBe("Alice")
  })

  test("should throw an error when name is empty string", () => {
    // Test the constructor with an empty string
    expect(() => new Plant({ name: "" })).toThrow("Name is required")

    // Test setting the name property to an empty string after initialization
    expect(() => {
      const plant = new Plant({ name: "Bob" })
      plant.name = ""
    }).toThrow("Name is required")
  })

  test("should throw TypeError when provided name is not string", () => {
    // @ts-expect-error
    expect(() => new Plant({ name: undefined })).toThrow(
      TypeError("Name is required")
    )
    // @ts-expect-error
    expect(() => new Plant({ name: true })).toThrow(
      TypeError("Name must be a string")
    )
    // @ts-expect-error
    expect(() => new Plant({ name: 123 })).toThrow(
      TypeError("Name must be a string")
    )
    // @ts-expect-error
    expect(() => new Plant({ name: null })).toThrow(
      TypeError("Name must be a string")
    )
  })

  test("should throw an error if name is too short", () => {
    expect(() => new Plant({ name: "A" })).toThrow(
      "Name must be at least 2 characters"
    )
  })

  test("should trim whitespace from name", () => {
    const plant = new Plant({ name: "  Bob  " })
    expect(plant.name).toBe("Bob")
  })
})
