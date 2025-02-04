/**
 * Represents a plant with its properties and validation logic.
 *
 * The `Plant` class manages the plant's name and ensures it is valid.
 * Additional validation methods can be added to the class as needed.
 *
 * @class
 */
export default class Plant {
  static validStages = ["seedling", "veg", "flower", "harvested", "cure"]

  /** Name of plant. */
  #name
  /** Plant stage */
  #stage

  /**
   * Creates an instance of a Plant.
   *
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} newPlant.name - Name of the plant.
   * @param {string} [newPlant.stage=""] - Optional stage of the plant (defaults to seedling).
   * @throws {Error} If the provided plant object fails validation.
   */
  constructor(newPlant) {
    this.#validatePlant(newPlant, true)
    this.#name = newPlant.name
    this.#stage = newPlant.stage || "seedling"
  }

  /**
   * Gets the name of the plant.
   *
   * @returns {string} Name of the plant.
   */
  get name() {
    return this.#name
  }

  /**
   * Sets the name of the plant.
   *
   * @param {string} newName - The new name of the plant.
   * @throws {Error} If the new name is invalid.
   */
  set name(newName) {
    this.#validateName(newName)
    this.#name = newName
  }

  /**
   * Gets the stage of the plant.
   *
   * @returns {string} Stage of the plant.
   */
  get stage() {
    return this.#stage
  }

  /**
   * Sets the stage of the plant.
   *
   * @param {string} newStage - The new stage of the plant.
   * @throws {Error} If the new name is invalid.
   */
  set stage(newStage) {
    this.#validateStage(newStage)
    this.#stage = newStage
  }

  /**
   * Validates the given plant object.
   *
   * @param {object} plant - Plant data to initialize the instance.
   * @param {string} plant.name - Name of the plant.
   * @param {string} [plant.stage] - Name of the stage of the plant (optional only when creating instance)
   * @param {boolean} isNew - Whether the plant is a new object or not.
   * @throws {Error} If plant object is invalid or any properties fail validation.
   */
  #validatePlant(plant, isNew = false) {
    if (typeof plant !== "object" || plant === null) {
      throw new Error("Invalid plant object")
    }

    this.#validateName(plant.name)
    this.#validateStage(plant.stage, !isNew)
  }

  /**
   * Validates the provided name.
   *
   * @param {string|undefined} name - Name to validate.
   * @throws {Error} If the name is not a string, is empty, or contains only whitespace.
   */
  #validateName(name) {
    if (name === undefined) throw new Error("Name is required")
    if (typeof name !== "string") throw new Error("Invalid name")
    if (name.trim() === "") throw new Error("Name is required")
  }

  /**
   * Validates the provided stage.
   *
   * @param {string|undefined} stage - Stage to validate.
   * @param {boolean} required - Whether to allow undefined for the stage.
   * @throws {Error} If the stage is not a valid stage.
   */
  #validateStage(stage, required = true) {
    // Stage is not required and is undefined
    if (!required && stage === undefined) return

    // Stage is required but undefined
    if (required && stage === undefined) throw new Error("Stage is required")

    // Stage is set and not a valid stage
    if (!Plant.validStages.includes(stage?.toString() || ""))
      throw new Error("Invalid stage")
  }
}
