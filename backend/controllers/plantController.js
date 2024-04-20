const plantModel = require("../models/plantModel");
const logModel = require("../models/logModel");
const { getStageData } = require("../utils/plantStages");
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
      _id: req.params.plantId,
    });
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  //
  // If plant ID is not provided, generate one
  //
  if (!newPlant.plantId) {
    try {
      newPlant.plantId = await generatePlantId(newPlant.name, plantModel);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  //
  // Save the new plant
  //
  try {
    const plant = new plantModel(newPlant);
    await plant.save();

    // Make entry in log
    try {
      const log = new logModel({
        plantId: plant._id,
        message: "Created plant",
      });
      await log.save();
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  console.log(newPlant);
  //const plantLog = new plantLogModelogModel({plant._id, plantModel});
  //plantLog.save();
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
  let newPlant = {};

  //
  // Find the plant
  //
  try {
    const plant = await plantModel.findOne({
      _id: req.params.plantId,
      status: "active",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  //
  // Gets the data to update plant stage and set dates accordingly
  //
  if (req.body.stage && req.body.stage !== plant.stage) {
    try {
      newPlant = await getStageData(data);
      console.log(updateData);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  // XXX: Update other fields here

  //
  // Update the plant
  //
  try {
    const plant = await plantModel.updateOne(
      { _id: req.params.plantId },
      updateData
    );
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      { _id: req.params.plantId },
      { status: "inactive" }
    );
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }
};
