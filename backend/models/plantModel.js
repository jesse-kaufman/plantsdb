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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", plantSchema);
