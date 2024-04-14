const mongoose = require("mongoose");
const moment = require("moment");

const plantSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    plantId: {
      type: String,
      required: true,
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
      enum: ["seedling", "veg", "flower"],
      default: "seedling",
    },
    dateStarted: {
      type: Date,
      default: moment().format("YYYY-MM-DD"),
    },
    dateVegStarted: {
      type: Date,
    },
    dateFlowerStarted: {
      type: Date,
    },
    datePotentialHarvest: {
      type: Date,
      default: () => {
        return moment().add(9, "weeks").format("YYYY-MM-DD");
      },
    },
    dateHarvested: {
      type: Date,
    },
    dateCureStarted: {
      type: Date,
    },
    dateArchived: {
      type: Date,
    },
  },
  { timestamps: true }
);

const plantModel = mongoose.model("Plant", plantSchema);
module.exports = plantModel;
