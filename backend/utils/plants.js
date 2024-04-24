const plantModel = require("../models/plantModel");

exports.getPlantById = async (plantId, status = "active") => {
  let query = {
    _id: plantId,
    status: status,
  };
  return await plantModel.findOne(query);
};
