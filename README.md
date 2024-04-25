# PlantsDB

An in-progress project using NodeJS and MongoDB for tracking plants.

Currently, the backend API is in develpoment. Eventually there will be a frontend written in React, as well.

## Features

- Tracks the following information per-plant:
  - Name
  - Plant ID
  - Source (`seed` or `clone`)
  - Projected harvest date
  - Start date (date of sprouting)
  - Start date of vegetative phase
  - Start date of flowing phase
  - Harvest date
  - Start date of cure phase
  - Current stage (`seedling`, `veg`, `flower`, `harvested`, `cure`)
- Projected harvest date is auto-calculated and updated with each stage change
- Automatically generates unique plant IDs if not provided

### Current Functionality

- **Creating Plants:**

  - [x] Basic functionality
  - [x] Auto-generate `plantAbbr`
  - [x] Add log entry when creating plant
  - [ ] Validate plant before creation _(partial—see below)_
  - [ ] Set `vegStartedOn` = `startedOn` if `source` == "clone"

- **Modifying Plants:**

  - [x] Basic functionality
  - [x] Regenerate `plantAbbr` if name changed
  - [x] Update dates when changing status
    - [x] Set "started on" dates to current date unless provided
    - [x] Unset "started on" dates that occur after current stage
  - [x] Add log entry when updating plant
  - [ ] Set `vegStartedOn` = `startedOn` if `source` == "clone"
  - [ ] Validate plant before updating _(partial—see below)_
  - [ ] Add ability to update multiple plants at once
  - [ ] Add ability to mark plants as dead

- **Listing Plants:**

  - [x] Basic functionality
  - [ ] Filter based on request parameters

- **Deleting Plants:**

  - [x] Basic functionality
  - [ ] Add log entry when deleting plant

- **Archiving Plants:**

  - [x] Basic functionality
  - [ ] Add log entry when archiving plant

- **Validation:**

  - [x] Set required dates based on plant stage
  - [ ] Check plant name for characters outside `a–z`, `A–Z`, `0–9` and `-`
  - [ ] Validate stage start dates in relation to each other

### Other Planned Features

- **Authentication:**

  - [ ] Implement OAauth and JWT-based authentication for API
  - [ ] Implement password-based authentication for GUI

- **Plant Journal:**

  - [ ] Add support for journal entry creation
  - [ ] Add ability to delete journal entries

- **Frontend GUI:**

  - [ ] Implement frontend GUI
    - **Plants:**
      - [ ] Add ability to create plants
      - [ ] Add ability to view plants
      - [ ] Add ability to edit plants
      - [ ] Add ability to delete plants
      - [ ] Add ability to move plants between stages
      - [ ] Add ability to mark plant as dead
    - **Plant Journal:**
      - [ ] Add ability to add plant journal entries
      - [ ] Add ability to edit plant journal entries
      - [ ] Add ability to delete plant journal entries

---

## Plant Schema

|            Property: | Type:                                            | Notes:         |
| -------------------: | ------------------------------------------------ | -------------- |
|             **name** | _string_                                         | **Required**   |
|        **plantAbbr** | _string_                                         | Auto-generated |
|           **status** | `active`\|`archived`\|`inactive`                 | See below      |
|           **source** | `seed`\|`clone`                                  |                |
|            **stage** | `seedling`\|`veg`\|`flower`\|`harvested`\|`cure` |                |
|            **notes** | _string_                                         |                |
|        **startedOn** | _date (YYYY-MM-DD)_                              |                |
|     **vegStartedOn** | _date (YYYY-MM-DD)_                              |                |
|  **flowerStartedOn** | _date (YYYY-MM-DD)_                              |                |
| **potentialHarvest** | _date (YYYY-MM-DD)_                              | _Read-only_    |
|      **harvestedOn** | _date (YYYY-MM-DD)_                              |                |
|    **cureStartedOn** | _date (YYYY-MM-DD)_                              |                |

**Notes:**

- Archived and inactive plants are hidden by default.
- Inactive plants are plants that have been "deleted" through the API. They are only marked as inactive so they can be "undeleted" if necessary.

---

## Create a new plant

`POST /api/v1/plants`

### Valid HTTP request parameters

