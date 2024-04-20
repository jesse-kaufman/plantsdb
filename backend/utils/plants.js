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

exports.getChangeList = (newPlant, oldPlant) => {
  let changeList = [];

  if (newPlant.stage && newPlant.stage !== oldPlant.stage) {
    changeList.push("Stage changed to " + newPlant.stage);
  }

  if (
    newPlant.vegStartedOn &&
    newPlant.vegStartedOn !== oldPlant.vegStartedOn
  ) {
    changeList.push("Veg start date");
  }

  if (
    newPlant.flowerStartedOn &&
    newPlant.flowerStartedOn !== oldPlant.flowerStartedOn
  ) {
    changeList.push("Flower start date");
  }

  if (
    newPlant.cureStartedOn &&
    newPlant.cureStartedOn !== oldPlant.cureStartedOn
  ) {
    changeList.push("Cure start date");
  }

  if (newPlant.harvestedOn && newPlant.harvestedOn !== oldPlant.harvestedOn) {
    changeList.push("Harvested on date");
  }

  if (newPlant.name && newPlant.name !== oldPlant.name) {
    changeList.push("Plant name");
  }

  if (newPlant.plantAbbr && newPlant.plantAbbr !== oldPlant.plantAbbr) {
    changeList.push("Plant abbreviation");
  }

  return changeList;
};
