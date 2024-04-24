const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      default: "info",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logs", logSchema);
