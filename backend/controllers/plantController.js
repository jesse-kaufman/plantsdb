const plantModel = require("../models/plantModel");
const logModel = require("../models/logModel");
const { getStageData } = require("../utils/plantStages");
const { generatePlantAbbr } = require("../utils/plants");
const { addLogEntry } = require("../utils/log");

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
  // If plant name abbreviation is not provided, generate one
  //
  if (!newPlant.plantAbbr) {
    try {
      newPlant.plantAbbr = await generatePlantAbbr(newPlant.name, plantModel);
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
      addLogEntry(plant._id, "Created new plant");
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  const data = req.body;
  let plant = null;
  let newPlant = req.body;
  let updatedPropsMsgs = [];

  //
  // Find the plant
  //
  try {
    plant = await plantModel.findOne({
      _id: req.params.plantId,
      status: "active",
    });

    if (!plant) {
      res.status(404).json({ error: "Plant not found" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  if (newPlant.name !== plant.name) {
    try {
      let plantAbbr = await generatePlantAbbr(newPlant.name);
      newPlant.plantAbbr = plantAbbr;
      console.log(plantAbbr);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  //
  // Gets the data to update plant stage and set dates accordingly
  //
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    try {
      let stageData = await getStageData(newPlant.stage, {
        vegStartedOn: newPlant.vegStartedOn,
        flowerStartedOn: newPlant.flowerStartedOn,
        cureStartedOn: newPlant.cureStartedOn,
        harvestedOn: newPlant.harvestedOn,
      });

      // Add data to newPlant object
      newPlant = { ...stageData };
      // Update messages for log
      updatedPropsMsgs.push("Stage changed to " + newPlant.stage);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  // If we have no changes to make, return immediately
  if (changeList.length === 0) {
    res.status(200).json(newPlant);
    return;
  }

  //
  // Update the plant
  //
  try {
    const plant = await plantModel.updateOne(
      { _id: req.params.plantId },
      newPlant
    );

    // Make entry in log
    try {
      addLogEntry(
        req.params.plantId,
        "Updated plant:\n• " + updatedPropsMsgs.join("\n• ")
      );
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }

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
