/**
 * @file Tests for Plant dates.
 */

import Plant from "../../../src/plants/Plant"

import {
  validSeedlingPlant,
  validVegPlant,
  validFlowerPlant,
  validHarvestedPlant,
  validCurePlant,
} from "../testConstants"

// Test dates for seedling stage
describe("Seedling stage / date property congruency", () => {
  // Check seedling plant with vegStartedOn set
  it("should throw an error if vegStartedOn is set and stage is 'seedling'", () => {
    // Get valid seedling plant object and set vegStartedOn
    const plant = { ...validSeedlingPlant, vegStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "vegStartedOn must be null for seedling stage"
    )
  })

  // Check seedling plant with flowerStartedOn set
  it("should throw an error if flowerStartOn is set and stage is 'seedling'", () => {
    // Get valid seedling plant object and set flowerStartedOn
    const plant = { ...validSeedlingPlant, flowerStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "flowerStartedOn must be null for seedling stage"
    )
  })

  // Check seedling plant with harvestedOn set
  it("should throw an error if harvestedOn is set and stage is 'seedling'", () => {
    // Get valid seedling plant object and set harvestedOn
    const plant = { ...validSeedlingPlant, harvestedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "harvestedOn must be null for seedling stage"
    )
  })

  // Check seedling plant with cureStartedOn set
  it("should throw an error if cureStartedOn is set and stage is 'seedling'", () => {
    // Get valid seedling plant object and set cureStartedOn
    const plant = { ...validSeedlingPlant, cureStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "cureStartedOn must be null for seedling stage"
    )
  })
})

// Test dates for veg stage
describe("Veg stage / date property congruency", () => {
  // Check veg plant with vegStartedOn set to null
  it("should throw an error if vegStartedOn is null and stage is 'veg'", () => {
    // Get valid veg plant object and set vegStartedOn to null
    const plant = { ...validVegPlant, vegStartedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "vegStartedOn is required for veg stage"
    )
  })

  // Check veg plant with flowerStartedOn set
  it("should throw an error if flowerStartOn is set and stage is 'veg'", () => {
    // Get valid veg plant object and set flowerStartedOn
    const plant = { ...validVegPlant, flowerStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "flowerStartedOn must be null for veg stage"
    )
  })

  // Check veg plant with harvestedOn set
  it("should throw an error if harvestedOn is set and stage is 'veg'", () => {
    // Get valid veg plant object and set harvestedOn
    const plant = { ...validVegPlant, harvestedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "harvestedOn must be null for veg stage"
    )
  })

  // Check veg plant with cureStartedOn set
  it("should throw an error if cureStartedOn is set and stage is 'veg'", () => {
    // Get valid veg plant object and set cureStartedOn
    const plant = { ...validVegPlant, cureStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "cureStartedOn must be null for veg stage"
    )
  })
})

// Test dates for flower stage
describe("Flower stage / date property congruency", () => {
  // Check flower plant with flowerStartedOn set to null
  it("should throw an error if flowerStartedOn is null and stage is 'veg'", () => {
    // Get valid flower plant object and set flowerStartedOn to null
    const plant = { ...validFlowerPlant, flowerStartedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "flowerStartedOn is required for flower stage"
    )
  })

  // Check flower plant with harvestedOn set
  it("should throw an error if harvestedOn is set and stage is 'flower'", () => {
    // Get valid flower plant object and set harvestedOn
    const plant = { ...validFlowerPlant, harvestedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "harvestedOn must be null for flower stage"
    )
  })

  // Check flower plant with cureStartedOn set
  it("should throw an error if cureStartedOn is set and stage is 'flower'", () => {
    // Get valid flower plant object and set cureStartedOn
    const plant = { ...validFlowerPlant, cureStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "cureStartedOn must be null for flower stage"
    )
  })
})

// Test dates for harvested stage
describe("Harvested stage / date property congruency", () => {
  // Check harvested plant with harvestedOn set to null
  it("should throw an error if harvestedOn is null and stage is 'veg'", () => {
    // Get valid harvested plant object and set harvestedOn to null
    const plant = { ...validHarvestedPlant, harvestedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "harvestedOn is required for harvested stage"
    )
  })

  // Check harvested plant with cureStartedOn set
  it("should throw an error if cureStartedOn is set and stage is 'harvested'", () => {
    // Get valid harvested plant object and set cureStartedOn
    const plant = { ...validHarvestedPlant, cureStartedOn: "2023-01-01" }
    expect(() => new Plant(plant)).toThrow(
      "cureStartedOn must be null for harvested stage"
    )
  })
})

// Test dates for cure stage
describe("Cure stage / date property congruency", () => {
  // Check cure plant with cureStartedOn set to null
  it("should throw an error if cureStartedOn is null and stage is 'cure'", () => {
    // Get valid cureStartedOn plant object and set cureStartedOn to null
    const plant = { ...validCurePlant, cureStartedOn: null }
    expect(() => new Plant(plant)).toThrow(
      "cureStartedOn is required for cure stage"
    )
  })
})
