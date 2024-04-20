const plantModel = require("../models/plantModel");

exports.generatePlantId = async (name) => {
  let newPlantId = "";
  name.split(" ").forEach((part) => {
    newPlantId += part.charAt(0).toUpperCase();
  });
  newPlantId = newPlantId.trim();

  try {
    const count = await plantModel.countDocuments({
      status: "active",
      plantId: { $regex: "^" + newPlantId + "\\-\\d" },
    });
    return newPlantId + "-" + (count + 1);
  } catch (error) {
    throw new Error(error.message);
  }
};
