import dayjs from "dayjs";

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
    return `${propName} changed to ${dayjs(newDateObj).format("YYYY-MM-DD")}`;
  }
};

const getPropChangeMsg = (propName, oldProp, newProp) => {
  /** Properties to ignore */
  const ignoredProps = ["_id", "createdAt", "updatedAt"];
  /** Date properties */
  const dateProps = [
    "vegStartedOn",
    "flowerStartedOn",
    "cureStartedOn",
    "harvestedOn",
    "archivedOn",
    "potentialHarvest",
  ];

  // Ignore properties in ignoredProps array above
  if (ignoredProps.includes(propName)) return;

  // Property is plant status, get custom message
  if (propName === "status") {
    return getStatusChangeMsg(oldProp, newProp);
  }

  // Property is a date, get custom message
  if (dateProps.includes(propName)) {
    return getDateChangeMsg(propName, oldProp, newProp);
  }

  // Any other properties that changed
  return `${propName} changed to ${newProp}`;
};

/**
 * Gets the change list for a plant update
 *
 * @param {*} changes Changes made to the plant
 * @param {*} oldPlant The old plant object
 * @return {Array} The change list
 */
export const getChangeList = ({ $set }, oldPlant) => {
  const changeList = [];

  // Walk thorough list of properties being set
  for (const prop in $set) {
    // Verify that the property exists
    if (Object.hasOwn($set, prop)) {
      // Get the change message for the property
      const msg = getPropChangeMsg(prop, oldPlant[prop], $set[prop]);
      // Add message to array if not null
      if (msg != null) changeList.push(msg);
    }
  }

  return changeList;
};

export default { getChangeList };
