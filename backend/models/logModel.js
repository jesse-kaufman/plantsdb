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
  },
  { timestamps: true }
);

const logModel = mongoose.model("Logs", logSchema);
module.exports = logModel;
