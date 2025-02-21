/** @file Constants used for testing. */

/** Valid plant in the seedling stage. */
export const validSeedlingPlant = {
  name: "Bob",
  status: "active",
  stage: "seedling",
  startedOn: "2023-01-01",
  vegStartedOn: null,
  flowerStartedOn: null,
  harvestedOn: null,
  cureStartedOn: null,
  archivedOn: null,
  deletedOn: null,
}
/** Valid plant in the veg stage. */
export const validVegPlant = {
  ...validSeedlingPlant,
  stage: "veg",
  vegStartedOn: "2023-01-08",
}
/** Valid plant in the flower stage. */
export const validFlowerPlant = {
  ...validVegPlant,
  stage: "flower",
  flowerStartedOn: "2023-02-08",
}
/** Valid plant in the harvested stage. */
export const validHarvestedPlant = {
  ...validFlowerPlant,
  stage: "harvested",
  harvestedOn: "2023-11-08",
}
/** Valid plant in the harvested stage. */
export const validCurePlant = {
  ...validHarvestedPlant,
  stage: "cure",
  cureStartedOn: "2023-11-15",
}

/** Valid plant with archived status. */
export const validArchivedPlant = {
  ...validSeedlingPlant,
  status: "archived",
  archivedOn: "2023-01-01",
}
/** Valid plant with deleted status. */
export const validDeletedPlant = {
  ...validSeedlingPlant,
  stage: "inactive",
  deletedOn: "2023-01-01",
}

/** Valid plant object for each stage/status and the related date property to test against. */
export const stageDateProperties = [
  { propertyName: "startedOn", ...validSeedlingPlant },
  { propertyName: "vegStartedOn", ...validVegPlant },
  { propertyName: "flowerStartedOn", ...validFlowerPlant },
  { propertyName: "harvestedOn", ...validHarvestedPlant },
  { propertyName: "cureStartedOn", ...validCurePlant },
]
