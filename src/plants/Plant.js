/**
 * Represents a plant with its properties and validation logic.
 *
 * The `Plant` class manages the plant's name and ensures it is valid.
 * Additional validation methods can be added to the class as needed.
 *
 * @class
 */
export default class Plant {
  /** Name of plant. */
  #name

  /**
   * Creates an instance of a Plant.
   *
   * @param {object} newPlant - Plant data to initialize the instance.
   * @param {string} [newPlant.name=""] - Optional name of the plant (defaults to empty string).
   * @throws {Error} If the provided plant object fails validation.
   */
  constructor(newPlant) {
    this.#validatePlant(newPlant)
    this.#name = newPlant.name || "plant"
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
   * Validates the given plant object.
   *
   * @param {object} plant - Plant data to initialize the instance.
   * @param {string} [plant.name=""] - Name of the plant (optional).
   * @throws {Error} If plant object is invalid or any properties fail validation.
   */
  #validatePlant(plant) {
    if (typeof plant !== "object" || plant === null) {
      throw new Error("Invalid plant object")
    }

    this.#validateName(plant.name)
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
}
