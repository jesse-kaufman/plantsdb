/**
 * @file Main application file.
 */

// import connectDb from "./db/db.js"
import Plant from "./plants/PlantClass.js"

// TODO: run connectDb() here

const newPlant = {
  name: "Acapulco Gold",
  source: "seed",
  status: "active",
  stage: "seedling",
  startedOn: "2023-01-01",
  vegStartedOn: null,
  flowerStartedOn: null,
  potentialHarvest: null,
  harvestedOn: null,
  cureStartedOn: null,
  archivedOn: null,
  deletedOn: null,
  notes: "",
}

const plant = new Plant(newPlant)

plant.print()

plant.stage = "veg"
plant.vegStartedOn = "2023-01-08"

plant.print()

plant.stage = "flower"
plant.flowerStartedOn = "2024-02-08"

plant.print()

plant.stage = "harvested"
plant.harvestedOn = "2024-11-08"

plant.print()

plant.stage = "cure"
plant.cureStartedOn = "2024-11-15"

plant.print()

plant.delete()
plant.print()

plant.undelete()
plant.print()

plant.archive()
plant.print()
