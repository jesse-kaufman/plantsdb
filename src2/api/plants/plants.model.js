/** @file Contains plant model. */

/**
 * @typedef {import("./plants.@types.js").PlantStatus} PlantStatus
 * @typedef {import("./plants.@types.js").PlantStage} PlantStage
 * @typedef {import("./plants.@types.js").PlantSource} PlantSource
 */

import { ObjectId } from "mongodb"
import mongodb from "../../services/db.service.js"

const collection = mongodb.collection("plants")

/** Represents a plant. */
class Plant {
  /*
   * Static class properties
   */

  /** MongoDB collection instance. */
  static collection = collection

  /** Valid plant statuses. */
  static validStatuses = ["active", "inactive", "archived"]

  /** Valid plant sources. */
  static validSources = ["seed", "clone"]

  /** Valid plant stages */
  static validStages = ["seedling", "veg", "flower", "harvested", "cure"]

  /*
   * Class instance properties
   */

  /** @type {string|undefined} Database ID of plant. */
  _id

  /** @type {PlantStatus} Status of plant. */
  status = "active"

  /** @type {string} Name of plant. */
  name = ""

  /** @type {string} Abbreviation for plant. */
  plantAbbr = ""

  /** @type {PlantSource} Source of plant. */
  source = "seed"

  /** @type {PlantStage} Current stage of plant. */
  stage = "seedling"

  /** @type {Date} Date plant was started. */
  startedOn = new Date()

  /** @type {Date|undefined} Date plant started veg stage. */
  vegStartedOn

  /** @type {Date|undefined} Date plant started flower stage. */
  flowerStartedOn

  /** @type {Date|undefined} Date plant was harvested. */
  cureStartedOn

  /** @type {Date|undefined} Date plant was archived. */
  harvestedOn

  /** @type {Date|undefined} Date plant was cured. */
  archivedOn

  /** @type {string} Additional notes about plant. */
  notes = ""

  /**
   * Constructor for the Plant class.
   * @param {object} data - An object containing plant data.
   * @param {string} [data._id] - Database ID of the plant.
   * @param {PlantStatus} [data.status] - The status of the plant.
   * @param {string} [data.name] - The name of the plant.
   * @param {string} [data.plantAbbr] - Abbreviation of plant.
   * @param {PlantSource} [data.source] - The source of the plant.
   * @param {PlantStage} [data.stage] - Stage of the plant.
   * @param {Date} [data.startedOn] - The date the plant was started.
   * @param {Date} [data.vegStartedOn] - The date veg was started.
   * @param {Date} [data.flowerStartedOn] - The date flower was started.
   * @param {Date} [data.harvestedOn] - The date of harvest.
   * @param {Date} [data.cureStartedOn] - The date cure was started.
   * @param {Date} [data.archivedOn] - The date the plant was archived.
   * @param {string} [data.notes] - Notes about the plant.
   */
  constructor(data) {
    if (data) {
      const name = data?.name || this.name
      const plantAbbr = data?.plantAbbr || this.generatePlantAbbr()

      this._id = data._id || data._id
      this.status = data?.status || this.status
      this.name = name
      this.plantAbbr = this.source = data?.source || this.source
      this.stage = data?.stage || this.stage
      this.startedOn = data?.startedOn || this.startedOn
      this.vegStartedOn = data?.vegStartedOn
      this.flowerStartedOn = data?.flowerStartedOn
      this.cureStartedOn = data?.cureStartedOn
      this.harvestedOn = data?.harvestedOn
      this.archivedOn = data?.archivedOn
      this.notes = data.notes || this.notes
    }
  }

  /*
   * Static methods
   */

  /**
   * Gets a plant by its database ID.
   * @param {string} id - ID of plant to retrieve.
   * @returns {Promise<?Plant>} Found plant object or null if none found.
   */
  static async getById(id) {
    try {
      // Get plant from database
      const plantData = await collection.findOne({
        _id: new ObjectId(id),
      })

      // Return a plant instance
      if (plantData) return new Plant(plantData.toJSON())
    } catch (err) {
      console.error("Error fetching plant from database:", err)
    }

    return null
  }

  /*
   * Class methods
   */

  /**
   * Deletes plant from the database.
   */
  async delete() {
    try {
      // Delete plant from database
      await collection.deleteOne({ _id: new ObjectId(this._id) })
    } catch (err) {
      console.error("Error deleting plant from database:", err)
    }
  }

  validate() {
    if (!Plant.validStatuses.includes(this.status)) {
      throw new Error(`Invalid status: ${this.status}`)
    }

    if (!Plant.validSources.includes(this.source)) {
      throw new Error(`Invalid source: ${this.source}`)
    }

    if (!Plant.validStages.includes(this.stage)) {
      throw new Error(`Invalid stage: ${this.stage}`)
    }

    return true
  }

  /**
   * Sets the name of the plant and generates a new plant abbr if applicable.
   * @param {string} name - Name of plant to be set.
   * @returns {Plant} Instance of plant.
   */
  async setName(name) {
    // Name already matches, do nothing
    if (this.name === name) return this

    // Set new name and generate new plant abbr
    this.name = name
    await this.setPlantAbbr()
    return this
  }

  /**
   * Sets the plant abbreviation.
   * @param {string} plantAbbr Abbreviation of plant.
   */
  async setPlantAbbr() {
    console.log("Generating new plant abbreviation")
    let newPlantAbbr = ""

    this.name.split(" ").forEach((/** @type {string} */ part) => {
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
    const count = await countMatchingPlants(collection, newPlantAbbr)

    // Add 1 to the count of matching plants to create suffix
    this.plantAbbr = `${newPlantAbbr}-${count + 1}`
  }

  async generatePlantAbbr() {}

  async save() {
    const newPlant = this

    // Remove database ID from new plant object (if present)
    delete newPlant._id

    try {
      // Save plant to database
      const result = await collection.updateOne(
        { _id: new ObjectId(this._id) },
        { $set: newPlant },
        { upsert: true }
      )

      // Update the database ID if necessary
      if (result.upsertedId) this._id = result.upsertedId.toString()
    } catch (err) {
      console.error("Error saving plant to database:", err)
    }
  }
}

export default Plant
