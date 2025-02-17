/**
 * @file Plant class.
 */
import {
  validateConstructorData,
  validateName,
  validatePlant,
} from "./services/validation/plantValidation"
import { validateStage } from "./services/validation/stageValidation"
import { validateDate } from "./services/validation/dateValidation"
import { calculatePotentialHarvest } from "./services/dateService"
import { seedlingWeeks, vegWeeks, flowerWeeks } from "./config/constants"

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
  /** Date veg stage was started. */
  #vegStartedOn
  /** Date of potential harvest. */
  #potentialHarvest
  /** Date plant was archived. */
  #archivedOn

  /**
   * Creates an instance of a Plant.
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} newPlant.name - Name of the plant being created.
   * @param {string} [newPlant.status] - Optional status (defaults to active).
   * @param {string} [newPlant.stage] - Optional stage of the plant (defaults to seedling).
   * @param {string} [newPlant.startedOn] - Optional start date (defaults to today).
   * @param {string} [newPlant.archivedOn] - Optional archived on date (defaults to null).
   * @throws {Error} If the provided plant object fails validation.
   */
  constructor(newPlant) {
    // Validate incoming data
    validateConstructorData(newPlant)

    // Now initialize the plant properties
    this.#name = newPlant.name.trim()
    this.#status = newPlant.status || "active"
    this.#stage = newPlant.stage || "seedling"
    this.#initDates(newPlant)

    this.validate()
  }

  /**
   * Gets the name of the plant.
   * @returns {string} Name of the plant from db.
   */
  get name() {
    return this.#name
  }

  /**
   * Sets the name of the plant.
   * @param {string} newName - New plant name to save.
   * @throws {Error} If the new name is invalid.
   */
  set name(newName) {
    validateName(newName)
    this.#name = newName.trim()
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
    validateDate("startedOn", newStartedOn)
    this.#startedOn = new Date(newStartedOn)
  }

  /**
   * Gets the veg start date of the plant.
   * @returns {Date} Veg stage start date.
   */
  get vegStartedOn() {
    return this.#vegStartedOn
  }

  /**
   * Sets the veg start date of the plant.
   * @param {string} newVegStartedOn - New veg started on date.
   * @throws {Error} If the new date is invalid.
   */
  set vegStartedOn(newVegStartedOn) {
    validateDate("vegStartedOn", newVegStartedOn)
    this.#vegStartedOn = new Date(newVegStartedOn)
  }

  /**
   * Gets the potential harvest date of the plant.
   * @returns {?Date} Potential harvest date of the plant.
   */
  get potentialHarvest() {
    return this.#potentialHarvest
  }

  /**
   * Gets the archived date of the plant.
   * @returns {?Date} Archived date of the plant.
   */
  get archivedOn() {
    return this.#archivedOn
  }

  /**
   * Sets the archived on date of the plant.
   * @param {string} newArchivedOn - New archived on date.
   * @throws {Error} If the new date is invalid.
   */
  set archivedOn(newArchivedOn) {
    validateDate("archivedOn", newArchivedOn)
    this.#archivedOn = new Date(newArchivedOn)
  }

  #initDates(newPlant) {
    // Default startedOn to today if missing in newPlant
    this.#startedOn = newPlant.startedOn
      ? new Date(newPlant.startedOn)
      : new Date(new Date().toISOString().split("T")[0])

    // Convert vegStartedOn to date if set
    this.#vegStartedOn = newPlant.vegStartedOn
      ? new Date(newPlant.vegStartedOn)
      : null

    // Default archivedOn to null if missing in newPlant
    this.#archivedOn = newPlant.archivedOn
      ? new Date(newPlant.archivedOn)
      : null

    const config = { seedlingWeeks, vegWeeks, flowerWeeks }
    const { startedOn, vegStartedOn } = this
    const dates = { startedOn, vegStartedOn }

    // Calculate potentialHarvest if missing in newPlant
    this.#potentialHarvest =
      newPlant.potentialHarvest ||
      calculatePotentialHarvest(this.#stage, dates, config)

    // Default to today if status is archived and archivedOn is null
    if (newPlant.status === "archived" && this.#archivedOn === null) {
      this.#archivedOn = new Date(new Date().toISOString().split("T")[0])
    }
  }

  /**
   * Validates the plant instance.
   * @throws {Error} If plant object is invalid or any properties fail validation.
   */
  validate() {
    validatePlant(this)
  }
}
