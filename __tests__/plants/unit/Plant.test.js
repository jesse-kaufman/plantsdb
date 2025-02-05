/**
 * Tests for Plant class
 */
import Plant from "../../../src/plants/Plant"

describe("Plant", () => {
  describe("constructor", () => {
    it("should initialize properties with default values", () => {
      const plant = new Plant({ name: "Bob" })
      expect(plant.name).toBe("Bob")
      expect(plant.status).toBe("active")
      expect(plant.stage).toBe("seedling")
      expect(plant.startedOn).toEqual(
        new Date(new Date().toISOString().split("T")[0])
      )
    })

    test("should throw TypeError when passing non-object to constructor", () => {
      // @ts-expect-error
      expect(() => new Plant("Bob")).toThrow(TypeError("Invalid plant object"))
      // @ts-expect-error
      expect(() => new Plant(123)).toThrow(TypeError("Invalid plant object"))
      // @ts-expect-error
      expect(() => new Plant(null)).toThrow(TypeError("Invalid plant object"))
      // @ts-expect-error
      expect(() => new Plant(undefined)).toThrow(
        TypeError("Invalid plant object")
      )
    })

    test("should throw an error when name is missing", () => {
      // @ts-expect-error
      expect(() => new Plant({})).toThrow("Name is required")
    })

    test("should throw TypeError when passing invalid object to constructor", () => {
      // @ts-expect-error
      expect(() => new Plant({ name: "Bob", status: 1 })).toThrow(
        Error("Invalid status")
      )
    })
  })

  describe("status transitions", () => {
    let plant

    // Reset plant before each test
    beforeEach(() => {
      plant = new Plant({ name: "Bob" })
    })

    test("should set status to 'inactive' when delete() is called on an active plant", () => {
      plant.delete()
      expect(plant.status).toBe("inactive")
    })

    test("should set status to 'active' when undelete() is called on an inactive plant", () => {
      plant.delete()
      plant.undelete()
      expect(plant.status).toBe("active")
    })

    test("should set status to 'archived' when archive() is called on an archived plant", () => {
      plant.archive()
      expect(plant.status).toBe("archived")
    })

    test("should set status to 'active' when unarchive() is called on an archived plant", () => {
      plant.unarchive()
      expect(plant.status).toBe("active")
    })

    test("should set status to 'inactive' when delete() is called on an archived plant", () => {
      plant.archive()
      plant.delete()
      expect(plant.status).toBe("inactive")
    })
  })
})
