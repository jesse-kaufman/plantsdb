/**
 * @file Tests for Plant dates.
 */

import Plant from "../../../src/plants/Plant"

import { validArchivedPlant, validDeletedPlant } from "../testConstants"

// Test archivedOn and deletedOn when status is archived
describe("Archived status / date property congruency", () => {
  // Check active plant with archivedOn set
  it("should throw an error if archivedOn is set and status isn't 'archived'", () => {
    // Get valid archived plant object and set status to active
    const plant = { ...validArchivedPlant, status: "active" }
    expect(() => new Plant(plant)).toThrow(
      "archivedOn must be null for status active"
    )
  })

  // Check archived plant with archivedOn = null
  it("should throw an error if status is 'archived' and archivedOn is not set", () => {
    // Get valid archived plant object and set archivedOn to null
    const plant = { ...validArchivedPlant, archivedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "archivedOn is required for status archived"
    )
  })

  // Check archived plant with deletedOn set
  it("should throw an error if status is 'archived' and deletedOn is set", () => {
    // Get valid archived plant object and set archivedOn to null
    const plant = { ...validArchivedPlant, deletedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "deletedOn must be null for status archived"
    )
  })
})

// Test deletedOn and archivedOn when status is deleted
describe("Deleted status / date property congruency", () => {
  // Check active plant with deletedOn set
  it("should throw an error if deletedOn is set and status isn't 'deleted'", () => {
    // Get valid deleted plant object and set status to active
    const plant = { ...validDeletedPlant, status: "active" }
    expect(() => new Plant(plant)).toThrow(
      "deletedOn must be null for status active"
    )
  })

  // Check deleted plant with deletedOn = null
  it("should throw an error if status is 'deleted' and deletedOn is not set", () => {
    // Get valid deleted plant object and set archivedOn to null
    const plant = { ...validDeletedPlant, deletedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "deletedOn is required for status inactive"
    )
  })

  // Check deleted plant with archivedOn set
  it("should throw an error if status is 'deleted' and archivedOn is set", () => {
    // Get valid archived plant object and set archivedOn to null
    const plant = { ...validArchivedPlant, deletedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "deletedOn must be null for status archived"
    )
  })
})