|              Field: | Type:                                            | Notes:                                        |
| ------------------: | ------------------------------------------------ | --------------------------------------------- |
|            **name** | _string_                                         | **_Required_**                                |
|          **source** | `seed`\|`clone`                                  | Defaults to `seed`                            |
|           **stage** | `seedling`\|`veg`\|`flower`\|`harvested`\|`cure` | Defaults to `seedling`                        |
|           **notes** | _string_                                         |                                               |
|       **startedOn** | _date (YYYY-MM-DD)_                              | Defaults to today                             |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `startedOn` and < `flowerStartedOn` |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `vegStartedOn`                      |

- If the plant is a clone, stage will default to `veg` and `vegStartedOn` be set to the value of `startedOn`

### Possible responses

- `HTTP 201` if successful (with newly-created plant object in body)
- `HTTP 409` if an active plant with the same name already exists
- `HTTP 500` if an error occurred (see API Errors below)

## Get all plants

`GET /api/v1/plants`

**Valid HTTP request parameters:**

List of plants will be filtered by the request parameters provided.

|              Field: | Type:                                            | Notes:               |
| ------------------: | ------------------------------------------------ | -------------------- |
|          **status** | `active`\|`archived`\|`inactive`                 | Defaults to 'active' |
|            **name** | _string_                                         |                      |
|           **stage** | `seedling`\|`veg`\|`flower`\|`harvested`\|`cure` |                      |
|       **startedOn** | _date (YYYY-MM-DD)_                              |                      |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                              |                      |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                              |                      |
|     **harvestedOn** | _date (YYYY-MM-DD)_                              |                      |
|   **cureStartedOn** | _date (YYYY-MM-DD)_                              |                      |
|      **archivedOn** | _date (YYYY-MM-DD)_                              |                      |

**Possible responses:**

- `HTTP 200` if successful with array of plant objects in body
- `HTTP 500` if an error occurred

## Get a particular plant

`GET /api/v1/plants/{plantId}`

## Update a plant

`PUT /api/v1/plants/{plantId}`

**Response:** Plant object with updates applied

**Valid HTTP request parameters:**

|              Field: | Type:                                            | Notes:                                         |
| ------------------: | ------------------------------------------------ | ---------------------------------------------- |
|            **name** | _string_                                         |                                                |
|          **source** | `seed`\|`clone`                                  |                                                |
|           **stage** | `seedling`\|`veg`\|`flower`\|`harvested`\|`cure` | See notes below\*                              |
|           **notes** | _string_                                         |                                                |
|       **startedOn** | _date (YYYY-MM-DD)_                              | Must be <= `vegStartedOn`                      |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                              | Must be >= `startedOn` and < `flowerStartedOn` |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `vegStartedOn` and < `harvestedOn`   |
|     **harvestedOn** | _date (YYYY-MM-DD)_                              | Must be > `harvestedOn` and < `cureStartedOn`  |
|   **cureStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `harvestedOn`                        |

\*If the plant stage changes, the dates will be updated accordingly. For example:

- If the plant stage is changing from `flower` to `veg`, `flowerStartedOn` will be unset and `veg` will be set to today (unless provided in the request parameters).
- If the plant stage is changing from `veg` to `flower`, `flowerStartedOn` is set to today

### Examples

To move a plant from `seedling` to `veg`, send the following to `PUT /api/v1/plants/{plantId}`:

```json
{
  "stage": "veg"
}
```

To move a plant from `seedling` to `veg` and set the start date to `'2024-04-20'`, send a `PUT` request to `/api/v1/plants/{plantId}` with the following request parameters:

```json
{
  "stage": "veg",
  "vegStartedOn": "2024-04-20"
}
```

To rename a plant from `'Tomato Plant 1'` to `'Roma Tomato Plant 1'`, send a `PUT` request to `/api/v1/plants/{plantId}` with the following request parameters:

```json
{
  "name": "Roma Tomato Plant 1"
}
```

## Delete a plant

`DELETE /api/v1/plants/{plantId}`

**Possible responses:**

- `HTTP 204` if successful
- `HTTP 500` if an error occurred (see API Errors below)

## API Errors

If an error occurs, an `HTTP 500` response will be returned with the error message in the response. For example:

```json
{ "error": "Something bad happened." }
```
