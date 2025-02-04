import { calculatePotentialHarvest } from "../../plants/services/dateService"
import { addWeeksToDate } from "../../utils/dateUtils"

// Mock the addWeeksToDate function
jest.mock("../../utils/dateUtils", () => ({
  addWeeksToDate: jest.fn(),
}))

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
      mockConfig.seedlingWeeks + mockConfig.vegWeeks + mockConfig.flowerWeeks // seedlingWeeks + vegWeeks + flowerWeeks

    // Mock the addWeeksToDate return value
    const expectedHarvestDate = new Date(2023, 7, 1) // Expecting a date in August after adding weeks

    // @ts-ignore
    addWeeksToDate.mockReturnValue(expectedHarvestDate)

    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toBe(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(mockDates.startedOn, weeksToAdd)
  })

  test("should calculate potential harvest date for vegetative stage", () => {
    const stage = "vegetative"
    const weeksToAdd = mockConfig.vegWeeks + mockConfig.flowerWeeks

    const expectedHarvestDate = new Date(2023, 9, 1) // Expecting a date in October

    // @ts-ignore
    addWeeksToDate.mockReturnValue(expectedHarvestDate)

    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toBe(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(
      mockDates.vegStartedOn,
      weeksToAdd
    )
  })

  test("should calculate potential harvest date for flower stage", () => {
    const stage = "flower"
    const weeksToAdd = mockConfig.flowerWeeks

    const expectedHarvestDate = new Date(2023, 10, 1) // Expecting a date in November

    // @ts-ignore
    addWeeksToDate.mockReturnValue(expectedHarvestDate)

    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toBe(expectedHarvestDate)
    expect(addWeeksToDate).toHaveBeenCalledWith(
      mockDates.flowerStartedOn,
      weeksToAdd
    )
  })

  test("should return null for harvested stage", () => {
    const stage = "harvested"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)
    expect(result).toBeNull
  })

  test("should return null for cure stage", () => {
    const stage = "cure"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)
    expect(result).toBeNull
  })

  test("should return null for unknown stage", () => {
    const stage = "unknown"
    const result = calculatePotentialHarvest(stage, mockDates, mockConfig)

    expect(result).toBeNull()
  })
})
