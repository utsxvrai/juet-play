import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FOOTBALL_SERVICE_URL } from '../../utils/api';

const FootballMatchCard = ({ match }) => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        // Fetch team names for both teams
        const fetchTeam = async (id) => {
          if (!id) return null;
          const res = await fetch(`${FOOTBALL_SERVICE_URL}/api/v1/team/${id}`);
          if (res.ok) {
            const data = await res.json();
            return data.data;
          }
          return null;
        };

        const home = await fetchTeam(match.homeTeam);
        const away = await fetchTeam(match.awayTeam);
        setHomeTeam(home);
        setAwayTeam(away);
      } catch (error) {
        console.error('Error fetching team names:', error);
        setHomeTeam({ name: 'Home Team' });
        setAwayTeam({ name: 'Away Team' });
      } finally {
        setLoading(false);
      }
    };
    fetchTeamNames();
  }, [match]);

  if (!match) return null;

  const { _id, status, homeScore, awayScore, date, events } = match;

  // Determine winner for completed matches
  let winnerLine = null;
  const isCompleted = status && status.toLowerCase() === 'completed';
  if (isCompleted && homeTeam && awayTeam) {
    if (homeScore > awayScore) {
      winnerLine = `${homeTeam.name} won ${homeScore}-${awayScore}`;
    } else if (awayScore > homeScore) {
      winnerLine = `${awayTeam.name} won ${awayScore}-${homeScore}`;
    } else {
      winnerLine = `Draw ${homeScore}-${awayScore}`;
    }
  }

  let statusText = status ? status.toUpperCase() : 'SCHEDULED';
  let statusColor = 'bg-yellow-500 text-slate-900';
  let borderColor = 'border-yellow-500';

  if (status === 'LIVE' || status === 'ongoing') {
    statusColor = 'bg-red-500';
    borderColor = 'border-red-500';
  } else if (status === 'COMPLETED' || status === 'completed') {
    statusColor = 'bg-slate-600';
    borderColor = 'border-slate-600';
  }

  // Count events by type
  const goalEvents = events ? events.filter(e => e.type === 'goal').length : 0;
  const cardEvents = events ? events.filter(e => e.type === 'yellow_card' || e.type === 'red_card').length : 0;

  return (
    <div 
      className={`bg-slate-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 hover:shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 ${borderColor}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold tracking-wider ${statusColor}`}>{statusText}</span>
        <span className="text-xs text-slate-400">
          {goalEvents} goals • {cardEvents} cards
        </span>
      </div>
      
      {loading ? (
        <div className="text-slate-400 text-center py-4">Loading teams...</div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            {/* Home Team */}
            <div className="flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <span className="text-lg font-semibold text-green-300 truncate" title={homeTeam?.name || 'Home Team'}>
                  {homeTeam?.name || 'Home Team'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">{homeScore || 0}</span>
              </div>
            </div>
            
            {/* VS */}
            <div className="text-center text-slate-400 text-sm font-medium">VS</div>
            
            {/* Away Team */}
            <div className="flex justify-between items-center">
              <div className="flex items-center min-w-0">
                <span className="text-lg font-semibold text-green-300 truncate" title={awayTeam?.name || 'Away Team'}>
                  {awayTeam?.name || 'Away Team'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-400">{awayScore || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-green-400">
              {homeScore || 0} - {awayScore || 0}
            </span>
          </div>

          {/* Winner line for completed match */}
          {winnerLine && (
            <p className="text-center text-green-400 font-semibold mb-2">{winnerLine}</p>
          )}
          
          {/* Match Date */}
          {date && (
            <p className="text-xs text-slate-400 mb-4">
              {new Date(date).toLocaleString()}
            </p>
          )}
        </>
      )}
      
      <div className="mt-4 flex justify-end">
        <Link 
          to={`/football/match/${_id}`}
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FootballMatchCard; 