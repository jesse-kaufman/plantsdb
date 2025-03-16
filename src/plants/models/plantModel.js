/** @file Plant model. */
import { Schema, model } from "mongoose"

import {
  validStages,
  validStatuses,
  validSources,
} from "../config/constants.js"

const PlantSchema = new Schema(
  {
    status: {
      type: String,
      enum: validStatuses,
    },
    name: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: validSources,
    },
    stage: {
      type: String,
      required: true,
      enum: validStages,
    },
    startedOn: {
      type: Date,
      required: true,
      default: new Date().toISOString(),
    },
    vegStartedOn: {
      type: Date,
    },
    flowerStartedOn: {
      type: Date,
    },
    potentialHarvest: {
      type: Date,
    },
    harvestedOn: {
      type: Date,
    },
    cureStartedOn: {
      type: Date,
    },
    archivedOn: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default model("Plant", PlantSchema)
