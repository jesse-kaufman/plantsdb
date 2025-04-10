/** @file Plant repository. */
import PlantModel from "../models/plantModel.js"
import Plant from "@/plants/PlantClass.js"

/**
 * The plant repository object.
 */
export const plantRepository = {
  /**
   * Gets plant by ID.
   * @param {string} id - ID to retrieve.
   * @returns {Promise<object>} Plant from database.
   */
  async findById(id) {
    const data = await PlantModel.findById(id).lean()
    if (data) return new Plant(data)
  },

  /**
   * Gets list of plants filtered by filter.
   * @param {object} filter - Object to filter results.
   * @returns {Promise<object[]>} List of matching plants.
   */
  async findBy(filter) {
    return await PlantModel.find(filter).lean()
  },

  /**
   * Creates a plant in the database.
   * @param {object} data - Data for new plant.
   * @returns {Promise<object>} Plant object after insertion.
   */
  async create(data) {
    try {
      const newPlant = await PlantModel.create(data) // Create the new plant in the database
      return new Plant(newPlant) // Directly return the plain object as Plant
    } catch (error) {
      throw new Error(`Database error while creating plant: ${error.message}`)
    }
  },

  /**
   * Updates an existing plant in the database.
   * @param {string} id - ID of plant to update.
   * @param {object} updates - Object containing changes to make to plant.
   * @returns {Promise<object>} Plant object after update.
   */
  async update(id, updates) {
    return await PlantModel.findByIdAndUpdate(id, updates, {
      new: true,
      lean: true,
    })
  },
}
