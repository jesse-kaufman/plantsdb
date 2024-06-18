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
  try {
    const plants = await PlantModel.getAll({
      status: req.query.status,
      stage: req.query.stage,
    });
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
  let plant;
  const changeList = [];
  let newPlant = req.body;
  let stageDates;

  // Find the plant
  plant = await PlantModel.getById(req.params.plantId, req.query.status);

  if (!plant) {
    res.status(httpCodes.NOT_FOUND).json({ error: "Plant not found" });
    return;
  }

  // Fill in missing properties in newPlant with ones from the database
  newPlant = { ...plant.toJSON(), ...newPlant };

  // Plant status changed
  if (newPlant.status !== plant.status) {
    if (newPlant.status === "archived") {
      changeList.push("Plant archived.");
    } else if (newPlant.status === "active" && plant.status === "archived") {
      changeList.push("Plant unarchived.");
    } else if (newPlant.status === "active" && plant.status === "inactive") {
      changeList.push("Plant undeleted.");
    }
  }

  // Get the data to update plant stage and set dates accordingly
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    plant.stage = newPlant.stage;
    changeList.push(`Stage changed to ${newPlant.stage}`);

    const dates = {
      vegStartedOn: newPlant.vegStartedOn
        ? newPlant.vegStartedOn
        : plant.vegStartedOn,
      flowerStartedOn: newPlant.flowerStartedOn
        ? newPlant.flowerStartedOn
        : plant.flowerStartedOn,
      cureStartedOn: newPlant.cureStartedOn
        ? newPlant.cureStartedOn
        : plant.cureStartedOn,
      harvestedOn: newPlant.harvestedOn
        ? newPlant.harvestedOn
        : plant.harvestedOn,
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

  // Check if plant name has changed
  if (newPlant.name !== plant.name) {
    plant.name = newPlant.name;
    changeList.push("Plant name");

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
    changeList.push(`Plant abbreviation changed to ${newPlant.plantAbbr}`);
  }

  // Plant stage changed?
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    plant.stage = newPlant.stage;
    changeList.push(`Stage changed to ${newPlant.stage}`);
  }

  // Veg start date changed?
  if (
    newPlant.vegStartedOn &&
    new Date(newPlant.vegStartedOn).toJSON() !== plant.vegStartedOn?.toJSON()
  ) {
    plant.vegStartedOn = newPlant.vegStartedOn;
    changeList.push("Veg start date");
  }

  // Flower start date changed?
  if (
    newPlant.flowerStartedOn &&
    new Date(newPlant.flowerStartedOn).toJSON() !==
      plant.flowerStartedOn?.toJSON()
  ) {
    plant.flowerStartedOn = newPlant.flowerStartedOn;
    changeList.push("Flower start date");
  }

  // Cure start date changed?
  if (
    newPlant.cureStartedOn &&
    new Date(newPlant.cureStartedOn).toJSON() !== plant.cureStartedOn?.toJSON()
  ) {
    plant.cureStartedOn = newPlant.cureStartedOn;
    changeList.push("Cure start date");
  }

  // Harvested on date changed?
  if (
    newPlant.harvestedOn &&
    new Date(newPlant.harvestedOn).toJSON() !== plant.harvestedOn?.toJSON()
  ) {
    plant.harvestedOn = newPlant.harvestedOn;
    changeList.push("Harvested on date");
  }

  // If we have no changes to make, return immediately
  if (changeList.length === 0) {
    res.status(httpCodes.OK).json(plant);
    return;
  }

  //
  // Save the plant
  //
  try {
    await plant.save();
  } catch (err) {
    res.status(httpCodes.SERVER_ERROR).json({ error: err.message });
    return;
  }

  res.status(httpCodes.OK).json(plant);

  addLogEntry(
    req.params.plantId,
    `Updated plant:\n• ${changeList.join("\n• ")}`
  );
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
