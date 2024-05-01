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
          let retval = /^[\p{Letter}\\ \p{Punctuation}\p{Number}]+$/gmu.test(
            value
          );

          return retval;
        },
        message: (props) =>
          "'" +
          props.value +
          "' is not valid. Plant names must only contain letters, numbers, and punctuation.",
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
        function () {
          return ["veg", "flower", "harvested", "cure"].includes(this.stage);
        },
        "required if stage is veg, flower, harvested, or cure.",
      ],
      validate: {
        validator: function () {
          return this.vegStartedOn >= this.startedOn;
        },
        message: () => "Veg started date must be after start date.",
      },
    },
    flowerStartedOn: {
      type: Date,
      required: function () {
        return ["flower", "cure"].includes(this.stage);
      },
      validate: {
        validator: function () {
          return this.flowerStartedOn >= this.vegStartedOn;
        },
        message: () => "Flower started date must be after veg started date.",
      },
    },
    potentialHarvest: {
      type: Date,
      default: () => {
        return moment().add(9, "weeks").format("YYYY-MM-DD");
      },
    },
    harvestedOn: {
      type: Date,
      required: function () {
        return ["harvested", "cure"].includes(this.stage);
      },
      validator: {
        validate: function () {
          return this.harvestedOn >= this.flowerStartedOn;
        },
        message: () => "Harvested date must be after flower started date.",
      },
    },
    cureStartedOn: {
      type: Date,
      required: function () {
        this.stage === "cure";
      },
      validator: {
        validate: function () {
          this.cureStartedOn >= this.harvestedOn;
        },
        message: () => "Cure started date must be after harvested date.",
      },
    },
    archivedOn: {
      type: Date,
      required: function () {
        return this.status === "archived";
      },
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
