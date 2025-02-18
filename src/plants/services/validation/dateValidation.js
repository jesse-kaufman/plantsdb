/**
 * @file Date validation routines.
 */

/**
 * Validates date property.
 * @param {string} property - Name of date property being validated.
 * @param {string} [dateString] - String being validated as date.
 * @param {boolean} [required] - True if started on date is required.
 * @throws {Error} If date is invalid.
 */
// eslint-disable-next-line complexity
export const validateDate = (property, dateString, required = true) => {
  // Allow undefined date if required is false
  if (!required && dateString === undefined) return

  // Do not allow undefined date
  if (dateString === undefined) {
    throw new Error(`${property} is required`)
  }

  // If property being checked is started on, do not allow null date
  if (dateString === null && property === "startedOn") {
    throw new Error(`${property} is required`)
  }

  // Require dateString to be null or a string
  if (dateString !== null && typeof dateString !== "string") {
    throw new Error(`Invalid ${property} date`)
  }

  const parsedDate = new Date(dateString)

  // Expect invalid date if time is not a number
  if (isNaN(parsedDate.getTime())) throw new Error(`Invalid ${property} date`)

  const today = new Date(new Date().toISOString().split("T")[0])

  if (parsedDate > today) {
    throw new Error(`${property} date cannot be in the future`)
  }
}
