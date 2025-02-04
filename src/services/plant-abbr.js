/**
 * Generates a unique plant abbreviation based on the given plant name.
 */
const generateAbbr = async function (plant) {
  if (plant.$locals.oldPlant && plant.$locals.oldPlant?.name === plant.name) {
    console.log("No changes made to plant name")
    return
  }

  console.log("Generating new plant abbreviation")
  let newPlantAbbr = ""

  plant.name.split(" ").forEach((part) => {
    if (/^\d.*$/.test(part)) {
      // Use entire part if it is numeric
      newPlantAbbr += part
    } else if (/^[a-zA-Z]$/.test(part.charAt(0).toUpperCase())) {
      // Use only first letter of non-numeric parts
      newPlantAbbr += part.charAt(0).toUpperCase()
    }
  })

  newPlantAbbr = newPlantAbbr.trim()

  const countQuery = {
    status: "active",
    plantAbbr: { $regex: `^${newPlantAbbr}\\-\\d+$` },
  }

  // Count existing plants with same plantId base
  const count = await plant.constructor.countDocuments(countQuery)

  // Add 1 to the count of matching plants to create suffix
  return `${newPlantAbbr}-${count + 1}`
}

export default { generateAbbr }
