import { Schema, model } from "mongoose";
import config from "../config/config.js";
import dayjs from "dayjs";
import methods from "./plantModel.methods.js";
import middleware from "./plantModel.middleware.js";
import statics from "./plantModel.statics.js";

/**
 * List of valid plant statuses.
 */
const validStatuses = ["active", "inactive", "archived"];

/**
 * List of possible plant sources.
 */
const validSources = ["seed", "clone"];

/**
 * Valid plant stages.
 */
const validStages = ["seedling", "veg", "flower", "harvested", "cure"];

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
          return (
            /*
             * Inner dayjs() formats the date as YYYY-MM-DD firt (so times and
             * timezones don't affect the date). The outer dayjs() creates
             * a new date to compare the dates.
             */
            dayjs(dayjs(this.vegStartedOn).format("YYYY-MM-DD")) >=
            dayjs(dayjs(this.startedOn).format("YYYY-MM-DD"))
          );
        },
        message: "Veg started date must be after start date.",
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
          return (
            /*
             * Inner dayjs() formats the date as YYYY-MM-DD firt (so times and
             * timezones don't affect the date). The outer dayjs() creates
             * a new date to compare the dates.
             */
            dayjs(dayjs(this.flowerStartedOn).format("YYYY-MM-DD")) >=
            dayjs(dayjs(this.vegStartedOn).format("YYYY-MM-DD"))
          );
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
          return (
            /*
             * Inner dayjs() formats the date as YYYY-MM-DD firt (so times and
             * timezones don't affect the date). The outer dayjs() creates
             * a new date to compare the dates.
             */
            dayjs(dayjs(this.harvestedOn).format("YYYY-MM-DD")) >=
            dayjs(dayjs(this.flowerStartedOn).format("YYYY-MM-DD"))
          );
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
          return (
            /*
             * Inner dayjs() formats the date as YYYY-MM-DD firt (so times and
             * timezones don't affect the date). The outer dayjs() creates
             * a new date to compare the dates.
             */
            dayjs(dayjs(this.cureStartedOn).format("YYYY-MM-DD")) >=
            dayjs(dayjs(this.harvestedOn).format("YYYY-MM-DD"))
          );
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      startedOnDate: {
        get() {
          return dayjs(this.startedOn).format("YYYY-MM-DD");
        },
      },
      vegStartedOnDate: {
        get() {
          if (this.vegStartedOn != null) {
            return dayjs(this.vegStartedOn).format("YYYY-MM-DD");
          }
        },
      },
      flowerStartedOnDate: {
        get() {
          if (this.flowerStartedOn != null) {
            return dayjs(this.flowerStartedOn).format("YYYY-MM-DD");
          }
        },
      },
      harvestedOnDate: {
        get() {
          if (this.harvestedOn != null) {
            return dayjs(this.harvestedOn).format("YYYY-MM-DD");
          }
        },
      },
      cureStartedOnDate: {
        get() {
          if (this.cureStartedOn != null) {
            return dayjs(this.cureStartedOn).format("YYYY-MM-DD");
          }
        },
      },
      potentialHarvestDate: {
        get() {
          if (this.potentialHarvest != null) {
            return dayjs(this.potentialHarvest).format("YYYY-MM-DD");
          }
        },
      },
    },
  }
);

PlantSchema.post("save", middleware.postSave);

// Add static methods to schema
PlantSchema.statics.getById = statics.getById;
PlantSchema.statics.getAll = statics.getAll;
PlantSchema.statics.deleteOne = statics.deleteOne;
PlantSchema.statics.setupQuery = statics.setupQuery;

// Add plant config to schema
PlantSchema.statics.validStatuses = validStatuses;
PlantSchema.statics.validSources = validSources;
PlantSchema.statics.validStages = validStages;

// Add instance methods to schema
PlantSchema.methods.logChanges = methods.logChanges;
PlantSchema.methods.generatePlantAbbr = methods.generatePlantAbbr;

export default model("Plant", PlantSchema);
