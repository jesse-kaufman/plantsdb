const plantModel = require("../models/plantModel");
const { getNewStageDates } = require("../utils/plantStages");
const { getValidPlantStatuses } = require("../utils/plantEnums");
const { addLogEntry } = require("../utils/log");
const { getPlantById } = require("../utils/plants");

/**
 * Gets an existing plant from the database
 *
 * @param {*} req The request object
 * @param {*} res The response object
 */
exports.getPlant = async (req, res) => {
  let status = "active";
  const statuses = getValidPlantStatuses();

  if (req.query.status && req.query.status in statuses) {
    status = req.query.status;
  }

  try {
    //
    // Find the plant
    //
    const plant = await getPlantById(req.params.plantId, status);

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
  let = req.query.statuses ? req.query.statuses : ["active"];

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
  let plant = null;
  let changeList = [];
  let newPlant = req.body;

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

  // Get the data to update plant stage and set dates accordingly
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    plant.stage = newPlant.stage;
    changeList.push("Stage changed to " + newPlant.stage);

    try {
      let dates = {
        vegStartedOn: newPlant.vegStartedOn,
        flowerStartedOn: newPlant.flowerStartedOn,
        cureStartedOn: newPlant.cureStartedOn,
        harvestedOn: newPlant.harvestedOn,
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
      await plant.generatePlantAbbr();
    } catch (err) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  // Plant stage changed?
  if (newPlant.stage && newPlant.stage !== plant.stage) {
    plant.stage = newPlant.stage;
    changeList.push("Stage changed to " + newPlant.stage);
  }

  // Veg start date changed?
  if (newPlant.vegStartedOn !== plant.vegStartedOn) {
    if (newPlant.vegStartedOn !== null || plant.vegStartedOn) {
      plant.vegStartedOn = undefined;

      if (newPlant.vegStartedOn) {
        plant.vegStartedOn = newPlant.vegStartedOn;
      }
      changeList.push("Veg start date");
    }
  }

  // Flower start date changed?
  if (newPlant.flowerStartedOn !== plant.flowerStartedOn) {
    if (newPlant.flowerStartedOn !== null || plant.flowerStartedOn) {
      plant.flowerStartedOn = undefined;

      if (newPlant.flowerStartedOn) {
        plant.flowerStartedOn = newPlant.flowerStartedOn;
      }
      changeList.push("Flower start date");
    }
  }

  // Cure start date changed?
  if (newPlant.cureStartedOn !== plant.cureStartedOn) {
    if (newPlant.cureStartedOn !== null || plant.cureStartedOn) {
      plant.cureStartedOn = undefined;

      if (newPlant.cureStartedOn) {
        plant.cureStartedOn = newPlant.cureStartedOn;
      }
      changeList.push("Cure start date");
    }
  }

  // Harvested on date changed?
  if (newPlant.harvestedOn !== plant.harvestedOn) {
    if (newPlant.harvestedOn !== null || plant.harvestedOn) {
      plant.harvestedOn = undefined;

      if (newPlant.harvestedOn) {
        plant.harvestedOn = newPlant.harvestedOn;
      }
      changeList.push("Harvested on date");
    }
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
    res.status(200).json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
    return;
  }

  // Make entry in log
  try {
    addLogEntry(
      req.params.plantId,
      "Updated plant:\n• " + changeList.join("\n• ")
    );
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
