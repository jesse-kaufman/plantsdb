import { validateDate } from "../utils/dateUtils"

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
  static validStatuses = ["active", "inactive", "archived"]

  /** Name of plant. */
  #name
  /** Status of plant. */
  #status
  /** Plant stage. */
  #stage
  /** Date plant was started. */
  #startedOn

  /**
   * Creates an instance of a Plant.
   *
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} newPlant.name - Name of the plant.
   * @param {string} [newPlant.status=""] - Optional status (defaults to active).
   * @param {string} [newPlant.stage="seedling"] - Optional stage of the plant (defaults to seedling).
   * @param {string} [newPlant.startedOn] - Optional start date (defaults to today).
   * @throws {Error} If the provided plant object fails validation.
   */
  constructor(newPlant) {
    this.#validatePlant(newPlant)
    this.#name = newPlant.name
    this.#stage = newPlant.stage || "seedling"
    this.#status = newPlant.status || "active"
    this.#startedOn = newPlant.startedOn
      ? new Date(newPlant.startedOn)
      : new Date(new Date().toISOString().split("T")[0])
  }

  /**
   * Gets the name of the plant.
   * @returns {string} Name of the plant.
   */
  get name() {
    return this.#name
  }

  /**
   * Sets the name of the plant.
   * @param {string} newName - The new name of the plant.
   * @throws {Error} If the new name is invalid.
   */
  set name(newName) {
    this.#validateName(newName)
    this.#name = newName
  }

  /**
   * Gets the status of the plant.
   * @returns {string} Status of the plant.
   */
  get status() {
    return this.#status
  }

  /**
   * Sets the status of plant to inactive.
   * TODO: Set deletedOn to today's date.
   */
  delete() {
    this.#status = "inactive"
  }

  /**
   * Sets the status of plant to active.
   * TODO: Unset deletedOn
   */
  undelete() {
    this.#status = "active"
  }

  /**
   * Sets the status of plant to inactive.
   * TODO: Set archivedOn to today's date.
   */
  archive() {
    this.#status = "archived"
  }

  /**
   * Sets the status of plant to inactive.
   * TODO: Unset archivedOn.
   */
  unarchive() {
    this.#status = "active"
  }

  /**
   * Gets the stage of the plant.
   * @returns {string} Stage of the plant.
   */
  get stage() {
    return this.#stage
  }

  /**
   * Sets the stage of the plant.
   * @param {string} newStage - The new stage of the plant.
   * @throws {Error} If the new name is invalid.
   */
  set stage(newStage) {
    this.#validateStage(newStage)
    this.#stage = newStage
  }

  /**
   * Gets the start date of the plant.
   * @returns {Date} Start date of the plant.
   */
  get startedOn() {
    return this.#startedOn
  }

  /**
   * Sets the start date of the plant.
   * @param {string} newStarteOn - The new started on date.
   * @throws {Error} If the new date is invalid.
   */
  set startedOn(newStarteOn) {
    this.#validateStartedOn(newStarteOn)
    this.#startedOn = new Date(newStarteOn)
  }

  /**
   * Validates the given plant object.
   * @param {object} plant - Plant data to initialize the instance.
   * @param {string} plant.name - Name of the plant.
   * @param {string} [plant.status] - Status of the plant (optional only when creating instance)
   * @param {string} [plant.stage] - Stage of the plant (optional only when creating instance)
   * @param {string} [plant.startedOn] - Start date of plant.
   * @throws {Error} If plant object is invalid or any properties fail validation.
   */
  #validatePlant(plant) {
    if (typeof plant !== "object" || plant === null) {
      throw new Error("Invalid plant object")
    }

    this.#validateName(plant.name)
    this.#validateStatus(plant.status, false)
    this.#validateStage(plant.stage, false)
    this.#validateStartedOn(plant.startedOn, false)
  }

  /**
   * Validates the provided name.
   * @param {string|undefined} name - Name to validate.
   * @throws {Error} If the name is not a string, is empty, or contains only whitespace.
   */
  #validateName(name) {
    if (name === undefined) throw new Error("Name is required")
    if (typeof name !== "string") throw new Error("Invalid name")
    if (name.trim() === "") throw new Error("Name is required")
  }

  /**
   * Validates the provided status.
   * @param {string|undefined} status - Stage to validate.
   * @param {boolean} required - Whether to allow undefined for the stage.
   * @throws {Error} If the stage is not a valid stage.
   */
  #validateStatus(status) {
    // Stage is set and not a valid stage
    if (status !== undefined && !Plant.validStatuses.includes(status))
      throw new Error("Invalid status")
  }

  /**
   * Validates the provided stage.
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
    if (stage !== undefined && !Plant.validStages.includes(stage))
      throw new Error("Invalid stage")
  }

  /**
   * Validates the provided startedOn date.
   * @param {string} [startedOn]
   * @returns
   */
  #validateStartedOn(startedOn, required = true) {
    // Allow undefined startedOn if required is false
    if (!required && startedOn === undefined) return

    if (typeof startedOn !== "string")
      throw new Error("Invalid started on date")

    if (!validateDate(startedOn)) throw new Error("Invalid started on date")

    const startedOnDate = new Date(startedOn)
    const today = new Date(new Date().toISOString().split("T")[0])

    if (startedOnDate > today)
      throw new Error("Started on date cannot be in the future")
  }
}
