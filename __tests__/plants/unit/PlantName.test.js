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
    // Test sending non-string value to constructor
    // @ts-expect-error
    expect(() => new Plant({ name: true })).toThrowError(
      new TypeError("Name must be a string")
    )
    // @ts-expect-error
    expect(() => new Plant({ name: 123 })).toThrowError(
      new TypeError("Name must be a string")
    )
    // @ts-expect-error
    expect(() => new Plant({ name: null })).toThrowError(
      new TypeError("Name must be a string")
    )

    // Test setting name to non-string value
    const plant = new Plant({ name: "Bob" })
    expect(() => (plant.name = true)).toThrowError(
      new TypeError("Name must be a string")
    )
    expect(() => (plant.name = 123)).toThrowError(
      new TypeError("Name must be a string")
    )
    expect(() => (plant.name = null)).toThrowError(
      new TypeError("Name must be a string")
    )
  })

  test("should throw an error when setting name to undefined", () => {
    const plant = new Plant({ name: "Bob" })
    // @ts-expect-error
    expect(() => (plant.name = undefined)).toThrowError(
      new TypeError("Name is required")
    )
  })

  test("should throw an error when provided name is too short", () => {
    expect(() => new Plant({ name: "A" })).toThrow(
      "Name must be at least 2 characters"
    )

    const plant = new Plant({ name: "Bob" })
    expect(() =>
      (plant.name = "A").toThrow("Name must be at least 2 characters")
    )
  })

  test("should trim whitespace from name", () => {
    const plant = new Plant({ name: "  Bob  " })
    expect(plant.name).toBe("Bob")

    plant.name = " Alice\t"
    expect(plant.name).toBe("Alice")
  })
})
