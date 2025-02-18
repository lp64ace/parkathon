# Parkathon

Parkathon is a web application designed to help users find parking spots efficiently. Using user feedback and machine learning, it provides probabilistic predictions for parking availability, making it the perfect parking companion.

## Features

- **Real-time Availability**: Determines parking availability based on nearby users' parking or unparking activities.
- **Historical Data Analysis**: Fetches historical parking data from a database and uses a machine learning model to predict future parking availability.
- **User-friendly Interface**: An intuitive frontend to display parking predictions to users through a map.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Apendix
For more details please refer to `docs/parkathon.pdf`

## Deploy

How to deploy with docker-compose

```
docker-compose build
docker-compose up
```

## Backend

As far as the backend is concerned the following queries are available on port 9000.

### POST /map/name/at

**Purpose**: This endpoint is used to return information about the name of a location.

**Query Parameters**:

- `lat`: (number) The latiture of the location.
- `lon`: (number) The longtitute of the location.

### POST /park/list/active

**Purpose**: This endpoint is used to return a list of all the current parking spots occupied by the specified user.

**Query Parameters**:

- `user`: (number) The unique ID of the user occupying the parking spot.

### POST /park/list/all

**Purpose**: This endpoint is used to return a list of all the parking spots listed by the specified user.

**Query Parameters**:

- `user`: (number) The unique ID of the user occupying the parking spot.

### POST /park/occupy

**Purpose**: This endpoint is used to mark a specific location as occupied by a user.

**Query Parameters**:

- `user`: (number) The unique ID of the user occupying the parking spot.
- `lat`: (number) The latiture of the location.
- `lon`: (number) The longtitute of the location.

### POST /park/vacay

**Purpose**: This endpoint is used to mark a specific parking as vacated by a user.

**Query Parameters**:

- `user`: (number) The unique ID of the user occupying the parking spot.
- `parking`: (number) The unique ID of the parking location that should be marked as vacated.

### POST /park/find

**Purpose**: This endpoint is used to return all the currently empty parking location near a location

**Query Parameters**:

- `lat`: (number) The latiture of the location.
- `lon`: (number) The longtitute of the location.
- `rad`: (number) The radius in meters we want to search.

### POST /park/demo/clean

**Purpose**: This endpoint is used to remove all parking entries from user 'demo'

### POST /park/demo/simulate

**Purpose**: This endpoint is used to simulate parking entries using the user 'demo' near a location

**Query Parameters**:

- `q_lat`: (number) The latiture of the location.
- `q_lon`: (number) The longtitute of the location.
- `rad`: (number) The radius in meters we want to occupy.
