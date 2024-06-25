import { Schema, model } from 'mongoose'

const LogSchema = new Schema(
  {
    plantId: {
      type: Schema.Types.ObjectId,
      ref: 'Plant',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info',
    },
  },
  { timestamps: true },
)

LogSchema.statics.logError = async (plantId, message) => {
  await addLogEntry(plantId, message, 'error')
}

LogSchema.statics.logWarn = async (plantId, message) => {
  await addLogEntry(plantId, message, 'warn')
}

LogSchema.statics.logInfo = async (plantId, message) => {
  await addLogEntry(plantId, message)
}

LogSchema.statics.log = async function (plantId, message) {
  await this.logInfo(plantId, message)
}

const LogModel = model('Log', LogSchema)

async function addLogEntry(plantId, message, level = 'info') {
  const log = new LogModel({ plantId, message, level })
  await log.save()
}
export default LogModel
