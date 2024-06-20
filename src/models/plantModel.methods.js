import { addLogEntry } from "../utils/log.js";
import { getChangeList } from "../utils/plantChangesService.js";

const logChanges = async function (changes) {
  const changeList = getChangeList(changes, this.$locals.oldPlant);
  console.log(changeList);
  await addLogEntry(this._id, `Updated plant:\n• ${changeList.join("\n• ")}`);
};

export default { logChanges };
