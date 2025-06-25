const mongoose = require('mongoose');
const Player = require('../models/player');
const ServerConfig = require('../config/server-config');

const cricketPlayers = [
  'Virat Kohli', 'Rohit Sharma', 'Shubman Gill', 'KL Rahul', 'Shreyas Iyer',
  'Hardik Pandya', 'Ravindra Jadeja', 'Jasprit Bumrah', 'Mohammed Siraj', 'Kuldeep Yadav',
  'Rishabh Pant', 'Axar Patel', 'Bhuvneshwar Kumar', 'Prithvi Shaw', 'Sanju Samson'
];

const footballPlayers = [
  'Lionel Messi', 'Cristiano Ronaldo', 'Neymar Jr', 'Kylian Mbappé', 'Luka Modrić',
  'Harry Kane', 'Kevin De Bruyne', 'Erling Haaland', 'Antoine Griezmann', 'Vinícius Júnior',
  'Mohamed Salah', 'Sergio Ramos', 'Pedri', 'João Félix', 'Bruno Fernandes'
];

const volleyballPlayers = [
  'Wilfredo León', 'Earvin N\'Gapeth', 'Max Holt', 'Matt Anderson', 'Lucarelli Souza',
  'Simone Giannelli', 'Micah Christenson', 'Aleksandar Atanasijević', 'Yoandy Leal', 'Bruno Rezende',
  'Ivan Zaytsev', 'Taylor Sander', 'Matey Kaziyski', 'Saeid Marouf', 'Trevor Clevenot'
];

const basketballPlayers = [
  'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Dončić',
  'Jayson Tatum', 'Joel Embiid', 'Ja Morant', 'Nikola Jokić', 'Anthony Davis',
  'Jimmy Butler', 'Kawhi Leonard', 'Devin Booker', 'Zion Williamson', 'Kyrie Irving'
];

const buildPlayers = () => {
  const all = [];

  cricketPlayers.forEach(name => all.push({ name, sport: 'CRICKET', stats: {} }));
  footballPlayers.forEach(name => all.push({ name, sport: 'FOOTBALL', stats: {} }));
  volleyballPlayers.forEach(name => all.push({ name, sport: 'VOLLEYBALL', stats: {} }));
  basketballPlayers.forEach(name => all.push({ name, sport: 'BASKETBALL', stats: {} }));

  return all;
};

const seed = async () => {
  try {
    await mongoose.connect(ServerConfig.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Player.deleteMany();
    console.log('🧹 Existing players cleared');

    const data = buildPlayers();
    await Player.insertMany(data);

    console.log('🌱 60 Players seeded successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding players:', err);
    mongoose.disconnect();
  }
};

seed();
