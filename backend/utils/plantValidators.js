exports.validatePlantId = async (plantId) => {
  try {
    const count = await plantModel.countDocuments({
      status: "active",
      plantId: plantId.trim(),
    });
    if (count === 0) {
      return true;
    }
  } catch (error) {
    throw new Error(error.message);
  }

  return false;
};

exports.validatePlantName = async (plantName) => {
  try {
    const count = await plantModel.countDocuments({
      status: "active",
      name: name.trim(),
    });
    if (count === 0) {
      return true;
    }
  } catch (error) {
    throw new Error(error.message);
  }

  return false;
};

exports.validatePlantDates = async (plantName) => {
  return false;
};
