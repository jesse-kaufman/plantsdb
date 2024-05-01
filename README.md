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

- _Archived and inactive plants are hidden by default._
- _Inactive plants are plants that have been "deleted" through the API. They are only marked as inactive so they can be "undeleted" if necessary._

---

## Create a new plant

`POST /api/v1/plants`

### Valid `POST` request parameters

|              Field: | Type:                                            | Notes:                                        |
| ------------------: | ------------------------------------------------ | --------------------------------------------- |
|            **name** | _string_                                         | **_Required_**                                |
|          **source** | `seed`\|`clone`                                  | Defaults to `seed`                            |
|           **stage** | `seedling`\|`veg`\|`flower`\|`harvested`\|`cure` | Defaults to `seedling`                        |
|           **notes** | _string_                                         |                                               |
|       **startedOn** | _date (YYYY-MM-DD)_                              | Defaults to today                             |
|    **vegStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `startedOn` and < `flowerStartedOn` |
| **flowerStartedOn** | _date (YYYY-MM-DD)_                              | Must be > `vegStartedOn`                      |

_If the plant is a clone, stage will default to `veg` and `vegStartedOn` be set to the value of `startedOn`_

### Possible `POST` responses

**`HTTP 201`**

Successfully created plant. Response contains the newly-created plant. For example:

```json
{
  "_id": "662849f8b87798f29434dc23",
  "status": "active",
  "source": "seed",
  "name": "Roma Tomato 1",
  "stage": "veg",
  "startedOn": "2024-04-23T00:00:00.000+00:00",
  "potentialHarvest": "2024-06-25T00:00:00.000+00:00",
  "plantAbbr": "RT1-1",
  "createdAt": "2024-04-23T23:53:28.245+00:00",
  "updatedAt": "2024-04-24T12:39:59.743+00:00",
  "vegStartedOn": "2024-04-23T00:00:00.000+00:00"
}
```

**`HTTP 409`**

