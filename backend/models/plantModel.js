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

/**
 * Generates a unique plant abbreviation based on the given plant name.
 *
 * @param {string} name - The name of the plant.
 * @returns {string} The unique plant abbreviation.
 */
plantSchema.methods.generatePlantAbbr = async function () {
  let newPlantAbbr = "";
  this.name.split(" ").forEach((part) => {
    if (/\d.*$/.test(part)) {
      // Use entire part if it is numeric
      newPlantAbbr += part;
    } else {
      // Use only first letter of non-numeric parts
      newPlantAbbr += part.charAt(0).toUpperCase();
    }
  });

  newPlantAbbr = newPlantAbbr.trim();

  // Count existing plants with same plantId base
  const count = await plantModel.countDocuments({
    status: "active",
    plantId: { $regex: "^" + newPlantAbbr + "\\-\\d" },
  });

  // Add 1 to the count of matching plants to create suffix
  this.plantAbbr = newPlantAbbr + "-" + (count + 1);
};

module.exports = mongoose.model("Plant", plantSchema);
