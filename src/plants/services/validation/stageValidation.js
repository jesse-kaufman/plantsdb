/* eslint-disable max-lines-per-function */
/**
 * @file Validations to ensure plant state is correct based on stage.
 */

import { validStages } from "../../config/constants"

/**
 * Validates stage.
 * @param {string} [stage] - Stage to be validated.
 */
export const validateStage = (stage) => {
  // Require stage
  if (stage === undefined) {
    throw new Error("stage is required")
  }

  // Validate type of stage variable
  if (typeof stage !== "string") {
    throw new Error("Invalid stage provided")
  }

  // Validate stage exists
  if (!validStages.includes(stage)) {
    throw new Error(`Unknown plant stage: ${stage}`)
  }
}

/**
 * Validates dates against current plant stage.
 * @param {string} stage - Current stage of plant.
 * @param {object} dates - Date properties to validate.
 * @param {Date} dates.startedOn - Date plant was started.
 * @param {Date} [dates.vegStartedOn] - Date plant entered vegetative stage.
 * @param {Date} [dates.flowerStartedOn] - Date plant started flowering.
 * @param {Date} [dates.harvestedOn] - Date plant was harvested.
 * @param {Date} [dates.cureStartedOn] - Date plant entered curing stage.
 * @param {Date} [dates.potentialHarvest] - Estimated harvest date.
 * @throws {Error} If validation fails.
 */
export const validateStageDates = (stage, dates) => {
  const requiredFields = new Set()
  const nullFields = new Set()

  switch (stage) {
    case "seedling":
      requiredFields.add("startedOn").add("potentialHarvest")
      nullFields
        .add("vegStartedOn")
        .add("flowerStartedOn")
        .add("harvestedOn")
        .add("cureStartedOn")
      break
    case "veg":
      requiredFields
        .add("startedOn")
        .add("potentialHarvest")
        .add("vegStartedOn")
      nullFields.add("flowerStartedOn").add("harvestedOn").add("cureStartedOn")
      break
    case "flower":
      requiredFields
        .add("startedOn")
        .add("potentialHarvest")
        .add("vegStartedOn")
        .add("flowerStartedOn")
      nullFields.add("harvestedOn").add("cureStartedOn")
      break
    case "harvested":
      requiredFields
        .add("startedOn")
        .add("vegStartedOn")
        .add("flowerStartedOn")
        .add("harvestedOn")
      nullFields.add("potentialHarvest").add("cureStartedOn")
      break
    case "cure":
      requiredFields
        .add("startedOn")
        .add("vegStartedOn")
        .add("flowerStartedOn")
        .add("harvestedOn")
        .add("cureStartedOn")
      nullFields.add("potentialHarvest")
      break
    default:
      throw new Error(`Unknown plant stage: ${stage}`)
  }

  // Validate required fields
  requiredFields.forEach((field) => {
    if (!dates[field]) {
      throw new Error(`${field} is required for stage ${stage}.`)
    }
  })

  // Validate null fields
  nullFields.forEach((field) => {
    if (dates[field] !== null && dates[field] !== undefined) {
      throw new Error(`${field} must be null for stage ${stage}.`)
    }
  })
}
