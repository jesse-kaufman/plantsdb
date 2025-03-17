/* eslint-disable max-lines-per-function */
/**
 * @file Validations to ensure plant state is correct based on stage.
 */

import { validStages } from "../../config/constants.js"

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
        .add("vegStartedOn")
        .add("potentialHarvest")
      nullFields.add("flowerStartedOn").add("harvestedOn").add("cureStartedOn")
      break
    case "flower":
      requiredFields
        .add("startedOn")
        .add("vegStartedOn")
        .add("flowerStartedOn")
        .add("potentialHarvest")
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
  }

  // Validate required fields
  requiredFields.forEach((field) => {
    if (!dates[field]) {
      throw new Error(`${field} is required for ${stage} stage`)
    }
  })

  // Validate null fields
  nullFields.forEach((field) => {
    if (dates[field] !== null && dates[field] !== undefined) {
      throw new Error(`${field} must be null for ${stage} stage`)
    }
  })
}

/**
 * Validates the order of stage dates.
 * @param {object} dates - Dates to validate.
 */
export const validateStageDatesOrder = (dates) => {
  console.debug(dates)
  const stagePairs = [
    {
      prev: "startedOn",
      next: "vegStartedOn",
      message: "startedOn must come before vegStartedOn",
    },
    {
      prev: "vegStartedOn",
      next: "flowerStartedOn",
      message: "vegStartedOn must come before flowerStartedOn",
    },
    {
      prev: "flowerStartedOn",
      next: "harvestedOn",
      message: "flowerStartedOn must come before harvestedOn",
    },
    {
      prev: "harvestedOn",
      next: "cureStartedOn",
      message: "harvestedOn must come before cureStartedOn",
    },
  ]

  for (const { prev, next, message } of stagePairs) {
    if (
      dates[next] !== null &&
      dates[prev] !== null &&
      dates[prev] > dates[next]
    ) {
      throw new Error(message)
    }
  }
}
