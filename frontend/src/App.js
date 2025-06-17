import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';

// Cricket Imports
import CricketMatchesPage from './pages/cricket/CricketMatchesPage';
import CricketTeamsPage from './pages/cricket/CricketTeamsPage';

// Football Imports
import FootballMatchesPage from './pages/football/FootballMatchesPage';
import FootballTeamsPage from './pages/football/FootballTeamsPage';

// Volleyball Imports
import VolleyballMatchesPage from './pages/volleyball/VolleyballMatchesPage';
import VolleyballTeamsPage from './pages/volleyball/VolleyballTeamsPage';

// Basketball Imports
import BasketballMatchesPage from './pages/basketball/BasketballMatchesPage';
import BasketballTeamsPage from './pages/basketball/BasketballTeamsPage';
import BasketballMatchDetailsPage from './pages/basketball/match/BasketballMatchDetailsPage';
import BasketballTeamDetailsPage from './pages/basketball/team/BasketballTeamDetailsPage';
import AddBasketballTeamPage from './pages/basketball/AddBasketballTeamPage';

// Placeholder for other sports pages
// import BasketballPage from './pages/basketball/BasketballPage'; 

import AddTeamPage from './pages/AddTeamPage';

import HostMatchSportSelectPage from './pages/host/HostMatchSportSelectPage';
import HostCricketPage from './pages/host/HostCricketPage';
import HostFootballPage from './pages/host/HostFootballPage';
import HostVolleyballPage from './pages/host/HostVolleyballPage';
import HostBasketballPage from './pages/host/HostBasketballPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Cricket Routes */}
      <Route path="/cricket" element={<CricketMatchesPage />} />
      <Route path="/cricket/matches" element={<CricketMatchesPage />} />
      <Route path="/cricket/teams" element={<CricketTeamsPage />} />
      {/* TODO: Add /cricket/match/:matchId and /cricket/team/:teamId/squad routes */}

      {/* Football Routes */}
      <Route path="/football" element={<FootballMatchesPage />} />
      <Route path="/football/matches" element={<FootballMatchesPage />} />
      <Route path="/football/teams" element={<FootballTeamsPage />} />
      {/* TODO: Add /football/match/:matchId and /football/team/:teamId/details routes */}
      
      {/* Volleyball Routes */}
      <Route path="/volleyball" element={<VolleyballMatchesPage />} />
      <Route path="/volleyball/matches" element={<VolleyballMatchesPage />} />
      <Route path="/volleyball/teams" element={<VolleyballTeamsPage />} />
      {/* TODO: Add /volleyball/match/:matchId and /volleyball/team/:teamId/details routes */}

      {/* Basketball Routes */}
      <Route path="/basketball" element={<BasketballMatchesPage />} />
      <Route path="/basketball/matches" element={<BasketballMatchesPage />} />
      <Route path="/basketball/teams" element={<BasketballTeamsPage />} />
      <Route path="/basketball/teams/add" element={<AddBasketballTeamPage />} />
      <Route path="/basketball/match/:matchId" element={<BasketballMatchDetailsPage />} />
      <Route path="/basketball/team/:teamId" element={<BasketballTeamDetailsPage />} />

      <Route path="/add-team" element={<AddTeamPage />} />

      <Route path="/host" element={<HostMatchSportSelectPage />} />
      <Route path="/host/cricket" element={<HostCricketPage />} />
      <Route path="/host/football" element={<HostFootballPage />} />
      <Route path="/host/volleyball" element={<HostVolleyballPage />} />
      <Route path="/host/basketball" element={<HostBasketballPage />} />

    </Routes>
  );
};

export default App;
