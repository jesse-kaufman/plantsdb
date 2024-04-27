const plantModel = require("../models/plantModel");

exports.getPlantById = async (plantId, status = "active") => {
  let query = {
    _id: plantId,
    status: status,
  };
  return await plantModel.findOne(query);
};

/**
 * Generates a unique plant abbreviation based on the given plant name.
 *
 * @param {string} name - The name of the plant.
 * @returns {string} The unique plant abbreviation.
 */
exports.generatePlantAbbr = async function (name) {
  console.log("Generating plant abbreviation");
  let newPlantAbbr = "";

  name.split(" ").forEach((part) => {
    if (/^\d.*$/.test(part)) {
      // Use entire part if it is numeric
      newPlantAbbr += part;
    } else {
      // Use only first letter of non-numeric parts
      newPlantAbbr += part.charAt(0).toUpperCase();
    }
  });

  newPlantAbbr = newPlantAbbr.trim();
  console.log(newPlantAbbr);
  // Count existing plants with same plantId base
  const count = await plantModel.countDocuments({
    status: "active",
    plantId: { $regex: "^" + newPlantAbbr + "\\-\\d" },
  });
  console.log("Count: " + count);

  // Add 1 to the count of matching plants to create suffix
  return newPlantAbbr + "-" + (count + 1);
};
