/**
 * Adds given number of weeks to date and returns date object.
 * @param {Date} date - Date to add weeks.
 * @param {number} weeks - Number of weeks to add.
 */
export const addWeeksToDate = (date, weeks) => {
  if (isNaN(date.valueOf())) throw new Error("Invalid date")

  const newDate = new Date(date) // Create a copy of the original date

  newDate.setDate(newDate.getDate() + weeks * 7) // Add weeks (7 days per week)
  return newDate
}

/**
 * Validates date string.
 * @param {string} date
 * @returns {boolean} True if date is valid, false otherwise.
 */
export const validateDate = (date) => {
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}
