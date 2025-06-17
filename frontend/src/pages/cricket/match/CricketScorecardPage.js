import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CricketPageLayout from '../../../components/cricket/CricketPageLayout';

// Placeholder components for different tabs
const CommentaryView = ({ matchData }) => <div className="p-4 bg-slate-800/50 rounded-lg shadow"><h3 class="text-xl text-emerald-300 mb-2">Commentary</h3><p className="text-slate-300">Live commentary will appear here...</p></div>;
const BattingScorecard = ({ innings }) => {
  if (!innings) return <p className="text-slate-400">Yet to bat.</p>;
  return (
    <div className="overflow-x-auto bg-slate-800/50 rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-emerald-300">Batter</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-slate-300">Dismissal</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">R</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">B</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">4s</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">6s</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-slate-300">SR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {innings.batters.map((batter, idx) => (
            <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-2 whitespace-nowrap text-slate-100 font-medium">{batter.name}</td>
              <td className="px-4 py-2 text-slate-300 text-xs">{batter.dismissal}</td>
              <td className="px-2 py-2 text-right text-slate-100 font-semibold">{batter.runs}</td>
              <td className="px-2 py-2 text-right text-slate-300">{batter.balls}</td>
              <td className="px-2 py-2 text-right text-slate-300">{batter.fours}</td>
              <td className="px-2 py-2 text-right text-slate-300">{batter.sixes}</td>
              <td className="px-4 py-2 text-right text-slate-300">{batter.sr}</td>
            </tr>
          ))}
          <tr className="bg-slate-700/40">
            <td className="px-4 py-2 text-left font-semibold text-slate-200">Extras</td>
            <td colSpan="5" className="px-4 py-2 text-slate-300 text-xs">{innings.extras_detail}</td>
            <td className="px-4 py-2 text-right font-semibold text-slate-200">{innings.extras}</td>
          </tr>
          <tr className="bg-slate-700/60">
            <td className="px-4 py-2 text-left font-bold text-emerald-300">Total</td>
            <td colSpan="5" className="px-4 py-2 text-slate-100 font-semibold">{innings.wickets} wkts; {innings.overs} ov</td>
            <td className="px-4 py-2 text-right font-bold text-emerald-300">{innings.total_score}</td>
          </tr>
        </tbody>
      </table>
      {innings.fall_of_wickets && innings.fall_of_wickets.length > 0 && (
        <div className="p-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-emerald-300 mb-1">Fall of Wickets:</h4>
          <p className="text-xs text-slate-400">
            {innings.fall_of_wickets.map((fow, i) => (
              <span key={i}>{fow.score}-{fow.wicket} ({fow.batter}, {fow.over}){i < innings.fall_of_wickets.length - 1 ? ', ' : ''}</span>
            ))}
          </p>
        </div>
      )}
      {innings.did_not_bat && innings.did_not_bat.length > 0 && (
         <div className="p-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-emerald-300 mb-1">Did not bat:</h4>
          <p className="text-xs text-slate-400">
            {innings.did_not_bat.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

const BowlingScorecard = ({ bowlers }) => {
  if (!bowlers || bowlers.length === 0) return <p className="text-slate-400">No bowling data available.</p>;
  return (
    <div className="overflow-x-auto bg-slate-800/50 rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-emerald-300">Bowler</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">O</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">M</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">R</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">W</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">NB</th>
            <th className="px-2 py-2 text-right text-sm font-semibold text-slate-300">WD</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-slate-300">ECO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {bowlers.map((bowler, idx) => (
            <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-2 whitespace-nowrap text-slate-100 font-medium">{bowler.name}</td>
              <td className="px-2 py-2 text-right text-slate-300">{bowler.overs}</td>
              <td className="px-2 py-2 text-right text-slate-300">{bowler.maidens}</td>
              <td className="px-2 py-2 text-right text-slate-300">{bowler.runs_conceded}</td>
              <td className="px-2 py-2 text-right text-slate-100 font-semibold">{bowler.wickets}</td>
              <td className="px-2 py-2 text-right text-slate-300">{bowler.noballs}</td>
              <td className="px-2 py-2 text-right text-slate-300">{bowler.wides}</td>
              <td className="px-4 py-2 text-right text-slate-300">{bowler.economy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SquadsView = ({ teamASquad, teamBSquad }) => (
  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
      <h3 className="text-xl text-emerald-300 mb-2">{teamASquad.name}</h3>
      <ul className="list-disc list-inside text-slate-300 space-y-1">
        {teamASquad.players.map(player => <li key={player}>{player}</li>)}
      </ul>
    </div>
    <div className="bg-slate-800/50 rounded-lg shadow p-4">
      <h3 className="text-xl text-emerald-300 mb-2">{teamBSquad.name}</h3>
      <ul className="list-disc list-inside text-slate-300 space-y-1">
        {teamBSquad.players.map(player => <li key={player}>{player}</li>)}
      </ul>
    </div>
  </div>
);

// Sample Match Data (to be fetched based on matchId)
const sampleMatchData = {
  id: 1,
  matchTitle: 'Gujarat Titans vs Mumbai Indians, Eliminator',
  series: 'Indian Premier League 2025',
  venue: 'Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur, New Chandigarh',
  status: 'Mumbai Indians won by 20 runs',
  timestamp: '2h ago', // Or a proper date/time
  
  innings1: {
    teamName: 'Mumbai Indians Innings',
    total_score: '228-5',
    overs: '20 Ov',
    wickets: 5,
    batters: [
      { name: 'Rohit', dismissal: 'c Rashid Khan b Prasidh', runs: 81, balls: 50, fours: 9, sixes: 4, sr: '162.00' },
      { name: 'Bairstow (wk)', dismissal: 'c Gerald Coetzee b Sai Kishore', runs: 47, balls: 22, fours: 4, sixes: 3, sr: '213.64' },
      { name: 'Suryakumar Yadav', dismissal: 'c Washington Sundar b Sai Kishore', runs: 33, balls: 20, fours: 1, sixes: 3, sr: '165.00' },
      { name: 'Tilak Varma', dismissal: 'c Kusal Mendis b Siraj', runs: 25, balls: 11, fours: 0, sixes: 3, sr: '227.27' },
      { name: 'Hardik Pandya (c)', dismissal: 'not out', runs: 22, balls: 9, fours: 0, sixes: 3, sr: '244.44' },
      { name: 'Naman Dhir', dismissal: 'c Rashid Khan b Prasidh', runs: 9, balls: 6, fours: 0, sixes: 1, sr: '150.00' },
      { name: 'Santner', dismissal: 'not out', runs: 0, balls: 2, fours: 0, sixes: 0, sr: '0.00' },
    ],
    extras: 11,
    extras_detail: '(b 0, lb 7, w 4, nb 0, p 0)',
    fall_of_wickets: [
      { wicket: 1, batter: 'Bairstow', score: '84-1', over: '7.2' },
      { wicket: 2, batter: 'Suryakumar Yadav', score: '143-2', over: '12.6' },
      { wicket: 3, batter: 'Rohit', score: '186-3', over: '16.4' },
      { wicket: 4, batter: 'Tilak Varma', score: '194-4', over: '17.2' },
      { wicket: 5, batter: 'Naman Dhir', score: '206-5', over: '18.4' },
    ],
    did_not_bat: ['Raj Bawa', 'Boult', 'Bumrah', 'Richard Gleeson', 'Ashwani Kumar'],
  },
  bowling1: { // Gujarat Titans Bowling
    teamName: 'Gujarat Titans Bowling',
    bowlers: [
      { name: 'Prasidh Krishna', overs: '4', maidens: '0', runs_conceded: '45', wickets: '2', noballs: '0', wides: '1', economy: '11.25' },
      { name: 'Sai Kishore', overs: '4', maidens: '0', runs_conceded: '30', wickets: '2', noballs: '0', wides: '0', economy: '7.50' },
      { name: 'Mohammed Siraj', overs: '4', maidens: '0', runs_conceded: '50', wickets: '1', noballs: '0', wides: '2', economy: '12.50' },
      { name: 'Rashid Khan', overs: '4', maidens: '0', runs_conceded: '40', wickets: '0', noballs: '0', wides: '0', economy: '10.00' },
      { name: 'Gerald Coetzee', overs: '3', maidens: '0', runs_conceded: '35', wickets: '0', noballs: '0', wides: '1', economy: '11.67' },
      { name: 'Washington Sundar', overs: '1', maidens: '0', runs_conceded: '21', wickets: '0', noballs: '0', wides: '0', economy: '21.00' },
    ]
  },
  innings2: { // Gujarat Titans Innings
    teamName: 'Gujarat Titans Innings',
    total_score: '208-7',
    overs: '20 Ov',
    wickets: 7,
    batters: [
        // ... sample batters ...
    ],
    extras: 8,
    extras_detail: '(lb 2, w 5, nb 1)',
    fall_of_wickets: [
        // ... sample fow ...
    ],
     did_not_bat: ['Shubman Gill', 'Wriddhiman Saha'],
  },
  bowling2: { // Mumbai Indians Bowling
    teamName: 'Mumbai Indians Bowling',
    bowlers: [
        // ... sample bowlers ...
    ]
  },
  teamASquad: {
    name: 'Gujarat Titans',
    players: ['Shubman Gill (c)', 'Wriddhiman Saha (wk)', 'Sai Sudharsan', 'David Miller', 'Vijay Shankar', 'Rahul Tewatia', 'Rashid Khan', 'Noor Ahmad', 'Mohammed Shami', 'Mohit Sharma', 'Joshua Little', 'Kane Williamson']
  },
  teamBSquad: {
    name: 'Mumbai Indians',
    players: ['Rohit Sharma', 'Ishan Kishan (wk)', 'Suryakumar Yadav', 'Tilak Varma', 'Hardik Pandya (c)', 'Tim David', 'Nehal Wadhera', 'Piyush Chawla', 'Jasprit Bumrah', 'Kumar Kartikeya', 'Jason Behrendorff', 'Cameron Green']
  }
};

const CricketScorecardPage = () => {
  const { matchId } = useParams();
  const [activeTab, setActiveTab] = useState('Scorecard');
  const [matchDetails, setMatchDetails] = useState(null);

  // TODO: Fetch real match data based on matchId
  useEffect(() => {
    // Simulating API call
    const foundMatch = sampleMatchData; // In a real app, filter from a list or fetch
    setMatchDetails(foundMatch);
  }, [matchId]);

  if (!matchDetails) {
    return <CricketPageLayout><div className="text-center text-xl p-10">Loading match details...</div></CricketPageLayout>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Commentary':
        return <CommentaryView matchData={matchDetails} />;
      case 'Scorecard':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-400 mb-3">{matchDetails.innings1.teamName}</h2>
              <BattingScorecard innings={matchDetails.innings1} />
              <h3 className="text-xl font-medium text-emerald-300 mt-6 mb-2">Bowling - {matchDetails.bowling1.teamName}</h3>
              <BowlingScorecard bowlers={matchDetails.bowling1.bowlers} />
            </div>
            {matchDetails.innings2 && (
              <div>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-3">{matchDetails.innings2.teamName}</h2>
                <BattingScorecard innings={matchDetails.innings2} />
                {matchDetails.bowling2 && (
                  <>
                    <h3 className="text-xl font-medium text-emerald-300 mt-6 mb-2">Bowling - {matchDetails.bowling2.teamName}</h3>
                    <BowlingScorecard bowlers={matchDetails.bowling2.bowlers} />
                  </>
                )}
              </div>
            )}
          </div>
        );
      case 'Squads':
        return <SquadsView teamASquad={matchDetails.teamASquad} teamBSquad={matchDetails.teamBSquad} />;
      default:
        return null;
    }
  };

  const tabStyles = "py-2 px-4 sm:px-6 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap";
  const activeTabStyles = "text-emerald-400 border-b-2 border-emerald-400";
  const inactiveTabStyles = "text-slate-400 hover:text-emerald-300";

  return (
    <CricketPageLayout title={matchDetails.matchTitle}>
      <div className="mb-4 text-center">
        <p className="text-slate-300 text-sm">{matchDetails.series}</p>
        <p className="text-slate-400 text-xs">{matchDetails.venue}</p>
        <p className="text-emerald-400 font-semibold mt-1">{matchDetails.status} <span className="text-slate-500 text-xs">({matchDetails.timestamp})</span></p>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6 sm:mb-8 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-1 sm:gap-x-4">
          {['Commentary', 'Scorecard', 'Squads'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`${tabStyles} ${activeTab === tab ? activeTabStyles : inactiveTabStyles}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="fade-in">
         {renderTabContent()}
      </div>
    </CricketPageLayout>
  );
};

export default CricketScorecardPage; 