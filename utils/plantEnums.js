/**
 * Gets list of possible plant statuses
 *
 * @returns {Array} List of valid plant statuses
 */
exports.getValidPlantStatuses = () => ["active", "inactive", "archived"];

/**
 * Gets list of possible plant sources
 *
 * @returns {Array} List of valid plant sources
 */
exports.getValidPlantSources = () => ["seed", "clone"];

/**
 * Returns an array of valid stages for a plant.
 *
 * @returns {Array} An array of valid stages.
 */
exports.getValidPlantStages = () => [
  "seedling",
  "veg",
  "flower",
  "harvested",
  "cure",
];
