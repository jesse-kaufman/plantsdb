# PlantsDB

An in-progress project using NodeJS and MongoDB for tracking plants.

Currently, the backend API is in develpoment. Eventually there will be a frontend written in React, as well.

## Features

- Tracks the following information per-plant:
  - Name
  - Plant ID
  - Source (seed or clone)
  - Projected harvest date
  - Start date (date of sprouting)
  - Start date of vegetative phase
  - Start date of flowing phase
  - Harvest date
  - Start date of cure phase
  - Current stage (seedling, veg, flower, cure)
- Projected harvest date is auto-calculated and updated with each stage change
- Automatically generates unique plant IDs if not provided

### Current Functionality

- **Creating Plants:**

  - [x] Basic functionality
  - [ ] Validate plant before creation _(partial—see below)_
  - [x] Add log entry when creating plant

- **Modifying Plants:**

  - [x] Basic functionality
  - [ ] Validate plant before updating _(partial—see below)_
  - [x] Add log entry when updating plant
  - [ ] Add ability to update multiple plants at once

- **Deleting Plants:**

  - [x] Basic functionality
  - [ ] Add log entry when deleting plant

- **Archiving Plants:**

  - [x] Basic functionality
  - [ ] Add log entry when archiving plant

- **Validation (applies to plant creation and modification):**

  - [ ] Check plant name for characters outside a–z, A–Z, 0–9 and '-'
  - [x] Set required dates based on plant stage
  - [ ] Validate stage start dates in relation to each other

### Other Planned Features

- **Plant Journal:**
  - [ ] Add support for journal entry creation
  - [ ] Add ability to delete journal entries

---

## Plant Schema

|            Property: | Type:                                              | Notes:    |
| -------------------: | -------------------------------------------------- | --------- |
|          **plantId** | _string_                                           |           |
|             **name** | _string_                                           |           |
|           **status** | _'active', 'archived', 'inactive'_                 | See below |
|           **source** | _'seed' or 'clone'_                                |           |
|            **stage** | _'seedling', 'veg', 'flower', 'harvested', 'cure'_ |           |
|            **notes** | _string_                                           |           |
|        **startedOn** | _date (YYYY-MM-DD)_                                |           |
|     **vegStartedOn** | _date (YYYY-MM-DD)_                                |           |
|  **flowerStartedOn** | _date (YYYY-MM-DD)_                                |           |
| **potentialHarvest** | _date (YYYY-MM-DD)_                                | Read-only |
|      **harvestedOn** | _date (YYYY-MM-DD)_                                |           |
|    **cureStartedOn** | _date (YYYY-MM-DD)_                                |           |

**Notes about plant status:**
Archived plants are hidden by default. Inactive plants are plants that have been "deleted" through the API. They are only marked as inactive so they can be "undeleted" if necessary.

---

## API Documentation

### CREATE OPERATIONS

#### Create a new plant

`POST /api/v1/plants`

**Response:** Object of plant created

**Request data fields:**

|           Field: | Type:                                              | Notes:                                    |
| ---------------: | -------------------------------------------------- | ----------------------------------------- |
|         **name** | _string_                                           | **Required**                              |
|      **plantId** | _string_                                           | Auto-generated from name if not provided  |
|       **source** | _'seed' or 'clone'_                                | Defaults to 'seed'                        |
|        **notes** | _string_                                           |                                           |
|        **stage** | _'seedling', 'veg', 'flower', 'harvested', 'cure'_ | Defaults to 'seedling'                    |
|    **startedOn** | _date (YYYY-MM-DD)_                                | Defaults to today                         |
| **vegStartedOn** | _date (YYYY-MM-DD)_                                | Must be > startedOn and < flowerStartedOn |

**Notes:**

- If the plant is a clone, stage will default to 'veg' and `vegStartedOn` = `startedOn`

### READ OPERATIONS

#### Get all plants

`GET /api/v1/plants`

**Response:** Array of plant objects

**Request data fields:**

|              Field: | Type:                                              | Notes:               |
| ------------------: | -------------------------------------------------- | -------------------- |
|        **statuses** | _'active','archived','inactive'_                   | Defaults to 'active' |
|            **name** | _string_                                           |                      |
|           **notes** | _string_                                           |                      |
|           **stage** | _'seedling', 'veg', 'flower', 'harvested', 'cure'_ |                      |
|       **startedOn** | _date (YYYY-MM-DD)_                                |                      |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                                |                      |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                                |                      |
|     **harvestedOn** | _date (YYYY-MM-DD)_                                |                      |
|   **cureStartedOn** | _date (YYYY-MM-DD)_                                |                      |
|      **archivedOn** | _date (YYYY-MM-DD)_                                |                      |

#### Get a particular plant

`GET /api/v1/plants/{plantId}`

### UPDATE OPERATIONS

#### Update a plant

`PUT /api/v1/plants/{plantId}`

**Response:** Plant object with updates applied

**Request data fields:**

|              Field: | Type:                                              | Notes:                                     |
| ------------------: | -------------------------------------------------- | ------------------------------------------ |
|            **\_id** | _MongoDB document ID_                              | **Required**                               |
|            **name** | _string_                                           |                                            |
|           **notes** | _string_                                           |                                            |
|           **stage** | _'seedling', 'veg', 'flower', 'harvested', 'cure'_ |                                            |
|       **startedOn** | _date (YYYY-MM-DD)_                                | Must be <= vegStartedOn                    |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                                | Must be >= startedOn and < flowerStartedOn |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                                | Must be > vegStartedOn and < harvestedOn   |
|     **harvestedOn** | _date (YYYY-MM-DD)_                                | Must be > harvestedOn and < cureStartedOn  |
|   **cureStartedOn** | _date (YYYY-MM-DD)_                                | Must be > harvestedOn                      |

**Notes:**

- If the plant stage changes, the dates will be updated accordingly:
  - E.g.: if the plant is moving from flower to veg, `flowerStartedOn` will be unset

### DELETE OPERATIONS

`DELETE /api/v1/plants/{plantId}`
