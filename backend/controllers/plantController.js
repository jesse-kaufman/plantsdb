const plantModel = require("../models/plantModel");
const logModel = require("../models/logModel");
const { getChangeStageData } = require("../utils/plant-stages");
const { generatePlantId } = require("../utils/plants");

/**
 * Gets an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getPlant = async (req, res) => {
  try {
    //
    // Find the plant
    //
    const plant = await plantModel.findById({
      _id: req.params.id,
    });
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * Gets all the plants from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getPlants = async (req, res) => {
  // Default to only showing active plants
  let statuses = ["active"];

  //
  // Filter by statuses requested
  //
  if (req.query.statuses) {
    statuses = req.query.statuses;
  }

  //
  // Get all matching plants
  //
  try {
    const plants = await plantModel.find({ status: { $in: statuses } });
    res.status(200).json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * Adds a new plant to the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.addPlant = async (req, res) => {
  // XXX: Validate the input here
  let newPlant = req.body;

  //
  // Check if a plant with the same name already exists
  //
  try {
    const plant = await plantModel.findOne({
      status: "active",
      name: newPlant.name,
    });

    if (plant) {
      res.status(409).json({ error: "A plant with that name already exists" });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  //
  // If plant ID is not provided, generate one
  //
  if (!newPlant.plantId) {
    try {
      newPlant.plantId = await generatePlantId(newPlant.name, plantModel);
    } catch (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }

  //
  // Save the new plant
  //
  try {
    const plant = new plantModel(newPlant);
    await plant.save();
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

/**
 * Updates an existing plant in the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.updatePlant = async (req, res) => {
  // XXX: Validate the input here
  const data = req.body;
  let updateData = {};

  //
  // Find the plant
  //
  try {
    const plant = await plantModel.findOne({
      _id: req.params.id,
      status: "active",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  //
  // Gets the data to update plant stage and set dates accordingly
  //
  if (data.stage) {
    try {
      updateData = await getChangeStageData(data);
      console.log(updateData);
    } catch (error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }

  // XXX: Update other fields here

  //
  // Update the plant
  //
  try {
    const plant = await plantModel.updateOne(
      { _id: req.params.id },
      updateData
    );
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
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
      { _id: req.params.id },
      { status: "inactive" }
    );
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};
