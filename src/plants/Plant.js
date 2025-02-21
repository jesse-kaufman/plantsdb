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
  /** Date flower stage was started. */
  #flowerStartedOn
  /** Date of potential harvest. */
  #potentialHarvest
  /** Date plant was harvested. */
  #harvestedOn
  /** Date plant started cure stage. */
  #cureStartedOn
  /** Date plant was archived. */
  #archivedOn
  /** Date plant was deleted. */
  #deletedOn

  /**
   * Creates an instance of a Plant.
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} newPlant.name - Name of the plant being created.
   * @param {string} newPlant.status - Status of the plant being created.
   * @param {string} newPlant.stage - Stage of the plant being created.
   * @param {string} newPlant.startedOn - Date plant started.
   * @param {string} newPlant.vegStartedOn - Date veg stage started.
   * @param {string} newPlant.flowerStartedOn - Date flower stage started.
   * @param {string} newPlant.potentialHarvest - Date of potential harvest (or null if harvested).
   * @param {string} newPlant.harvestedOn - Date on which plant was harvested.
   * @param {string} newPlant.cureStartedOn - Date on which plant started cure stage.
   * @param {string} newPlant.archivedOn - Date plant was archived (or null if not archived).
   * @param {string} newPlant.deletedOn - Date plant was deleted (or null if not deleted).
   */
  constructor(newPlant) {
    // Validate incoming data
    validateConstructorData(newPlant)

    // Now initialize the plant properties
    this.#name = newPlant.name.trim()
    this.#status = newPlant.status
    this.#stage = newPlant.stage
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
   */
  delete() {
    this.#status = "inactive"
    this.#deletedOn = new Date()
  }

  /**
   * Sets the status of plant to active.
   */
  undelete() {
    if (this.#status === "inactive") {
      this.#status = "active"
      this.#deletedOn = null
    }
  }

  /**
   * Sets the status of plant to inactive.
   */
  archive() {
    if (this.#status !== "inactive") {
      this.#status = "archived"
      this.#archivedOn = new Date(new Date().toISOString().split("T")[0])
    }
  }

  /**
   * Sets the status of plant to inactive.
   */
  unarchive() {
    if (this.#status === "archived") {
      this.#status = "active"
      this.#archivedOn = null
    }
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
   * Gets the flower start date of the plant.
   * @returns {Date} Flower stage start date.
   */
  get flowerStartedOn() {
    return this.#flowerStartedOn
  }

  /**
   * Sets the flower start date of the plant.
   * @param {string} newFlowerStartedOn - New flower started on date.
   * @throws {Error} If the new date is invalid.
   */
  set flowerStartedOn(newFlowerStartedOn) {
    validateDate("flowerStartedOn", newFlowerStartedOn)
    this.#flowerStartedOn = new Date(newFlowerStartedOn)
  }

  /**
   * Gets the harvest date of the plant.
   * @returns {Date} Harvest date of plant.
   */
  get harvestedOn() {
    return this.#harvestedOn
  }

  /**
   * Sets the flower start date of the plant.
   * @param {string} newHarvestedOn - New harvest date.
   * @throws {Error} If the new date is invalid.
   */
  set harvestedOn(newHarvestedOn) {
    validateDate("harvestedOn", newHarvestedOn)
    this.#harvestedOn = new Date(newHarvestedOn)
  }

  /**
   * Gets the potential harvest date of the plant.
   * @returns {?Date} Potential harvest date of the plant.
   */
  get potentialHarvest() {
    return this.#potentialHarvest
  }

  /**
   * Gets the flower start date of the plant.
   * @returns {Date} New flower stage start date.
   */
  get cureStartedOn() {
    return this.#cureStartedOn
  }

  /**
   * Sets the flower start date of the plant.
   * @param {string} newCureStartedOn - New harvest date.
   * @throws {Error} If the new date is invalid.
   */
  set cureStartedOn(newCureStartedOn) {
    validateDate("cureStartedOn", newCureStartedOn)
    this.#cureStartedOn = new Date(newCureStartedOn)
  }

  /**
   * Gets the deleted date of the plant.
   * @returns {?Date} Date  plant was deleted.
   */
  get deletedOn() {
    return this.#deletedOn
  }

  /**
   * Gets the archived date of the plant.
   * @returns {?Date} Archived date of the plant.
   */
  get archivedOn() {
    return this.#archivedOn
  }

  #initDates(newPlant) {
    // Convert startedOn to date
    this.#startedOn = new Date(newPlant.startedOn)

    // Convert vegStartedOn to date if set
    this.#vegStartedOn = newPlant.vegStartedOn
      ? new Date(newPlant.vegStartedOn)
      : null

    // Convert flowerStartedOn to date if set
    this.#flowerStartedOn = newPlant.flowerStartedOn
      ? new Date(newPlant.flowerStartedOn)
      : null

    // Convert harvestedOn to date if set
    this.#harvestedOn = newPlant.harvestedOn
      ? new Date(newPlant.harvestedOn)
      : null

    // Convert harvestedOn to date if set
    this.#cureStartedOn = newPlant.cureStartedOn
      ? new Date(newPlant.cureStartedOn)
      : null

    // Default archivedOn to null if missing in newPlant
    this.#archivedOn = newPlant.archivedOn
      ? new Date(newPlant.archivedOn)
      : null

    // Convert deletedOn to date if set
    this.#deletedOn = newPlant.deletedOn ? new Date(newPlant.deletedOn) : null

    const config = { seedlingWeeks, vegWeeks, flowerWeeks }
    const { startedOn, vegStartedOn, flowerStartedOn, harvestedOn } = this
    const dates = {
      startedOn,
      vegStartedOn,
      flowerStartedOn,
      harvestedOn,
    }

    // Calculate potentialHarvest if missing in newPlant
    this.#potentialHarvest =
      newPlant.potentialHarvest ||
      calculatePotentialHarvest(this.#stage, dates, config)
  }

  /**
   * Validates the plant instance.
   * @throws {Error} If plant object is invalid or any properties fail validation.
   */
  validate() {
    validatePlant(this)
  }
}
