const plantModel = require("../models/plantModel");
const { getNewStageDates } = require("../utils/plantStages");
const { getValidPlantStatuses } = require("../utils/plantEnums");
const { addLogEntry } = require("../utils/log");
const { getPlantById, generatePlantAbbr } = require("../utils/plants");

/**
 * Gets an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getPlant = async (req, res) => {
  let statuses = ["active"];
  let plant = null;

  if (req.query.status && req.query.status in getValidPlantStatuses()) {
    statuses = req.query.status;
  }

  //
  // Find the plant
  //
  try {
    plant = await getPlantById(req.params.plantId, statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  if (!plant) {
    res.status(404).json({ error: "Plant not found" });
    return;
  }

  res.status(200).json(plant);
};

/**
 * Gets a list of plants from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getPlants = async (req, res) => {
  // Default to only showing active plants
  let statuses = ["active"];
  let plants = [];

  if (req.query.statuses) {
    for (const status in req.query.statuses) {
      if (status in getValidPlantStatuses()) {
        statuses.push(status);
      }
    }
    statuses = req.query.statuses;
  }

  //
  // Get all matching plants
  //
  try {
    plants = await plantModel.find({ status: { $in: statuses } });
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(200).json(plants);
};

/**
 * Adds a new plant to the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.addPlant = async (req, res) => {
  let newPlant = null;

  //
  // Check if a plant with the same name already exists
  //
  try {
    const plant = await plantModel.findOne({
      status: "active",
      name: req.body.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  if (plant) {
    res.status(409).json({ error: "A plant with that name already exists" });
    return;
  }

  // Create new plant object from data sent
  try {
    newPlant = new plantModel(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  // If plant name abbreviation is not provided, generate one
  if (!req.body.plantAbbr) {
    plant.plantAbbr = await generatePlantAbbr(newPlant.name);
  }

  // Save plant to the database
  try {
    await plant.save();
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  // Make log entry
  addLogEntry(plant._id, "Created new plant");

  res.status(201).json(plant);
};

/**
 * Updates an existing plant in the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.updatePlant = async (req, res) => {
  let plant = null;
  let changeList = [];
  let newPlant = req.body;

  //
  // Find the plant
  //
  try {
    plant = await getPlantById(req.params.plantId);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  if (!plant) {
    res.status(404).json({ error: "Plant not found" });
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
    changeList.push("Stage changed to " + newPlant.stage);

    try {
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

      // Get dates based on new stage and request body
      const stageDates = getNewStageDates(newPlant.stage, dates);

      // Add data to newPlant object
      newPlant = {
        ...newPlant,
        ...stageDates,
      };
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  // Check if plant name has changed
  if (newPlant.name !== plant.name) {
    plant.name = newPlant.name;
    changeList.push("Plant name");

    try {
      // Generate new plantId from new name
      newPlant.plantAbbr = await generatePlantAbbr(plant.name);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  if (newPlant.plantAbbr && newPlant.plantAbbr !== plant.plantAbbr) {
    plant.plantAbbr = newPlant.plantAbbr;
    changeList.push("Plant abbreviation changed to " + newPlant.plantAbbr);
  }

  // Plant stage changed?
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    plant.stage = newPlant.stage;
    changeList.push("Stage changed to " + newPlant.stage);
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
    console.log(new Date(newPlant.flowerStartedOn).toJSON());
    console.log(plant.flowerStartedOn?.toJSON());
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

  console.log(changeList);

  // If we have no changes to make, return immediately
  if (changeList.length === 0) {
    res.status(200).json(plant);
    return;
  }

  //
  // Save the plant
  //
  try {
    await plant.save();
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(200).json(plant);

  addLogEntry(
    req.params.plantId,
    "Updated plant:\n• " + changeList.join("\n• ")
  );
};

/**
 * Deletes an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.deletePlant = async (req, res) => {
  try {
    // Find and delete the plant
    const plant = await plantModel.updateOne(
      { _id: req.params.plantId },
      { status: "inactive" }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(200).json(plant);

  addLogEntry(req.params.plantId, "Plant deleted");
};
