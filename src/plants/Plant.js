/**
 * @file Plant class.
 */
import {
  validateName,
  validatePlant,
  validateStage,
  validateStartedOn,
} from "./services/validation"

/**
 * Represents a plant with its properties and validation logic.
 *
 * The `Plant` class manages the plant's name and ensures it is valid.
 * Additional validation methods can be added to the class as needed.
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
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} newPlant.name - Name of the plant being created.
   * @param {string} [newPlant.status] - Optional status (defaults to active).
   * @param {string} [newPlant.stage] - Optional stage of the plant (defaults to seedling).
   * @param {string} [newPlant.startedOn] - Optional start date (defaults to today).
   * @throws {Error} If the provided plant object fails validation.
   */
  constructor(newPlant) {
    validatePlant(newPlant)
    this.#name = newPlant.name.trim()
    this.#stage = newPlant.stage || "seedling"
    this.#status = newPlant.status || "active"
    this.#startedOn = newPlant.startedOn
      ? new Date(newPlant.startedOn)
      : new Date(new Date().toISOString().split("T")[0])
  }

  /**
   * Gets the name of the plant.
   * @returns {string} Name of the plant from db.
   */
  get name() {
    return this.#name.trim()
  }

  /**
   * Sets the name of the plant.
   * @param {string} newName - New plant name to save.
   * @throws {Error} If the new name is invalid.
   */
  set name(newName) {
    validateName(newName)
    this.#name = newName
  }

  /**
   * Gets the status of the plant.
   * @returns {string} Status property of the plant.
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
   * TODO: Unset deletedOn.
   */
  undelete() {
    if (this.#status === "inactive") this.#status = "active"
  }

  /**
   * Sets the status of plant to inactive.
   * TODO: Set archivedOn to today's date.
   */
  archive() {
    if (this.#status !== "inactive") this.#status = "archived"
  }

  /**
   * Sets the status of plant to inactive.
   * TODO: Unset archivedOn.
   */
  unarchive() {
    if (this.#status === "archived") this.#status = "active"
  }

  /**
   * Gets the stage of the plant.
   * @returns {string} Stage of the plant from db.
   */
  get stage() {
    return this.#stage
  }

  /**
   * Sets the stage of the plant.
   * @param {string} newStage - New stage for plant.
   * @throws {Error} If the new name is invalid.
   */
  set stage(newStage) {
    validateStage(newStage)
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
   * @param {string} newStartedOn - New started on date.
   * @throws {Error} If the new date is invalid.
   */
  set startedOn(newStartedOn) {
    validateStartedOn(newStartedOn)
    this.#startedOn = new Date(newStartedOn)
  }
}
