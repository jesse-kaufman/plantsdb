import Plant from "../../../src/plants/Plant"

describe("Plant - Status property", () => {
  test("should set status to `inactive` when delete() is called on an active plant", () => {
    const plant = new Plant({ name: "Bob", status: "active" })
    plant.delete()
    expect(plant.status).toEqual("inactive")
  })
  test("should set status to `inactive` when delete() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.delete()
    expect(plant.status).toEqual("inactive")
  })
  test("should set status to `active` when undelete() is called on an inactive plant", () => {
    const plant = new Plant({ name: "Bob", status: "inactive" })
    plant.undelete()
    expect(plant.status).toEqual("active")
  })
  test("should set status to `archived` when archive() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.archive()
    expect(plant.status).toEqual("archived")
  })
  test("should set status to `active` when unarchive() is called on an archived plant", () => {
    const plant = new Plant({ name: "Bob", status: "archived" })
    plant.unarchive()
    expect(plant.status).toEqual("active")
  })
})
