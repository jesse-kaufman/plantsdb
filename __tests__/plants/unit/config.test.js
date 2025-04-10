/** @file Unit tests for config.js. */
import { describe, it, expect, beforeEach, vi } from "vitest"

const expectedEnvVars = {
  PORT: "1234",
  MONGODB_URI: "mongodb://localhost:27017/test",
}

// Mock dotenv.config() as no-op mock.
vi.mock("dotenv", () => ({
  default: {
    config: vi.fn(() => {
      // Do nothing.
    }),
  },
}))

describe("Config Validation", () => {
  beforeEach(() => {
    // Restore the original environment after tests
    process.env = { ...expectedEnvVars }
    // Reset modules to ensure fresh state
    vi.resetModules()
  })

  it("should throw error if MONGODB_URI is missing", async () => {
    // Simulate missing MONGODB_URI by deleting it.
    delete process.env.MONGODB_URI

    try {
      // Dynamically import the config module after modifying process.env
      await import("@/config/config.js")
      throw new Error("Expected to throw error, but it didn't.")
    } catch (error) {
      expect(error.message).toMatch(
        "Missing required environment variable: MONGODB_URI"
      )
    }
  })

  it("should throw error if PORT is missing", async () => {
    // Simulate missing PORT by deleting it
    delete process.env.PORT

    try {
      // Dynamically import the config module after modifying process.env
      await import("@/config/config.js")
      throw new Error("Expected to throw error, but it didn't.")
    } catch (error) {
      expect(error.message).toMatch(
        "Missing required environment variable: PORT"
      )
    }
  })
})
