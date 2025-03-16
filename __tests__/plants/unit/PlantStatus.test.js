/** @file Plant status tests. */
/* eslint-disable max-lines-per-function */
import { describe, it, expect, beforeEach } from "vitest"
import Plant from "../../../src/plants/Plant.js"
import { validSeedlingPlant } from "../testConstants.js"

const validPlant = { ...validSeedlingPlant }

// Test transitioning between different plant statuses
describe("status transitions", () => {
  let plant = {}

  // Reset plant before each test
  beforeEach(() => {
    plant = new Plant(validPlant)
  })

  // Test deleting a plant
  it("should set status to 'inactive' when delete() is called on a plant", () => {
    // Test deleting an active plant
    plant.delete() // Delete the plant
    expect(plant.status).toBe("inactive") // Ensure status is inactive

    // Test deleting an archived plant
    plant.undelete() // Restore the plant
    plant.archive() // Archive the plant
    plant.delete() // Delete the plant again
    expect(plant.status).toBe("inactive") // Ensure status is inactive

    // Repeat to verify that calling delete() again doesn't change the status
    plant.delete()
    expect(plant.status).toBe("inactive") // Status should stay inactive
  })

  // Test restoring a plant
  it("should set status to 'active' when undelete() is called on an inactive plant", () => {
    plant.delete() // First delete the plant
    plant.undelete() // Then restore it
    expect(plant.status).toBe("active") // Ensure status is active

    // Repeat to verify that calling undelete() again doesn't change the status
    plant.undelete()
    expect(plant.status).toBe("active") // Ensure status is active
  })

  // Test archiving an active plant
  it("should set status to 'archived' when archive() is called on an active or archived plant", () => {
    plant.archive() // Archive the plant
    expect(plant.status).toBe("archived") // Ensure status becomes archived

    // Repeat to verify that calling archive() again doesn't change the status
    plant.archive()
    expect(plant.status).toBe("archived") // Status should stay archived
  })

  // Test archiving a deleted plant
  it("should leave status as-is when archive() is called on an deleted plant", () => {
    plant.delete() // Delete the plant first
    plant.archive() // Then archive it
    expect(plant.status).toBe("inactive") // Status should stay inactive
  })

  // Test unarchiving a plant
  it("should set status to 'active' when unarchive() is called on an archived or active plant", () => {
    plant.archive() // Archive the plant first
    plant.unarchive() // Unarchive the plant
    expect(plant.status).toBe("active") // Ensure status becomes active

    // Repeat to verify that calling unarchive() again doesn't change the status
    plant.unarchive()
    expect(plant.status).toBe("active") // Ensure status becomes active
  })

  // Test deleting an archived plant
  it("should set status to 'inactive' when delete() is called on an archived plant", () => {
    plant.archive() // Archive the plant first
    plant.delete() // Then delete it
    expect(plant.status).toBe("inactive") // Ensure status becomes inactive
  })

  // Test restoring a plant that isn't deleted
  it("should leave status as-is if undelete() is called on an active or archived plant", () => {
    // Test restoring an active plant
    plant.undelete() // Restore the active plant
    expect(plant.status).toBe("active") // Active plant remains active

    // Test restoring an archived plant
    plant.archive() // First archive the plant
    plant.undelete() // Then try to restore it
    expect(plant.status).toBe("archived") // Archived plant remains archived
  })
})
