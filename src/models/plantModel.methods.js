import { addLogEntry } from '../utils/log.js'
import { getChangeList } from '../utils/plantChangeService.js'
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

  // If plant is being archived, set archivedOn
  if (plantUpdate.status === 'archived') {
    plantUpdate.archivedOn = new Date().toISOString()
  }

  // Get the data to update plant stage and set dates accordingly
  if (plantUpdate.stage && plantUpdate.stage !== this.stage) {
    // Get dates based on new stage and request body
    const stageDates = getNewStageDates(plantUpdate.stage, {
      vegStartedOn: plantUpdate.vegStartedOn,
      flowerStartedOn: plantUpdate.flowerStartedOn,
      cureStartedOn: plantUpdate.cureStartedOn,
      harvestedOn: plantUpdate.harvestedOn,
    })

    // Add data to newPlant object
    plantUpdate = {
      ...plantUpdate,
      ...stageDates,
    }
  }

  // Update plant object
  this.overwrite(plantUpdate)

  // Generate new plantAbbr (if needed)
  await this.generateAbbr()

  // Save changes to made plant to $locals for middleware
  this.$locals.changes = this.getChanges()

  // Save the plant
  this.save()

  // Return true if modified, otherwise false
  return this.isModified()
}

/**
 * Generates a unique plant abbreviation based on the given plant name.
 */
const generateAbbr = async function () {
  if (this.$locals.oldPlant.name === this.name) return

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

  // Count existing plants with same plantId base
  const count = await this.constructor.countDocuments({
    status: 'active',
    plantId: { $regex: `^${newPlantAbbr}\\-\\d$` },
  })

  // Add 1 to the count of matching plants to create suffix
  this.plantAbbr = `${newPlantAbbr}-${count + 1}`
}

export default { doUpdate, generateAbbr }
