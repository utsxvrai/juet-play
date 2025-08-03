# JUET Play Backend API

A robust, scalable Node.js backend for managing multi-sport tournaments, focused initially on badminton, with modular support for football, volleyball, basketball, and more. This API uses Express.js and MongoDB with Mongoose to provide RESTful services, real-time match scoring, player management, and live game updates via Socket.IO.

## Key Features

- **Sport Tournament Management:** Create and manage matches, players, and live scoring for multiple sports.
- **Real-Time Updates:** Uses WebSockets (Socket.IO) to broadcast live score changes instantly to connected clients.
- **RESTful API Design:** Clean, scalable endpoints for all CRUD operations on matches and players.
- **Modular Architecture:** Separate controllers, services, and data models enable easy maintenance and feature expansion.
- **Pagination Support:** Efficiently query large datasets with paginated player and match listings.
- **Environment Config:** Secure configuration using `.env` files for sensitive information and flexible deployment.
- **Error Handling:** Centralized error middleware for consistent API responses and easier debugging.
- **Extensible:** Easily add new sports, data models, and API routes following existing patterns.

## What This Application Does

JUET Play Backend powers the core logic for organizing and running sports tournaments:

- **Player Management:** Register and track players' details such as age, gender, country, wins, and losses.
- **Match Scheduling and Scoring:** Create matches with scheduled times, update scores set-by-set, and determine winners.
- **Live Game Interaction:** Players’ scores and match status update in real-time for live scoring using WebSockets.
- **Multi-Sport Capability:** Although focused on badminton initially, easily scale to other sports with minimal changes.
- **Data Retrieval:** Supports efficient querying of players and matches with pagination to ensure fast responses at scale.

## Architecture Overview

- **Express.js Server:** Handles HTTP requests and WebSocket communication.
- **MongoDB with Mongoose:** NoSQL database storing structured documents for players, matches, and game states.
- **Socket.IO:** Real-time bidirectional communication allowing live score updates.
- **MVC-like layering:** 
  - *Controllers* for request handling,
  - *Services* for business logic,
  - *Repositories (Models)* for database access.

## Getting Started

1. **Clone the repository**

2. **Install dependencies**

```npm install```

text

3. **Configure environment variables**

Create a `.env` file in the project root with:

```PORT=3000```
```MONGODB_URI=mongodb://localhost:27017/juetplay```


4. **Run the server**

```npm run dev```


## API Documentation

- **Players**
- `POST /api/v1/player` - Add new player
- `GET /api/v1/player` - List players (supports pagination)
- `GET /api/v1/player/:id` - Get player details
- `PUT /api/v1/player/:id` - Update player data
- `DELETE /api/v1/player/:id` - Delete player

- **Matches**
- `POST /api/v1/match` - Schedule new match
- `GET /api/v1/match` - List matches (supports pagination, sorting)
- `GET /api/v1/match/:id` - Get match details
- `PUT /api/v1/match/:id` - Update match state and scores
- `DELETE /api/v1/match/:id` - Delete match

- **Real-time updates**
- Connect via WebSockets to receive `scoreUpdate` events per match ID.

## Best Practices and Tips

- Modularize new sport-specific logic under similar MVC folders for maintainability.
- Use consistent pagination patterns to enhance performance with large datasets.
- Validate input thoroughly to maintain data integrity and avoid runtime errors.
- Use environment configs to separate deployment targets (local, staging, production).
- Monitor WebSocket connections and handle disconnects gracefully for live games.
- Employ logging and error tracking for production readiness.

## Future Enhancements

- User authentication and role-based access control.
- Tournament-level grouping with brackets and multi-round matches.
- Player rankings and statistics dashboard.
- Enhanced frontend integration with live visualization.
- API rate limiting and security hardening.

## License

Open source under the MIT License.

**Explore the JUET Play API for a scalable, real-time, multi-sport gaming backend ready to support your sports app development!**