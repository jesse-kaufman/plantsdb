/**
 * @file Tests for Plant dates.
 */

/* eslint-disable max-lines-per-function */

import Plant from "../../../src/plants/Plant"
import { validSeedlingPlant, stageDateProperties } from "../testConstants"

const validPlant = { ...validSeedlingPlant }

const testDate = "2023-01-01"

describe("Plant - Date properties", () => {
  // Run tests on each date property
  stageDateProperties.forEach((prop) => {
    const { propertyName, ...plantObj } = prop
    let testPlant = {}

    describe(`${propertyName} date`, () => {
      // Reset test plant before each test
      beforeEach(() => {
        testPlant = {
          ...validPlant,
          ...plantObj,
        }
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
        const requiredError = new Error(`${propertyName} is required`)

        // Set date to non-string types
        expect(() => (plant[propertyName] = "invalid-date")).toThrow(typeError)
        expect(() => (plant[propertyName] = undefined)).toThrow(requiredError)
        expect(() => (plant[propertyName] = 123)).toThrow(typeError)
      })
    })
  })

  /*
   * Edge cases
   */

  describe("startedOn date", () => {
    // Test initialization value of archivedOn is null
    it("should not allow startedOn to be null", () => {
      // Test sending null startedOn date to constructor
      expect(() => new Plant({ ...validPlant, startedOn: null })).toThrow(
        "startedOn is required"
      )

      // Try setting startedOn to null
      const plant = new Plant(validPlant)
      expect(() => (plant.startedOn = null)).toThrow("startedOn is required")
    })
  })

  // Edge cases for archivedOn date
  describe("archivedOn date", () => {
    // Test initialization value of archivedOn is null
    it("should initialize archivedOn date properly", () => {
      // Test init value when status is active
      const activePlant = new Plant({ ...validPlant, status: "inactive" })
      expect(activePlant.archivedOn).toBeNull()

      // Test init value when status is archived
      const archivedPlant = new Plant({
        ...validPlant,
        status: "archived",
        archivedOn: "2023-01-01",
      })
      expect(archivedPlant.archivedOn).toStrictEqual(new Date("2023-01-01"))
    })
  })
})
