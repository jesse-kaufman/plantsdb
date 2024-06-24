const postSave = async function () {
  const { changes, oldPlant } = this.$locals

  // After saving, log the changes made to the plant
  await this.logChanges(changes, oldPlant)
}

export default { postSave }
