import PlantModel from "../models/plantModel.js";
import { addLogEntry } from "../utils/log.js";
import { generatePlantAbbr } from "../utils/plantAbbrService.js";
import { getNewStageDates } from "../utils/plantStages.js";
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
    newPlant.plantAbbr = generatePlantAbbr(newPlant.name);
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
  let newPlant = req.body;
  let stageDates;

  // Find the plant
  const plant = await PlantModel.getById(req.params.plantId, req.query.status);

  if (!plant) {
    res.status(httpCodes.NOT_FOUND).json({ error: "Plant not found" });
    return;
  }

  // Save a copy of the old plant for later
  plant.$locals.oldPlant = plant.toJSON();

  // Make sure new plant doesn't have a different ID
  newPlant._id = req.params.plantId;

  // Fill in missing properties in newPlant with ones from the database
  newPlant = { ...plant.toJSON(), ...newPlant };

  if (newPlant.status === "archived") {
    newPlant.archivedOn = new Date().toISOString();
  }

  // Get the data to update plant stage and set dates accordingly
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    // plant.stage = newPlant.stage;

    const dates = {
      vegStartedOn: newPlant.vegStartedOn,
      flowerStartedOn: newPlant.flowerStartedOn,
      cureStartedOn: newPlant.cureStartedOn,
      harvestedOn: newPlant.harvestedOn,
    };

    try {
      // Get dates based on new stage and request body
      stageDates = getNewStageDates(newPlant.stage, dates);
    } catch (err) {
      res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
      return;
    }

    // Add data to newPlant object
    newPlant = {
      ...newPlant,
      ...stageDates,
    };
  }

  // Update plant object
  for (const prop in newPlant) {
    if (Object.hasOwn(newPlant, prop)) {
      if (newPlant[prop] == null) {
        delete plant[prop];
      }
      plant[prop] = newPlant[prop];
    }
  }

  // Check if plant name has changed
  if (newPlant.name !== plant.name) {
    plant.name = newPlant.name;

    try {
      // Generate new plantId from new name
      newPlant.plantAbbr = await generatePlantAbbr(plant.name);
    } catch (err) {
      res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
      return;
    }
  }

  // Plant abbr changed?
  if (newPlant.plantAbbr && newPlant.plantAbbr !== plant.plantAbbr) {
    plant.plantAbbr = newPlant.plantAbbr;
  }

  // Get changes to plant as MongoDB query object
  plant.$locals.changes = plant.getChanges();

  // If we have no changes to make, return immediately
  if (plant.$locals.changes.$set == null) {
    console.log("No changes made to plant");
    res.status(httpCodes.OK).json(plant);
    return;
  }

  // Save the plant
  try {
    await plant.save();
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
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
