import PlantModel from '../models/plantModel.js'
const isValidId = async (plantId) => {
  const count = await PlantModel.countDocuments({
    status: 'active',
    plantId: plantId.trim(),
  })

  return count === 0
}

const isValidName = async (plantName) => {
  const plant = await PlantModel.findOne({
    status: 'active',
    name: plantName.trim(),
  })

  return plant == null
}

const isValidDates = () => {
  return false
}

export default {
  isValidId,
  isValidName,
  isValidDates,
}
