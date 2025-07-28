import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';

import BadmintonMatchesPage from './pages/badminton/BadmintonMatchesPage';
import FootballTournamentsPage from './pages/football/FootballTournamentsPage';
import VolleyballTournamentsPage from './pages/volleyball/VolleyballTournamentsPage';
import BasketballTournamentsPage from './pages/basketball/BasketballTournamentsPage';

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

import BadmintonPlayersPage from './pages/badminton/BadmintonPlayersPage';
import AddBadmintonPlayerPage from './pages/badminton/AddBadmintonPlayerPage';
import BadmintonMatchDetailsPage from './pages/badminton/match/BadmintonMatchDetailsPage';
import BadmintonLiveScoringPage from './pages/badminton/BadmintonLiveScoringPage';
import BadmintonMatchScoringPage from './pages/badminton/BadmintonMatchScoringPage';


import AddTeamPage from './pages/AddTeamPage';

import HostMatchSportSelectPage from './pages/host/HostMatchSportSelectPage';
import HostFootballPage from './pages/host/HostFootballPage';
import HostVolleyballPage from './pages/host/HostVolleyballPage';
import HostBasketballPage from './pages/host/HostBasketballPage';
import HostBadmintonPage from './pages/host/HostBadmintonPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route path="/badminton" element={<BadmintonMatchesPage />} />
      <Route path="/badminton/players" element={<BadmintonPlayersPage />} />
      <Route path="/badminton/players/add" element={<AddBadmintonPlayerPage />} />
      <Route path="/badminton/match/:matchId" element={<BadmintonMatchDetailsPage />} />
      <Route path="/badminton/live-scoring" element={<BadmintonLiveScoringPage />} />
      <Route path="/badminton/matches" element={<BadmintonMatchesPage />} />
      <Route path="/live-scoring/:matchid" element={<BadmintonMatchScoringPage />} />
      


      <Route path="/football/tournaments" element={<FootballTournamentsPage />} />
      <Route path="/volleyball/tournaments" element={<VolleyballTournamentsPage />} />
      <Route path="/basketball/tournaments" element={<BasketballTournamentsPage />} />

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
      {/* ...host cricket route removed... */}
      <Route path="/host/badminton" element={<HostBadmintonPage />} />
      <Route path="/host/football" element={<HostFootballPage />} />
      <Route path="/host/volleyball" element={<HostVolleyballPage />} />
      <Route path="/host/basketball" element={<HostBasketballPage />} />

    </Routes>
  );
};

export default App;
