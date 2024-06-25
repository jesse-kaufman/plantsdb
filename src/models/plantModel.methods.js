import { getNewStageDates } from '../utils/plantStages.js'

export const doUpdate = async function (plantId, data) {
  // Save a copy of the old plant for middleware
  this.$locals.oldPlant = this.toJSON()

  /*
   * Create plant update object from data sent, defaulting properties
   * to values from the database.
   *
   * ID is set after data object spread to prevent ID being overwritten
   */
  let plantUpdate = { ...this.toJSON(), ...data, _id: plantId }

  // Pull out dates from plant update object
  let {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    cureStartedOn,
    harvestedOn,
    archivedOn,
  } = plantUpdate

  // Get new dates based on stage and dates sent
  const stageDates = getNewStageDates(plantUpdate.stage, {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    cureStartedOn,
    harvestedOn,
    archivedOn,
  })

  // Add data to newPlant object
  plantUpdate = {
    ...plantUpdate,
    ...stageDates,
  }

  // Update plant object
  this.overwrite(plantUpdate)

  // Generate new plantAbbr (if needed)
  await this.generateAbbr()

  // Save changes to made plant to $locals for middleware
  this.$locals.changes = this.getChanges()

  try {
    // Save the plant
    this.save()
  } catch (err) {
    console.log(err)
    throw err
  }

  // Return true if modified, otherwise false
  return this.isModified()
}

/**
 * Generates a unique plant abbreviation based on the given plant name.
 */
const generateAbbr = async function () {
  if (this.$locals.oldPlant && this.$locals.oldPlant?.name === this.name) {
    console.log('No changes made to plant name')
    return
  }

  console.log('Generating new plant abbreviation')
  let newPlantAbbr = ''

  this.name.split(' ').forEach((part) => {
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
    status: 'active',
    plantAbbr: { $regex: `^${newPlantAbbr}\\-\\d+$` },
  }

  // Count existing plants with same plantId base
  const count = await this.constructor.countDocuments(countQuery)

  // Add 1 to the count of matching plants to create suffix
  this.plantAbbr = `${newPlantAbbr}-${count + 1}`
}

export default { doUpdate, generateAbbr }
