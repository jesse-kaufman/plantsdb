const plantModel = require("../models/plantModel");

/**
 * Generates a unique plant abbreviation based on the given plant name.
 *
 * @param {string} name - The name of the plant.
 * @returns {string} The unique plant abbreviation.
 */
exports.generatePlantAbbr = async (name) => {
  let newPlantAbbr = "";
  name.split(" ").forEach((part) => {
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
  try {
    const count = await plantModel.countDocuments({
      status: "active",
      plantId: { $regex: "^" + newPlantAbbr + "\\-\\d" },
    });

    // Add 1 to the count of matching plants to create suffix
    return newPlantAbbr + "-" + (count + 1);
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.getPlantById = async (plantId, status = "active") => {
  try {
    let query = {
      _id: plantId,
      status: status,
    };
    return await plantModel.findOne(query);
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
