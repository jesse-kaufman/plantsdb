import { calculatePotentialHarvest } from "../../plants/services/dateService"

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
  }
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks()
  })
  // test("should return ", () => {
  //   const potentialHarvest = calculatePotentialHarvest(stage, dates, config)
  //   expect(potentialHarvest).toBeNull()
  // })
  test("true is true", () => {
    expect(true).toBe(true)
  })
})
