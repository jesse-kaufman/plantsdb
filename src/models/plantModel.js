import { Schema, model } from "mongoose";
import config from "../config/config.js";
import dayjs from "dayjs";
import statics from "./plantModel.statics.js";

/**
 * List of valid plant statuses.
 */
export const validStatuses = ["active", "inactive", "archived"];

/**
 * List of possible plant sources.
 */
export const validSources = ["seed", "clone"];

/**
 * Valid plant stages.
 */
export const validStages = ["seedling", "veg", "flower", "harvested", "cure"];

const PlantSchema = new Schema(
  {
    status: {
      type: String,
      enum: validStatuses,
      default: "active",
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          /^[\p{Letter}\\ \p{Punctuation}\p{Number}]{3,255}$/gmu.test(value),
        message: (props) =>
          `'${props.value}' is not valid. Plant names must only contain letters, numbers, and punctuation.`,
      },
    },
    plantAbbr: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /[a-zA-Z0-9-]{2,10}/.test(value),
        message: (props) =>
          `'${props.value}' is not valid. Plant abbreviations must only contain letters, numbers, and '-' characters.`,
      },
    },
    source: {
      type: String,
      required: true,
      enum: validSources,
      default: "seed",
    },
    stage: {
      type: String,
      required: true,
      enum: validStages,
      default: "seedling",
    },
    startedOn: {
      type: Date,
      required: true,
      default: new Date().toISOString(),
    },
    vegStartedOn: {
      type: Date,
      required: [
        function () {
          // Veg start date is required if stage is veg, flower, harvested, or cure
          return ["veg", "flower", "harvested", "cure"].includes(this.stage);
        },
        "required if stage is veg, flower, harvested, or cure.",
      ],
      validate: {
        validator: function () {
          // Veg started date must be after plant start date
          return this.vegStartedOn >= this.startedOn;
        },
        message: () => "Veg started date must be after start date.",
      },
    },
    flowerStartedOn: {
      type: Date,
      required: function () {
        // Require flowerStartedOn if stage is "flower", "harvested", or "cure"
        return ["flower", "harvested", "cure"].includes(this.stage);
      },
      validate: {
        validator: function () {
          // Flower started date must be after veg started date
          return this.flowerStartedOn >= this.vegStartedOn;
        },
        message: "Flower started date must be after veg started date.",
      },
    },
    potentialHarvest: {
      type: Date,
      default: () => {
        // Default potential harvest date is now + config.totalWeeks
        return dayjs().add(config.totalWeeks, "weeks").format("YYYY-MM-DD");
      },
    },
    harvestedOn: {
      type: Date,
      required: function () {
        // Require harvestedOn if stage is "harvested" or "cure"
        return ["harvested", "cure"].includes(this.stage);
      },
      validator: {
        validate: function () {
          // Harvest date must be after flower start date
          return this.harvestedOn >= this.flowerStartedOn;
        },
        message: "Harvested date must be after flower started date.",
      },
    },
    cureStartedOn: {
      type: Date,
      required: function () {
        // Require cureStartedOn if stage is cure
        return this.stage === "cure";
      },
      validator: {
        validate: function () {
          // Cure started date must be after harvest date
          return this.cureStartedOn >= this.harvestedOn;
        },
        message: "Cure started date must be after harvested date.",
      },
    },
    archivedOn: {
      type: Date,
      required: function () {
        // Require archivedOn if stage is archived
        return this.status === "archived";
      },
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

PlantSchema.statics.getById = statics.getById;
PlantSchema.statics.getAll = statics.getAll;
PlantSchema.statics.deleteOne = statics.deleteOne;
PlantSchema.statics.setupQuery = statics.setupQuery;
PlantSchema.statics.validStatuses = validStatuses;
PlantSchema.statics.validSources = validSources;
PlantSchema.statics.validStages = validStages;

export default model("Plant", PlantSchema);
