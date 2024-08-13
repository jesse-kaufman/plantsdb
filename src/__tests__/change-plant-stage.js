import Plant from '../models/plantModel.js'
import config from '../config/config.js'
import dayjs from 'dayjs'

test(`Should return correct dates for seedling stage`, () => {
  const startedOn = '2022-01-01'
  const potentialHarvest = '2022-04-09' // 14 weeks from startedOn

  // Mock input
  const stageDates = {
    startedOn: new Date(`${startedOn}T00:00:00`),
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: undefined,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  // Get dates
  const newPlantDates = Plant.getNewStageDates('seedling', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for seedling stage (startedOn undefined)`, () => {
  // Mock input
  const stageDates = {}
  const today = dayjs()
  const weeks = config.seedlingWeeks + config.vegWeeks + config.flowerWeeks
  const potentialHarvest = today.add(weeks, 'weeks').format('YYYY-MM-DD')
  const todayDate = today.format('YYYY-MM-DD')

  // Expected result
  const expectedStageDates = {
    startedOn: `${todayDate}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: undefined,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('seedling', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for veg stage`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const potentialHarvest = '2022-04-11' // 13 weeks from vegStartedOn

  // Mock input
  const stageDates = {
    startedOn: new Date(`${startedOn}T00:00:00`),
    vegStartedOn: new Date(`${vegStartedOn}T00:00:00`),
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('veg', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for (vegStartedOn undefined)`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const potentialHarvest = '2022-04-11' // 13 weeks from vegStartedOn

  // Mock input
  const stageDates = {
    startedOn: new Date(`${startedOn}T00:00:00`),
    vegStartedOn: new Date(`${vegStartedOn}T00:00:00`),
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: undefined,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('veg', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for flower stage`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = '2022-02-24'
  const potentialHarvest = '2022-04-28' // 9 weeks from flowerStartedOn

  // Mock input
  const stageDates = {
    startedOn: new Date(`${startedOn}T00:00:00`),
    vegStartedOn: new Date(`${vegStartedOn}T00:00:00`),
    flowerStartedOn: new Date(`${flowerStartedOn}T00:00:00`),
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('flower', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for flower stage (flowerStartedOn undefined)`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = dayjs().format('YYYY-MM-DD')
  const potentialHarvest = dayjs()
    .add(config.flowerWeeks, 'weeks')
    .format('YYYY-MM-DD') // 9 weeks from flowerStartedOn

  // Mock input
  const stageDates = {
    startedOn: new Date(`${startedOn}T00:00:00`),
    vegStartedOn: new Date(`${vegStartedOn}T00:00:00`),
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    potentialHarvest: `${potentialHarvest}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('flower', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for harvest stage`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = '2022-02-24'
  const potentialHarvest = '2022-04-28'
  const harvestedOn = '2022-04-30'

  // Mock input
  const stageDates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    potentialHarvest,
    harvestedOn,
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
    potentialHarvest: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('harvested', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for harvest stage (harvestedOn undefined)`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = '2022-02-24'
  const harvestedOn = dayjs().format('YYYY-MM-DD')

  // Mock input
  const stageDates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
    potentialHarvest: undefined,
    cureStartedOn: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('harvested', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for cure stage`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = '2022-02-24'
  const potentialHarvest = '2022-04-28'
  const harvestedOn = '2022-04-30'
  const cureStartedOn = '2022-05-05'

  // Mock input
  const stageDates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    potentialHarvest,
    harvestedOn,
    cureStartedOn,
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
    cureStartedOn: `${cureStartedOn}T00:00:00`,
    potentialHarvest: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('cure', stageDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for cure stage (cureStartedOn undefined)`, () => {
  const startedOn = '2022-01-01'
  const vegStartedOn = '2022-01-10'
  const flowerStartedOn = '2022-02-24'
  const potentialHarvest = '2022-04-28'
  const harvestedOn = '2022-04-30'
  const cureStartedOn = dayjs().format('YYYY-MM-DD')

  // Mock input
  const stageDates = {
    startedOn,
    vegStartedOn,
    flowerStartedOn,
    potentialHarvest,
    harvestedOn,
  }

  // Expected result
  const expectedStageDates = {
    startedOn: `${startedOn}T00:00:00`,
    vegStartedOn: `${vegStartedOn}T00:00:00`,
    flowerStartedOn: `${flowerStartedOn}T00:00:00`,
    harvestedOn: `${harvestedOn}T00:00:00`,
    cureStartedOn: `${cureStartedOn}T00:00:00`,
    potentialHarvest: undefined,
    archivedOn: undefined,
  }

  const newPlantDates = Plant.getNewStageDates('cure', stageDates)
  console.log(newPlantDates)

  // Input and expected result should be identical
  expect(newPlantDates).toStrictEqual(expectedStageDates)
})

test(`Should return correct dates for archived status`, () => {
  const archivedOn = '2022-04-28'

  // Mock input
  const stageDates = {
    archivedOn,
  }

  const newPlantDates = Plant.getNewStageDates('archived', stageDates)

  // Archived on date should match input date in local timezone
  expect(newPlantDates.archivedOn).toEqual(`${archivedOn}T00:00:00`)
  // Potential harvest should be undefined
  expect(newPlantDates.potentialHarvest).toBeUndefined()
})

test(`Should return correct dates for archived status (archivedOn undefined)`, () => {
  const archivedOn = dayjs().format('YYYY-MM-DD')

  const newPlantDates = Plant.getNewStageDates('archived', {})

  // Archived on date should match today's date in local timezone
  expect(newPlantDates.archivedOn).toEqual(`${archivedOn}T00:00:00`)
  // Potential harvest should be undefined
  expect(newPlantDates.potentialHarvest).toBeUndefined()
})
