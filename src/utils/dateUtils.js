/**
 * @file Date utilities.
 */

/**
 * Adds given number of weeks to date and returns date object.
 * @param {Date} date - Date to be added to.
 * @param {number} weeks - Number of weeks to add.
 * @returns {Date} New date after adding weeks.
 */
export const addWeeksToDate = (date, weeks) => {
  if (!(date instanceof Date)) throw new TypeError("Invalid date")
  if (isNaN(date.valueOf())) throw new Error("Invalid date")

  const newDate = new Date(date) // Create a copy of the original date

  // eslint-disable-next-line no-magic-numbers
  newDate.setDate(newDate.getDate() + weeks * 7) // Add weeks (7 days per week)
  return newDate
}

/**
 * Validates date string.
 * @param {string} date - Date to be validated.
 * @returns {boolean} True if date is valid, false otherwise.
 */
/*
 * export const validateDate = (date) => {
 *   const parsedDate = new Date(date)
 *   return !isNaN(parsedDate.getTime())
 * }
 */
