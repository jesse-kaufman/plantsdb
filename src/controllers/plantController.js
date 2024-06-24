import PlantModel from "../models/plantModel.js";
import { addLogEntry } from "../utils/log.js";
import { httpCodes } from "../config/config.js";
import plantValidators from "../utils/plantValidators.js";

/**
 * Gets an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const getPlant = async (req, res) => {
  let plant = null;

  try {
    // Get the plant
    plant = await PlantModel.getById(req.params.plantId, req.query.status);
  } catch (err) {
    console.error(err);
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
  }

  if (!plant) {
    res.status(httpCodes.NOT_FOUND).json({ error: "Plant not found" });
    return;
  }

  res.status(httpCodes.OK).json(plant);
};

/**
 * Gets a list of plants from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const getPlants = async (req, res) => {
  const { status, stage } = req.query;

  try {
    const plants = await PlantModel.getAll({ status, stage });
    res.status(httpCodes.OK).json(plants);
  } catch (err) {
    console.error(err);
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
  }
};

/**
 * Adds a new plant to the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const addPlant = async (req, res) => {
  let newPlant = null;

  //
  // Check if a plant with the same name already exists
  //
  const plantExists = await plantValidators.isValidName(req.body.name);
  if (plantExists === false) {
    res
      .status(httpCodes.CONFLICT)
      .json({ error: "A plant with that name already exists" });
    return;
  }

  // Create new plant object from data sent
  newPlant = new PlantModel(req.body);

  // If plant name abbreviation is not provided, generate one
  if (!req.body.plantAbbr) {
    newPlant.plantAbbr = newPlant.generatePlantAbbr();
  }

  // Save plant to the database
  try {
    await newPlant.save();
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
    return;
  }

  // Make log entry
  addLogEntry(newPlant._id, "Created new plant");

  res.status(httpCodes.CREATED).json(newPlant);
};

/**
 * Updates an existing plant in the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const updatePlant = async (req, res) => {
  // Find the plant
  const plant = await PlantModel.getById(req.params.plantId, req.query.status);

  if (!plant) {
    res.status(httpCodes.NOT_FOUND).json({ error: "Plant not found" });
    return;
  }

  try {
    // Update plant object
    const wasModified = plant.doUpdate(req.params.plantId, req.body);
    if (wasModified) {
      console.log("No changes made to plant");
    }
  } catch (e) {
    console.error(e);
    res.status(httpCodes.SERVER_ERROR).json({ error: e.message });
    return;
  }

  res.status(httpCodes.OK).json(plant);
};

/**
 * Deletes an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
export const deletePlant = async (req, res) => {
  const plant = await PlantModel.deleteOne(req.params.id);
  res.status(httpCodes.OK).json(plant);
};
