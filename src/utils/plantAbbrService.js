import PlantModel from "../models/plantModel.js";

/**
 * Generates a unique plant abbreviation based on the given plant name.
 *
 * @param {string} name - The name of the plant.
 * @returns {string} The unique plant abbreviation.
 */
export const generatePlantAbbr = async (name) => {
  console.log("Generating plant abbreviation");
  let newPlantAbbr = "";

  name.split(" ").forEach((part) => {
    if (/^\d.*$/.test(part)) {
      // Use entire part if it is numeric
      newPlantAbbr += part;
      // eslint-disable-next-line no-magic-numbers
    } else if (/^[a-zA-Z]$/.test(part.charAt(0).toUpperCase())) {
      // Use only first letter of non-numeric parts
      // eslint-disable-next-line no-magic-numbers
      newPlantAbbr += part.charAt(0).toUpperCase();
    }
  });

  newPlantAbbr = newPlantAbbr.trim();

  // Count existing plants with same plantId base
  const count = await PlantModel.countDocuments({
    status: "active",
    plantId: { $regex: `^${newPlantAbbr}\\-\\d$` },
  });

  // Add 1 to the count of matching plants to create suffix
  // eslint-disable-next-line no-magic-numbers
  return `${newPlantAbbr}-${count + 1}`;
};
