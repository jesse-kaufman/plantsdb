/**
 * @file Tests for Plant dates.
 */

/* eslint-disable max-lines-per-function */

import Plant from "../../../src/plants/Plant"

const dateProperties = [
  {
    propertyName: "startedOn",
    status: "active",
    stage: "seedling",
  },
  {
    propertyName: "archivedOn",
    status: "archived",
  },
]

const testDate = "2023-01-01"

describe("Plant - Date properties", () => {
  // Run tests on each date property
  dateProperties.forEach((prop) => {
    const { propertyName, status, stage } = prop
    let testPlant = {}

    describe(`${propertyName} date`, () => {
      beforeEach(() => {
        testPlant = { name: "Bob", status, stage }
      })

      // Test successfully sending date to constructor
      it(`should set the ${propertyName} property correctly when provided to constructor`, () => {
        // Set the property being tested to the test date
        testPlant[propertyName] = testDate

        // Create plant and check
        const plant = new Plant(testPlant)
        expect(plant[propertyName]).toEqual(new Date(testDate))
      })

      // Test successfully setting date with setter
      it(`should set the ${propertyName} property correctly`, () => {
        // Create new plant object with stage/status and let dates init to defaults
        const plant = new Plant(testPlant)

        // Set the date property and check
        plant[propertyName] = testDate
        expect(plant[propertyName]).toEqual(new Date(testDate))
      })

      // Test setting date to invalid type in constructor
      it(`should throw an error when ${propertyName} sent to constructor is invalid`, () => {
        // Create TypeError to expect below
        const typeError = new TypeError(`Invalid ${propertyName} date`)

        // Test with null date
        testPlant[propertyName] = null
        expect(() => new Plant(testPlant)).toThrow(typeError)
        // Test with number
        testPlant[propertyName] = 123
        expect(() => new Plant(testPlant)).toThrow(typeError)
        // Test with object
        testPlant[propertyName] = {}
        expect(() => new Plant(testPlant)).toThrow(typeError)
        // Test with array
        testPlant[propertyName] = []
        expect(() => new Plant(testPlant)).toThrow(typeError)
      })

      // Test setting date property to invalid type with setter
      it(`should throw an error when ${propertyName} is set to invalid value`, () => {
        // Create new plant object with stage/status and let dates init to defaults
        const plant = new Plant(testPlant)

        // Create TypeError to expect below
        const typeError = new TypeError(`Invalid ${propertyName} date`)

        // Set date to non-string types
        expect(() => (plant[propertyName] = "invalid-date")).toThrow(typeError)
        expect(() => (plant[propertyName] = null)).toThrow(typeError)
        expect(() => (plant[propertyName] = undefined)).toThrow(typeError)
        expect(() => (plant[propertyName] = 123)).toThrow(typeError)
      })
    })
  })

  // Edge cases for startedOn date
  describe("startedOn date", () => {
    // Test initializing startedOn date to today when not provided to constructor
    it("should default to today when creating seedling without startedOn date", () => {
      const plant = new Plant({
        name: "Bob",
        status: "active",
        stage: "seedling",
      })

      expect(plant.startedOn).toEqual(
        new Date(new Date().toISOString().split("T")[0])
      )
    })
  })

  // Edge cases for archivedOn date
  describe("archivedOn date", () => {
    // Test initialization value of archivideOn is null
    it("should initialize archivedOn date properly", () => {
      // Test init value when status is active
      const activePlant = new Plant({ name: "Bob", status: "active" })
      expect(activePlant.archivedOn).toBeNull()

      // Test init value when status is archived
      const archivedPlant = new Plant({ name: "Bob", status: "archived" })
      expect(archivedPlant.archivedOn).toEqual(
        new Date(new Date().toISOString().split("T")[0])
      )
    })
  })
})
