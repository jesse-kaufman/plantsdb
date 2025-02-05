import { addWeeksToDate } from "../../../src/utils/dateUtils"

describe("addWeeksToDate", () => {
  it("should add 1 week to the date", () => {
    const startDate = new Date("2025-01-01")
    const result = addWeeksToDate(startDate, 1)
    const expected = new Date("2025-01-08")
    expect(result).toEqual(expected)
  })

  it("should add multiple weeks to the date", () => {
    const startDate = new Date("2025-01-01")
    const result = addWeeksToDate(startDate, 3)
    const expected = new Date("2025-01-22")
    expect(result).toEqual(expected)
  })

  it("should handle negative weeks and subtract weeks", () => {
    const startDate = new Date("2025-01-01")
    const result = addWeeksToDate(startDate, -1)
    const expected = new Date("2024-12-25")
    expect(result).toEqual(expected)
  })

  it("should handle edge cases with time zones (avoid DST issues)", () => {
    const startDate = new Date("2025-03-01T12:00:00Z") // UTC date
    const result = addWeeksToDate(startDate, 1)
    const expected = new Date("2025-03-08T12:00:00Z")
    expect(result).toEqual(expected)
  })

  it("should return the same date if 0 weeks are added", () => {
    const startDate = new Date("2025-01-01")
    const result = addWeeksToDate(startDate, 0)
    expect(result).toEqual(startDate)
  })

  it("should handle invalid date inputs", () => {
    const invalidDate = new Date("invalid-date")

    expect(() => {
      addWeeksToDate(invalidDate, 2)
    }).toThrow("Invalid date")
  })
})
