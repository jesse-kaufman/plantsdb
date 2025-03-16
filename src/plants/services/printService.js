/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/** @file Output printing service for plant. */

import chalk from "chalk"
import { validStages } from "../config/constants.js"
import Plant from "../Plant.js"

/**
 * Prints plant to console.
 * @param {Plant} plant - Plant to be printed.
 */
export const printPlant = (plant) => {
  console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"))
  console.log(
    chalk.blue(`Plant Information for: ${chalk.underline.bold(plant.name)}`)
  )
  console.log(chalk.blue("───────────────────────────────────────────────────"))

  const stageLabel = chalk.white("Stage:")
  const fStage = formatStage(plant.stage)
  const statusLabel = chalk.white("Status:").padStart(40 - plant.stage.length)
  const fStatus = formatStatus(plant.status)

  console.log(`${stageLabel} ${fStage} ${statusLabel} ${fStatus}`)

  // Print started on date
  {
    const date = plant.startedOn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    const fStageDate = formatStageDate(date, plant.stage === "seedling")
    console.log(`${chalk.white("Started:")} ${fStageDate}`)
  }

  // Print veg started on date
  if (plant.stage !== "seedling") {
    const date = plant.vegStartedOn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    console.log(
      chalk.white("Veg started:"),
      formatStageDate(date, plant.stage === "veg")
    )
  }

  // Print flower started on date
  if (validStages.indexOf(plant.stage) >= validStages.indexOf("flower")) {
    const date = plant.flowerStartedOn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    console.log(
      chalk.white(
        "Flower started:",
        formatStageDate(date, plant.stage === "flower")
      )
    )
  }

  // Print harvested on date
  if (validStages.indexOf(plant.stage) >= validStages.indexOf("harvested")) {
    const date = plant.harvestedOn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    console.log(
      chalk.white(
        "Harvested:",
        formatStageDate(date, plant.stage === "harvested")
      )
    )
  }

  // Print cure started on date
  if (validStages.indexOf(plant.stage) >= validStages.indexOf("cure")) {
    const date = plant.cureStartedOn.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    console.log(
      chalk.white(
        "Cure started:",
        formatStageDate(date, plant.stage === "cure")
      )
    )
  }

  console.log(chalk.grey("───────────────────────────────────────────────────"))
  console.log()
}

function formatStatus(status) {
  let fn = chalk.grey

  switch (status) {
    case "active":
      fn = chalk.green
      break
    case "inactive":
      fn = chalk.red
      break
    case "archived":
      fn = chalk.grey
      break
  }
  return fn(status)
}

function formatStage(stage) {
  let fn = chalk.bgBlack.dim

  switch (stage) {
    case "seedling":
      fn = chalk.bgBlue
      break
    case "veg":
      fn = chalk.bgGreen
      break
    case "flower":
      fn = chalk.bgHex("#4032a8")
      break
    case "harvested":
      fn = chalk.bgYellow
      break
  }
  return fn(` ${stage} `)
}

function formatStageDate(date, bold = false) {
  // Default to returning stage date text as-is
  let fn = chalk.white.italic.dim

  // If bold is true, bold date
  if (bold) {
    fn = chalk.whiteBright.italic
  }

  return fn(date)
}
