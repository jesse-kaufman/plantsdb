import { addLogEntry } from "../utils/log.js";

/**
 * Gets plant by ID.
 *
 * @param {*} plantId
 * @param {*} status
 * @returns
 */
const getById = async function (plantId, status = "active") {
  const query = {
    _id: plantId,
    status: status,
  };
  return await this.findOne(query);
};

/**
 * Gets all plants based on optional criteria.
 * @param {*} statuses
 * @returns
 */
const getAll = async function (statuses) {
  console.log(statuses);
  const statusFilter = statuses.map((status) => {
    console.log(`status: ${status}`);
    if (this.validStatuses.includes(status)) {
      return status;
    }
    return null;
  });
  const query = {
    status: { $in: statusFilter },
  };

  console.log(query);
  return await this.find(query);
};

const deleteOne = async function (plantId) {
  // Find and mark plant inactive
  const plant = await this.updateOne({ _id: plantId }, { status: "inactive" });
  addLogEntry(plantId, "Plant deleted");
  return plant;
};
export default { getById, getAll, deleteOne };
