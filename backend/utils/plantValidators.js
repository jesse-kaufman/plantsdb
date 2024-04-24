exports.validatePlantId = async (plantId) => {
  const count = await plantModel.countDocuments({
    status: "active",
    plantId: plantId.trim(),
  });
  if (count === 0) {
    return true;
  }

  return false;
};

exports.validatePlantName = async (plantName) => {
  const count = await plantModel.countDocuments({
    status: "active",
    name: name.trim(),
  });
  if (count === 0) {
    return true;
  }

  return false;
};

exports.validatePlantDates = async (plantName) => {
  return false;
};
