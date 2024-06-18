/**
 * Gets list of possible plant statuses
 *
 * @returns {Array} List of valid plant statuses
 */
export const getValidPlantStatuses = () => ["active", "inactive", "archived"];

/**
 * Gets list of possible plant sources
 *
 * @returns {Array} List of valid plant sources
 */
export const getValidPlantSources = () => ["seed", "clone"];

/**
 * Returns an array of valid stages for a plant.
 *
 * @returns {Array} An array of valid stages.
 */
export const getValidPlantStages = () => [
  "seedling",
  "veg",
  "flower",
  "harvested",
  "cure",
];
