const mongoose = require("mongoose");
const moment = require("moment");
const {
  getValidPlantStatuses,
  getValidPlantSources,
  getValidPlantStages,
} = require("../utils/plantEnums");

const plantSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: getValidPlantStatuses(),
      default: "active",
    },
    name: {
      type: String,
      required: true,
      min: [3, "Plant name must be at least 3 characters."],
      max: [255, "Plant name must be shorter than 255 characters"],
      validate: {
        validator: (value) => {
          let retval =
            /^[\p{Letter}\p{Other_Symbol}\p{Punctuation}\p{Number}]+$/gmu.test(
              value
            );

          return retval;
        },
        message: (props) =>
          "'" +
          props.value +
          "' is not valid. Plant names must only contain letters, numbers, punctuation, and emoji characters.",
      },
    },
    plantAbbr: {
      type: String,
      required: true,
      min: [2, "Plant abbreviation must be at least 2 characters"],
      max: [10, "Plant abbreviation must be shorter than 10 characters"],
      validate: {
        validator: (value) => /[a-zA-Z0-9\-]+/.test(value),
        message: (props) =>
          "'" +
          props.value +
          "' is not valid. Plant names must only contain letters, numbers, and '-' characters.",
      },
    },
    source: {
      type: String,
      required: true,
      enum: getValidPlantSources(),
      default: "seed",
    },
    stage: {
      type: String,
      required: true,
      enum: getValidPlantStages(),
      default: "seedling",
    },
    startedOn: {
      type: Date,
      required: true,
      default: moment().format("YYYY-MM-DD"),
    },
    vegStartedOn: {
      type: Date,
      required: [
        () => ["veg", "flower", "harvested", "cure"].includes(this.stage),
        "required if stage is veg, flower, harvested, or cure",
      ],
    },
    flowerStartedOn: {
      type: Date,
      required: () => ["flower", "cure"].includes(this.stage),
    },
    potentialHarvest: {
      type: Date,
      default: () => {
        return moment().add(9, "weeks").format("YYYY-MM-DD");
      },
    },
    harvestedOn: {
      type: Date,
      required: () => ["harvested", "cure"].includes(this.stage),
    },
    cureStartedOn: {
      type: Date,
      required: () => this.stage === "cure",
    },
    archivedOn: {
      type: Date,
      required: () => this.status === "archived",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
