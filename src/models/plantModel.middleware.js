/**
 * Logs changes made to the plant after saving
 */
const postSave = async function () {
  const { changes, oldPlant, isNew } = this.$locals

  if (this.status === 'inactive') {
    await this.log('Plant deleted')
    return
  }

  if (isNew) {
    await this.log('Plant created')
    return
  }

  await this.logChanges(changes, oldPlant)
}

export default { postSave }
