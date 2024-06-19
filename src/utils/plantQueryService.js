/**
 * Plant Query Service
 *
 * Provides functions to build a query for use in selecting plants from
 * the database.
 */
import mongoose from "mongoose";

/**
 * Sets up the status filter for the plant query
 * @param {*} status
 * @param {*} validStatuses
 * @returns
 */
const setupStatusFilter = (status, validStatuses) => {
  if (status === "any") return {};

  if (Array.isArray(status) === true) {
    const statusArray = status.map((statusItem) =>
      validStatuses.includes(statusItem) ? statusItem : null
    );
    return { $in: statusArray };
  }

  if (status != null) return status;

  return "active";
};

/**
 * Sets up the stage filter for the plant query
 *
 * @param {*} stage
 * @param {*} validStages
 * @returns object|null
 */
const setupStageFilter = (stage, validStages) => {
  // Variable stages is an array, filter out any invalid stages.
  if (Array.isArray(stage) === true) {
    const stageArray = stage.map((stageItem) =>
      validStages.includes(stageItem) ? stageItem : null
    );
    return { $in: stageArray };
  }

  // Variable stages is set but not an array, return string
  if (stage != null) return stage;

  // Variable stages is not set, return null
  return null;
};

/**
 * Sets up plant query
 *
 * @param {*} config
 * @param {*} PlantSchema
 * @returns
 */
const setup = function (config, PlantSchema) {
  const { plantId, status, stage } = config;
  const { validStatuses, validStages } = PlantSchema;
  const statusFilter = setupStatusFilter(status, validStatuses);
  const stageFilter = setupStageFilter(stage, validStages);

  // Default to filtering by statusFilter
  let query = { status: statusFilter };

  // Add stage filter to query if set
  if (stageFilter) {
    query = { ...query, stage: stageFilter };
  }

  // Add plantId filter to query if set
  if (plantId != null) {
    query = {
      ...query,
      _id: mongoose.Types.ObjectId.createFromHexString(plantId),
    };
  }

  return query;
};

export default {
  setup,
  setupStatusFilter,
  setupStageFilter,
};