An active plant with the same name already exists. See [API Errors](#api-errors) below.

**`HTTP 500`**

An unrecoverable error occurred. See [API Errors](#api-errors) below.

## Get all plants

`GET /api/v1/plants`

List of plants will be filtered by any request parameters provided.

### Valid `GET /api/v1/plants` request parameters

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

### Possible `GET /api/v1/plants` responses

**`HTTP 200`**

Successfully found plants. Contains array of matching plant objects in response body. For example:

```json
[
  {
    "_id": "662849f8b87798f29434dc23",
    "status": "active",
    "source": "seed",
    "name": "Roma Tomato 1",
    "stage": "veg",
    "startedOn": "2024-04-23T00:00:00.000+00:00",
    "potentialHarvest": "2024-06-25T00:00:00.000+00:00",
    "plantAbbr": "RT1-1",
    "createdAt": "2024-04-23T23:53:28.245+00:00",
    "updatedAt": "2024-04-24T12:39:59.743+00:00",
    "vegStartedOn": "2024-04-23T00:00:00.000+00:00"
  },
  {
    "_id": "98f29434dc23662849f8b877",
    "status": "active",
    "source": "seed",
    "name": "Cherry Tomato 1",
    "stage": "veg",
    "startedOn": "2024-04-23T00:00:00.000+00:00",
    "potentialHarvest": "2024-06-25T00:00:00.000+00:00",
    "plantAbbr": "CT1-1",
    "createdAt": "2024-04-23T23:53:28.245+00:00",
    "updatedAt": "2024-04-24T12:39:59.743+00:00",
    "vegStartedOn": "2024-04-23T00:00:00.000+00:00"
  },
  ...
]
```

**`HTTP 404`**

No plants found matching the request data provided. See [API Errors](#api-errors) below.

**`HTTP 500`**

An unrecoverable error occurred. See [API Errors](#api-errors) below.

## Get a particular plant

`GET /api/v1/plants/{plantId}`

### Valid `GET /api/v1/plants/{plantId}` request parameters

See [valid request parameters](#valid-get-apiv1plants-request-parameters) for `GET /api/v1/plants` above.

### Possible `GET /api/v1/plants/{plantId}` responses

**`HTTP 200`**

Successfully found plant. Contains found plant object in response body. For example:

```json
{
  "_id": "662849f8b87798f29434dc23",
  "status": "active",
  "source": "seed",
  "name": "Roma Tomato 1",
  "stage": "veg",
  "startedOn": "2024-04-23T00:00:00.000+00:00",
  "potentialHarvest": "2024-06-25T00:00:00.000+00:00",
  "plantAbbr": "RT1-1",
  "createdAt": "2024-04-23T23:53:28.245+00:00",
  "updatedAt": "2024-04-24T12:39:59.743+00:00",
  "vegStartedOn": "2024-04-23T00:00:00.000+00:00"
}
```

**`HTTP 404`**

Plant not found. See [API Errors](#api-errors) below.

**`HTTP 500`**

An unrecoverable error occurred. See [API Errors](#api-errors) below.

## Update a plant

`PUT /api/v1/plants/{plantId}`

### Valid HTTP request parameters

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

_\*If the plant stage changes, the dates will be updated accordingly. For example:_

- _If the plant stage is changing from `flower` to `veg`, `flowerStartedOn` will be unset and `veg` will be set to today (unless provided in the request parameters)._
- _If the plant stage is changing from `veg` to `flower`, `flowerStartedOn` is set to today_

### Possible `PUT` responses

**`HTTP 200`**

Successfully updated plant. Contains the updated plant in body. For example:

```json
{
  "_id": "662849f8b87798f29434dc23",
  "status": "active",
  "source": "seed",
  "name": "Roma Tomato 1",
  "stage": "veg",
  "startedOn": "2024-04-23T00:00:00.000+00:00",
  "potentialHarvest": "2024-06-25T00:00:00.000+00:00",
  "plantAbbr": "RT1-1",
  "createdAt": "2024-04-23T23:53:28.245+00:00",
  "updatedAt": "2024-04-24T12:39:59.743+00:00",
  "vegStartedOn": "2024-04-23T00:00:00.000+00:00"
}
```

**`HTTP 404`**

Plant not found. See [API Errors](#api-errors) below.

**`HTTP 409`**

An active plant with the same name already exists. See [API Errors](#api-errors) below.

**`HTTP 500`**

An unrecoverable error occurred. See [API Errors](#api-errors) below.

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

If an error occurs, a response will be returned with the error message in the body. For example:

```json
{ "error": "Something bad happened." }
```

---

## Completeness level

- **Creating Plants:**

  - [x] Basic functionality
  - [x] Auto-generate `plantAbbr`
  - [x] Add log entry when creating plant
  - [ ] Validate plant before creation _(see Validation section below)_
  - [ ] Set `vegStartedOn` = `startedOn` if `source` == "clone"

- **Modifying Plants:**

  - [x] Basic functionality
  - [x] Regenerate `plantAbbr` if name changed
  - [x] Update dates when changing status
    - [x] Set "started on" dates to current date unless provided
    - [x] Unset "started on" dates that occur after current stage
  - [x] Add log entry when updating plant
  - [ ] Set `vegStartedOn` = `startedOn` if `source` == "clone"
  - [ ] Validate plant before updating _(see Validation section below)_
  - [ ] Add ability to update multiple plants at once
  - [ ] Add ability to mark plants as dead

- **Listing Plants:**

  - [x] Basic functionality
  - [ ] Filter based on request parameters

- **Deleting Plants:**

  - [x] Basic functionality
  - [x] Add log entry when deleting plant

- **Archiving Plants:**

  - [x] Basic functionality
  - [ ] Add log entry when archiving plant

- **Validation:**

  - [x] Set required dates based on plant stage
  - [x] Check plant name for characters outside letters, numbers, punctuation, and emoji
  - [x] Check plantAbbr for characters outside `a–z`, `A–Z`, `0–9` and `-`
  - [x] Validate stage start dates in relation to each other

- **Authentication:**

  - [ ] Implement OAauth and JWT-based authentication for API
  - [ ] Implement password-based authentication for GUI

- **Plant Journal:**

  - [ ] Add support for journal entry creation
  - [ ] Add ability to delete journal entries

### Other Planned Features

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
