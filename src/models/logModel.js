import { Schema, model } from "mongoose";

const LogSchema = new Schema(
  {
    plantId: {
      type: Schema.Types.ObjectId,
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

export default model("Logs", LogSchema);
