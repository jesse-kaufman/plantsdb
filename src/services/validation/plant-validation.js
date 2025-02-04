import PlantModel from "../../models/plantModel.js"

const isValidId = async (plantId) => {
  const count = await PlantModel.countDocuments({
    status: "active",
    plantId: plantId.trim(),
  })

  return count === 0
}

const nameExists = async (plantName) => {
  if (!plantName) return false

  const plant = await PlantModel.findOne({
    status: "active",
    name: plantName.trim(),
  })

  return plant == null
}

const isValidDates = () => {
  return false
}

export default {
  isValidId,
  nameExists,
  isValidDates,
}
