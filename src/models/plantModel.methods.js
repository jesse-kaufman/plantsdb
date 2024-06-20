import { addLogEntry } from "../utils/log.js";
import { getChangeList } from "../utils/plantChangesService.js";

const logChanges = async function (changes) {
  const changeList = getChangeList(changes, this.$locals.oldPlant);
  console.log(changeList);
  await addLogEntry(this._id, `Updated plant:\n• ${changeList.join("\n• ")}`);
};

/**
 * Generates a unique plant abbreviation based on the given plant name.
 */
const generatePlantAbbr = async function () {
  if (this.$locals.oldPlant.name !== this.name) return;

  console.log("Generating new plant abbreviation");
  let newPlantAbbr = "";

  this.name.split(" ").forEach((part) => {
    if (/^\d.*$/.test(part)) {
      // Use entire part if it is numeric
      newPlantAbbr += part;
    } else if (/^[a-zA-Z]$/.test(part.charAt(0).toUpperCase())) {
      // Use only first letter of non-numeric parts
      newPlantAbbr += part.charAt(0).toUpperCase();
    }
  });

  newPlantAbbr = newPlantAbbr.trim();

  // Count existing plants with same plantId base
  const count = await this.constructor.countDocuments({
    status: "active",
    plantId: { $regex: `^${newPlantAbbr}\\-\\d$` },
  });

  // Add 1 to the count of matching plants to create suffix
  this.plantAbbr = `${newPlantAbbr}-${count + 1}`;
};

export default { logChanges, generatePlantAbbr };
