const getStatusChangeMsg = (oldStatus, newStatus) => {
  // Status did not change
  if (oldStatus === newStatus) return null;

  // Status is archived
  if (newStatus === "archived") return "Plant archived.";

  // Status was archived and now is active
  if (oldStatus === "archived") return "Plant unarchived.";

  // Status was inactive and now is active
  if (oldStatus === "inactive") return "Plant undeleted.";
};

const getDateChangeMsg = (propName, oldDate, newDate) => {
  const newDateObj = new Date(newDate);
  const oldDateObj = new Date(oldDate);

  if (!newDate) {
    return;
  }
  if (newDateObj.toJSON() !== oldDateObj.toJSON()) {
    return `${propName} changed to ${newDateObj.toISOString()}`;
  }
};

const getPropChangeMsg = (propName, oldProp, newProp) => {
  const ignoredProps = ["_id", "createdAt", "updatedAt"];
  const dateProps = [
    "vegStartedOn",
    "flowerStartedOn",
    "cureStartedOn",
    "harvestedOn",
    "archivedOn",
    "potentialHarvest",
  ];

  if (ignoredProps.includes(propName)) return;

  if (propName === "status") {
    return getStatusChangeMsg(oldProp, newProp);
  }

  if (dateProps.includes(propName)) {
    return getDateChangeMsg(propName, oldProp, newProp);
  }

  if (newProp !== oldProp) {
    return `${propName} changed to ${newProp}`;
  }
};

/**
 * Gets the change list for a plant update
 *
 * @param {*} oldPlant The old plant object
 * @param {*} newPlant The new plant object
 * @return {Array} The change list
 */
const getChangeList = (oldPlant, newPlant) => {
  const changeList = [];

  for (const prop in newPlant) {
    if (Object.hasOwn(newPlant, prop)) {
      const msg = getPropChangeMsg(prop, oldPlant[prop], newPlant[prop]);
      if (msg != null) changeList.push(msg);
    }
  }

  return changeList;
};

export default getChangeList;
