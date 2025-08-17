const Team = require('../models/team');
const Player = require('../models/player');
const Match = require('../models/match');
const mongoose = require('mongoose');

const sampleData = {
  teams: [
    {
      name: 'Manchester United',
      coach: 'Erik ten Hag',
      country: 'England',
      wins: 15,
      losses: 8,
      draws: 7
    },
    {
      name: 'Liverpool FC',
      coach: 'Jürgen Klopp',
      country: 'England',
      wins: 18,
      losses: 5,
      draws: 7
    },
    {
      name: 'Real Madrid',
      coach: 'Carlo Ancelotti',
      country: 'Spain',
      wins: 20,
      losses: 3,
      draws: 7
    },
    {
      name: 'Barcelona',
      coach: 'Xavi Hernández',
      country: 'Spain',
      wins: 17,
      losses: 6,
      draws: 7
    }
  ],
  players: [
    // Manchester United players
    { name: 'Marcus Rashford', age: 26, gender: 'male', position: 'forward', jerseyNumber: 10, country: 'England' },
    { name: 'Bruno Fernandes', age: 29, gender: 'male', position: 'midfielder', jerseyNumber: 8, country: 'Portugal' },
    { name: 'André Onana', age: 28, gender: 'male', position: 'goalkeeper', jerseyNumber: 24, country: 'Cameroon' },
    
    // Liverpool players
    { name: 'Mohamed Salah', age: 31, gender: 'male', position: 'forward', jerseyNumber: 11, country: 'Egypt' },
    { name: 'Virgil van Dijk', age: 32, gender: 'male', position: 'defender', jerseyNumber: 4, country: 'Netherlands' },
    { name: 'Alisson Becker', age: 31, gender: 'male', position: 'goalkeeper', jerseyNumber: 1, country: 'Brazil' },
    
    // Real Madrid players
    { name: 'Jude Bellingham', age: 20, gender: 'male', position: 'midfielder', jerseyNumber: 5, country: 'England' },
    { name: 'Vinícius Júnior', age: 23, gender: 'male', position: 'forward', jerseyNumber: 7, country: 'Brazil' },
    { name: 'Thibaut Courtois', age: 31, gender: 'male', position: 'goalkeeper', jerseyNumber: 1, country: 'Belgium' },
    
    // Barcelona players
    { name: 'Robert Lewandowski', age: 35, gender: 'male', position: 'forward', jerseyNumber: 9, country: 'Poland' },
    { name: 'Frenkie de Jong', age: 26, gender: 'male', position: 'midfielder', jerseyNumber: 21, country: 'Netherlands' },
    { name: 'Marc-André ter Stegen', age: 31, gender: 'male', position: 'goalkeeper', jerseyNumber: 1, country: 'Germany' }
  ],
  matches: [
    {
      homeTeam: null, // Will be set after teams are created
      awayTeam: null, // Will be set after teams are created
      homeScore: 2,
      awayScore: 1,
      date: new Date('2024-01-15T15:00:00Z'),
      status: 'completed',
      events: [
        { minute: 23, type: 'goal', description: 'Goal by Marcus Rashford', team: null },
        { minute: 45, type: 'goal', description: 'Goal by Bruno Fernandes', team: null },
        { minute: 67, type: 'goal', description: 'Goal by Mohamed Salah', team: null },
        { minute: 34, type: 'yellow_card', description: 'Yellow card for Casemiro', team: null }
      ]
    },
    {
      homeTeam: null, // Will be set after teams are created
      awayTeam: null, // Will be set after teams are created
      homeScore: 0,
      awayScore: 0,
      date: new Date('2024-01-20T20:00:00Z'),
      status: 'scheduled',
      events: []
    },
    {
      homeTeam: null, // Will be set after teams are created
      awayTeam: null, // Will be set after teams are created
      homeScore: 3,
      awayScore: 2,
      date: new Date('2024-01-18T18:30:00Z'),
      status: 'completed',
      events: [
        { minute: 12, type: 'goal', description: 'Goal by Jude Bellingham', team: null },
        { minute: 28, type: 'goal', description: 'Goal by Vinícius Júnior', team: null },
        { minute: 45, type: 'goal', description: 'Goal by Robert Lewandowski', team: null },
        { minute: 52, type: 'goal', description: 'Goal by Frenkie de Jong', team: null },
        { minute: 78, type: 'goal', description: 'Goal by Jude Bellingham', team: null }
      ]
    }
  ]
};

async function seedData() {
  try {
    console.log('🌱 Starting to seed football service data...');
    
    // Clear existing data
    await Match.deleteMany({});
    await Player.deleteMany({});
    await Team.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create teams
    const createdTeams = [];
    for (const teamData of sampleData.teams) {
      const team = await Team.create(teamData);
      createdTeams.push(team);
      console.log(`✅ Created team: ${team.name}`);
    }
    
    // Create players and assign to teams
    const createdPlayers = [];
    let playerIndex = 0;
    for (let i = 0; i < createdTeams.length; i++) {
      const team = createdTeams[i];
      const teamPlayers = [];
      
      // Assign 3 players to each team
      for (let j = 0; j < 3; j++) {
        if (playerIndex < sampleData.players.length) {
          const playerData = { ...sampleData.players[playerIndex], team: team._id };
          const player = await Player.create(playerData);
          createdPlayers.push(player);
          teamPlayers.push(player._id);
          console.log(`✅ Created player: ${player.name} for ${team.name}`);
          playerIndex++;
        }
      }
      
      // Update team with players
      team.players = teamPlayers;
      await team.save();
    }
    
    // Create matches
    const matchConfigs = [
      { homeIndex: 0, awayIndex: 1, matchIndex: 0 }, // Man Utd vs Liverpool
      { homeIndex: 2, awayIndex: 3, matchIndex: 1 }, // Real Madrid vs Barcelona
      { homeIndex: 0, awayIndex: 2, matchIndex: 2 }  // Man Utd vs Real Madrid
    ];
    
    for (const config of matchConfigs) {
      const matchData = { ...sampleData.matches[config.matchIndex] };
      matchData.homeTeam = createdTeams[config.homeIndex]._id;
      matchData.awayTeam = createdTeams[config.awayIndex]._id;
      
      // Update team references in events
      if (matchData.events && matchData.events.length > 0) {
        matchData.events = matchData.events.map(event => ({
          ...event,
          team: event.minute <= 45 ? matchData.homeTeam : matchData.awayTeam
        }));
      }
      
      const match = await Match.create(matchData);
      console.log(`✅ Created match: ${createdTeams[config.homeIndex].name} vs ${createdTeams[config.awayIndex].name}`);
    }
    
    console.log('🎉 Football service data seeding completed successfully!');
    console.log(`📊 Created ${createdTeams.length} teams, ${createdPlayers.length} players, and ${matchConfigs.length} matches`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };
