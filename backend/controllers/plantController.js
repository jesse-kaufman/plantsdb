const plantModel = require("../models/plantModel");
const moment = require("moment");
const { generatePlantId, changeStage } = require("../utils/plants");

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
  var includeStatuses = ["active"];

  //
  // Filter by statuses requested
  //
  if (req.query.includeStatuses) {
    includeStatuses = req.query.includeStatuses;
  }

  //
  // Get all matching plants
  //
  try {
    const plants = await plantModel.find({ status: { $in: includeStatuses } });
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
  var newPlant = req.body;
  newPlant.lastUpdated = moment().utc();

  //
  // Check if a plant with the same name already exists
  //
  try {
    const plant = await plantModel.findOne({
      status: "active",
      name: newPlant.name,
    });

    if (plant) {
      res.status(400).json({ error: "A plant with that name already exists" });
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
  var data = req.body;
  var unsetData = {};

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
  // Update dates based on stage
  //
  if (data.stage) {
    var updateData = {};
    // switch (data.stage) {
      //
      // Moving to "seedling" stage
      //
      // case "seedling":
        try {
          updateData = await changeStage(data);
          console.log(updateData);
        } catch (error) {
          res.status(500).json({ error: error.message });
          return;
        }
        // break;

      //
      // Moving to "veg" stage
      //
      // case "veg":
      //   data.dateVegStarted = req.body.dateVegStarted
      //     ? moment(data.dateVegStarted).format("YYYY-MM-DD")
      //     : moment().format("YYYY-MM-DD");

      //   // Unset harvested and cure started dates
      //   unsetData = {
      //     dateFlowerStarted: "",
      //     dateHarvested: "",
      //     dateCureStarted: "",
      //   };

      //   // Set new potential harvest date
      //   data.potentialHarvest = moment(req.body.dateVegStarted)
      //     .add(9, "weeks")
      //     .format("YYYY-MM-DD");
      //   break;

      //
      // Moving to "flower" stage
      //
      // case "flower":
      //   data.dateFlowerStarted = req.body.dateFlowerStarted
      //     ? moment(data.dateFlowerStarted).format("YYYY-MM-DD")
      //     : moment().format("YYYY-MM-DD");

      //   // Unset harvested and cure started dates
      //   unsetData = { dateHarvested: "", dateCureStarted: "" };

      //   // Set new potential harvest date
      //   data.potentialHarvest = moment(req.body.dateVegStarted)
      //     .add(4, "weeks")
      //     .format("YYYY-MM-DD");
      //   break;

      //
      // Moving to "harvest" stage
      //
      // case "harvest":
      //   data.dateHarvested = req.body.dateHarvested
      //     ? moment(data.dateHarvested).format("YYYY-MM-DD")
      //     : moment().format("YYYY-MM-DD");

      //   // Unset potential harvest and cure started dates
      //   unsetData = { datePotentialHarvest: "", dateCureStarted: "" };
      //   break;

      //
      // Moving to "cure" stage
      //
      // case "cure":
      //   data.dateCureStarted = req.body.dateCureStarted
      //     ? moment(data.dateCureStarted).format("YYYY-MM-DD")
      //     : moment().format("YYYY-MM-DD");
      //   break;

      //
      // Invalid stage
      //
      // default:
      //   res.status(400).json({ error: "Invalid stage" });
    // }
  }

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
