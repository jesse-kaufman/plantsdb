const plantModel = require("../models/plantModel");

exports.generatePlantAbbr = async (name) => {
  let newPlantAbbr = "";
  name.split(" ").forEach((part) => {
    newPlantAbbr += part.charAt(0).toUpperCase();
  });
  newPlantAbbr = newPlantAbbr.trim();

  try {
    const count = await plantModel.countDocuments({
      status: "active",
      plantId: { $regex: "^" + newPlantAbbr + "\\-\\d" },
    });
    return newPlantAbbr + "-" + (count + 1);
  } catch (err) {
    throw new Error(err.message);
  }
};
