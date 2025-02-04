/** @file Sets up routing structure. */

// import the routes for '/plants'
import plantRoutes from "./api/plants"
import logRoutes from "./api/log"

/**
 * 
 * @param {any} app 
 */
export const setupRoutes = (app) => {
  // Plant routes
  app.use("/api/v1/plants", plantRoutes)

  // Log routes
  app.use("/api/v1/logs", logRoutes)
}

export default setupRoutes
