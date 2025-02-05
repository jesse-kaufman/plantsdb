/**
 * Tests for Plant class
 */
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
