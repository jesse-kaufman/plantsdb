/**
 * @file Date service tests.
 */
import { calculatePotentialHarvest } from "../../../src/plants/services/dateService"
import { addWeeksToDate } from "../../../src/utils/dateUtils"

// Mock the addWeeksToDate function
jest.mock("../../../src/utils/dateUtils", () => {return {
  addWeeksToDate: jest.fn(),
}})

describe("calculatePotentialHarvest", () => {
  const mockDates = {
    startedOn: new Date(2023, 0, 1), // January 1, 2023
    vegStartedOn: new Date(2023, 1, 1), // February 1, 2023
    flowerStartedOn: new Date(2023, 2, 1), // March 1, 2023
  }

  const mockConfig = {
    vegWeeks: 4,
    flowerWeeks: 8,
    seedlingWeeks: 1,
  }

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks()
  })

  test("should calculate potential harvest date for seedling stage", () => {
    const stage = "seedling"
    const weeksToAdd =
      mockConfig.seedlingWeeks + mockConfig.vegWeeks + mockConfig.flowerWeeks
    const expectedHarvestDate = new Date(2023, 7, 1) // Expecting August 1, 2023

    // @ts-ignore
    addWeeksToDate.mockReturnValueOnce(expectedHarvestDate)
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toEqual(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(mockDates.startedOn, weeksToAdd)
  })

  test("should calculate potential harvest date for vegetative stage", () => {
    const stage = "vegetative"
    const weeksToAdd = mockConfig.vegWeeks + mockConfig.flowerWeeks
    const expectedHarvestDate = new Date(2023, 9, 1) // Expecting October 2, 2023

    // @ts-ignore
    addWeeksToDate.mockReturnValueOnce(expectedHarvestDate)
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toEqual(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(
      mockDates.vegStartedOn,
      weeksToAdd
    )
  })

  test("should calculate potential harvest date for flower stage", () => {
    const stage = "flower"
    const weeksToAdd = mockConfig.flowerWeeks
    const expectedHarvestDate = new Date(2023, 10, 1) // Expecting November 1, 2023

    // @ts-ignore
    addWeeksToDate.mockReturnValueOnce(expectedHarvestDate)
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toEqual(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(
      mockDates.flowerStartedOn,
      weeksToAdd
    )
  })

  test("should return null for harvested stage", () => {
    const stage = "harvested"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)
    expect(result).toBeNull()
  })

  test("should return null for cure stage", () => {
    const stage = "cure"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)
    expect(result).toBeNull()
  })

  test("should return null for unknown stage", () => {
    const stage = "unknown"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)
    expect(result).toBeNull()
  })
})
