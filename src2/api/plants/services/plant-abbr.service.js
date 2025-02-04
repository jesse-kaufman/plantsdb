/**
 * Counts the number of plants that match the specified ID.
 * @param {import("mongodb").Collection} collection MongoDB collection
 * @param {string} abbr
 * @returns {Promise<number>} Number of matching plants.
 */
function countMatchingPlants(collection, abbr) {
  const countQuery = {
    status: "active",
    plantAbbr: { $regex: `^${abbr}\\-\\d+$` },
  }

  return collection.countDocuments(countQuery)
}

