/**
 * @file Tests for Plant dates.
 */

import Plant from "../../../src/plants/Plant"

describe("Plant - Status dates", () => {
  test("should throw an error if archivedOn is set and status isn't `archived`", () => {
    expect(
      () =>
        new Plant({
          name: "Bob",
          status: "active",
          archivedOn: "2023-01-01",
        })
    ).toThrow(Error)
  })
})
