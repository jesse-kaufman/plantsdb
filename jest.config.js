/** @file Jest configuration. */
export default {
  globals: {
    // Make sure that Jest works in ESM mode (optional, sometimes needed)
    __dirname: "undefined",
  },
  projects: [
    {
      displayName: "backend",
      testMatch: ["./**/*.test.js"], // Path for backend tests
      transform: {
        "^.+\\.js$": "babel-jest",
      },
      testEnvironment: "node", // Use 'node' environment for backend testing
    },
    // {
    //   displayName: "client-web",
    //   testMatch: ["./client-web/**/*.test.js"], // Path for web client tests
    //   transform: {
    //     "^.+\\.js$": "babel-jest",
    //   },
    // },
    // {
    //   displayName: "client-cli",
    //   testMatch: ["./client-cli/**/*.test.js"], // Path for CLI client tests
    //   transform: {
    //     "^.+\\.js$": "babel-jest",
    //   },
    // },
  ],
}
