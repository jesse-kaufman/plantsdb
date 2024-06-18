import PlantModel from "../models/plantModel.js";
const isValidId = async (plantId) => {
  const count = await PlantModel.countDocuments({
    status: "active",
    plantId: plantId.trim(),
  });
  if (count === 0) {
    return true;
  }

  return false;
};

const isValidName = async (plantName) => {
  const plant = await PlantModel.findOne({
    status: "active",
    name: plantName.trim(),
  });

  if (plant != null) {
    return true;
  }

  return false;
};

const isValidDates = () => {
  return false;
};

export default {
  isValidId,
  isValidName,
  isValidDates,
};
