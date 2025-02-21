/* eslint-disable max-lines-per-function */
/**
 * @file Tests for date validation.
 */

import Plant from "../../../src/plants/Plant"

import { validSeedlingPlant, stageDateProperties } from "../testConstants"

const validPlant = { ...validSeedlingPlant }

describe("Plant - Date validation", () => {
  // Walk through stage date properties and test each
  stageDateProperties.forEach((prop) => {
    const { propertyName, ...plantObj } = prop
    let testPlant = {}
    let futureDate = null
    let tomorrow = null

    // Test each date property
    describe(`${propertyName} date`, () => {
      beforeEach(() => {
        futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 1) // Set to tomorrow
        tomorrow = futureDate.toISOString().split("T")[0]
        testPlant = { ...validPlant, ...plantObj }
      })

      // Test initializing plant with invalid string for date property
      it(`should throw an error when ${propertyName} sent to constructor is invalid date string`, () => {
        // Test setting date property to literal "invalid-date" string
        testPlant[propertyName] = "invalid-date"
        expect(() => new Plant(testPlant)).toThrow(
          `Invalid ${propertyName} date`
        )
        // Test setting date to empty string
        testPlant[propertyName] = ""
        expect(() => new Plant(testPlant)).toThrow(
          `Invalid ${propertyName} date`
        )
      })

      // Test initializing plant with date property in the future
      it(`should throw an error when ${propertyName} sent to constructor is in the future`, () => {
        testPlant[propertyName] = tomorrow
        expect(() => new Plant(testPlant)).toThrow(
          `${propertyName} date cannot be in the future`
        )
      })

      // Test setting date property to invalid string
      it(`should throw an error when ${propertyName} is set to invalid date string`, () => {
        const plant = new Plant(testPlant)

        // Test setting date property to literal "invalid-date" string
        expect(() => (plant[propertyName] = "invalid-date")).toThrow(
          `Invalid ${propertyName} date`
        )
        // Test setting date to empty string
        expect(() => (plant[propertyName] = "invalid-date")).toThrow(
          `Invalid ${propertyName} date`
        )
      })

      // Test setting date property to future date
      it(`should throw an error when ${propertyName} is set to date in the future`, () => {
        const plant = new Plant(testPlant)

        // Test setting date property to literal "invalid-date" string
        expect(() => (plant[propertyName] = tomorrow)).toThrow(
          `${propertyName} date cannot be in the future`
        )
      })
    })
  })
})
