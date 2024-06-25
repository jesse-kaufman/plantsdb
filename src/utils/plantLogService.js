/**
 * Creates a new log entry listing the changes made to the plant
 *
 * @param {*} changes
 */
export const logChanges = async function (changes) {
  const changeList = getChangeList(changes, this.$locals.oldPlant)
  await LogModel.log(this._id, `Updated plant:\n• ${changeList.join('\n• ')}`)
}

export default { logChanges }
