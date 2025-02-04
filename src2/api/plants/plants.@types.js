/** @file Contains type definition for StageDates */

/**
 * Type definition for plant source.
 * @typedef {"seed"|"clone"} PlantSource
 */

/**
 * Type defintion for plant status.
 * @typedef {"active"|"inactive"|"archived"} PlantStatus
 */

/**
 * Type defintion for plant stage.
 * @typedef {"seedling"|"veg"|"flower"|"harvested"|"cure"} PlantStage
 */

/**
 * Contains the stage dates for a plant.
 * @typedef {object} StageDates
 * @property {string} startedOn - Timestamp of start date.
 * @property {string} [potentialHarvest] - Timestamp of potential harvest date.
 * @property {string} [vegStartedOn] - Timestamp of date veg was started.
 * @property {string} [flowerStartedOn] - Timestamp of date flower was started.
 * @property {string} [harvestedOn] - Timestamp of harvest date.
 * @property {string} [cureStartedOn] - Timestamp of date cure was started.
 * @property {string} [archivedOn] - Timestamp of date archived.
 */

export default {}
