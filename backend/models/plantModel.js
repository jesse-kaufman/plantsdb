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
    plantAbbr: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: getValidPlantSources(),
      default: "seed",
    },
    name: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    stage: {
      type: String,
      required: true,
      enum: getValidPlantStages(),
      default: "seedling",
    },
    startedOn: {
      type: Date,
      default: moment().format("YYYY-MM-DD"),
    },
    vegStartedOn: {
      type: Date,
    },
    flowerStartedOn: {
      type: Date,
    },
    potentialHarvest: {
      type: Date,
      default: () => {
        return moment().add(9, "weeks").format("YYYY-MM-DD");
      },
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
  },
  { timestamps: true }
);

const plantModel = mongoose.model("Plant", plantSchema);
module.exports = plantModel;
