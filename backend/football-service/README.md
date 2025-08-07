# Football Service Backend

A complete backend service for managing football teams, players, and matches with real-time scoring capabilities.

## Features

- **Team Management**: Create, update, delete, and view football teams
- **Player Management**: Manage players with jersey numbers, positions, and statistics
- **Match Management**: Create matches, track scores, and manage match events
- **Business Logic**: Automatic team stats updates when matches are completed
- **Caching**: Redis integration for improved performance
- **Validation**: Jersey number uniqueness within teams, player deletion protection

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3002
   MONGO_URI=mongodb://localhost:27017/football-service
   REDIS_URL=redis://localhost:6379
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on port 3002.

## API Endpoints

### Teams
- `GET /api/v1/team` - Get all teams (with pagination)
- `GET /api/v1/team/:id` - Get team by ID
- `POST /api/v1/team/create` - Create a new team
- `PUT /api/v1/team/:id` - Update team
- `DELETE /api/v1/team/:id` - Delete team
- `GET /api/v1/team/country/:country` - Get teams by country

### Players
- `GET /api/v1/player` - Get all players (with pagination)
- `GET /api/v1/player/:id` - Get player by ID
- `POST /api/v1/player/create` - Create a new player
- `PUT /api/v1/player/:id` - Update player
- `DELETE /api/v1/player/:id` - Delete player
- `GET /api/v1/player/country/:country` - Get players by country

### Matches
- `GET /api/v1/match` - Get all matches (with pagination)
- `GET /api/v1/match/:id` - Get match by ID
- `POST /api/v1/match/create` - Create a new match
- `PUT /api/v1/match/:id` - Update match
- `DELETE /api/v1/match/:id` - Delete match

## Data Models

### Team
```javascript
{
  name: String (required, unique),
  coach: String (required),
  country: String (required),
  wins: Number (default: 0),
  losses: Number (default: 0),
  draws: Number (default: 0),
  players: [Player IDs],
  timestamps
}
```

### Player
```javascript
{
  name: String (required),
  age: Number (required),
  gender: String (enum: male, female, other),
  position: String (enum: goalkeeper, defender, midfielder, forward),
  jerseyNumber: Number (required, 1-99),
  country: String (required),
  team: Team ID (optional),
  goals: Number (default: 0),
  assists: Number (default: 0),
  yellowCards: Number (default: 0),
  redCards: Number (default: 0),
  timestamps
}
```

### Match
```javascript
{
  homeTeam: Team ID (required),
  awayTeam: Team ID (required),
  homeScore: Number (default: 0),
  awayScore: Number (default: 0),
  date: Date (required),
  status: String (enum: scheduled, ongoing, completed),
  events: [{
    minute: Number,
    type: String (enum: goal, yellow_card, red_card, substitution),
    player: Player ID,
    team: Team ID,
    description: String
  }],
  timestamps
}
```

## Business Logic

### Team Stats Update
When a match is marked as "completed", the system automatically updates the team statistics:
- Home team wins: `homeTeam.wins++`, `awayTeam.losses++`
- Away team wins: `awayTeam.wins++`, `homeTeam.losses++`
- Draw: `homeTeam.draws++`, `awayTeam.draws++`

### Player Deletion Protection
Players cannot be deleted if they are:
- Referenced in any team's players array
- Referenced in any match events

### Jersey Number Validation
- Jersey numbers must be between 1-99
- Jersey numbers must be unique within a team

## Testing

Run the integration test:
```bash
node test-integration.js
```

This will test all major endpoints and verify the backend is working correctly.

## Frontend Integration

The frontend is configured to connect to this service at `http://localhost:3002`. Make sure the frontend API configuration points to the correct URL.

## CORS Configuration

The service is configured to accept requests from:
- `http://localhost:3000` (frontend development)
- `https://juet-play.vercel.app` (production frontend)