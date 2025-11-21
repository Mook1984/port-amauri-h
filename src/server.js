const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();

// Enable CORS to allow requests from the React frontend (port 3000)
app.use(cors({ origin: true, credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// Construct absolute path to the CSV file containing NCAA team data
// The CSV should be located at src/assets/mock_ncaa_team_metrics_2022_2024.csv
const DATA_PATH = path.join(__dirname, 'assets', 'mock_ncaa_team_metrics_2022_2024.csv');

// In-memory storage for all team records loaded from CSV
let teams = [];

/**
 * Normalize a raw CSV row into a consistent TeamData shape
 * Coerces all numeric fields to Number type, handles missing/empty values
 * @param {Object} raw - Raw row object from csv-parser
 * @returns {Object} Normalized team data object with typed fields
 */
function normalizeRow(raw) {
  // Helper to safely parse numeric values, returns undefined if missing/empty
  const n = (k) => (raw[k] !== undefined && raw[k] !== '' ? Number(raw[k]) : undefined);
  
  return {
    Season: n('Season') || 0,
    Team: String(raw.Team || raw.TeamName || ''),
    Division: String(raw.Division || ''),
    Wins: n('Wins') || 0,
    Losses: n('Losses') || 0,
    PointsPerGame: n('PointsPerGame') || 0,
    OppPointsPerGame: n('OppPointsPerGame') || 0,
    'FG%': n('FG%'),              // Field goal percentage
    '3P%': n('3P%'),              // Three-point percentage
    'FT%': n('FT%'),              // Free throw percentage
    Rebounds: n('Rebounds') || 0,
    Assists: n('Assists') || 0,
    Turnovers: n('Turnovers') || 0,
    Steals: n('Steals'),
    Blocks: n('Blocks'),
    OffRtg: n('OffRtg') || 0,     // Offensive rating (points per 100 possessions)
    DefRtg: n('DefRtg') || 0,     // Defensive rating (opponent points per 100 possessions)
    NetRtg: n('NetRtg') || 0,     // Net rating (OffRtg - DefRtg)
    Pace: n('Pace'),              // Possessions per 40 minutes
    'TS%': n('TS%'),              // True shooting percentage
    'eFG%': n('eFG%'),            // Effective field goal percentage
    WinShares: n('WinShares') || 0,
    StrengthOfSchedule: n('StrengthOfSchedule') || 0,
  };
}

/**
 * Analyze a team's strengths and weaknesses based on key metrics
 * Uses thresholds to determine team needs (areas to improve) and strengths
 * @param {Object} team - Normalized team data object
 * @returns {Object} Object with needs[] and strengths[] arrays
 */
function analyzeTeam(team) {
  const needs = [];
  const strengths = [];
  
  // Offensive efficiency analysis (100 is league average)
  if (team.OffRtg < 100) needs.push('Scoring help');
  else strengths.push('Efficient offense');
  
  // Defensive efficiency analysis (lower is better, 110+ is poor)
  if (team.DefRtg > 110) needs.push('Defensive improvement');
  else strengths.push('Solid defense');
  
  // Rebounding analysis (35 is threshold for strong rebounding)
  if (team.Rebounds < 35) needs.push('Rebounding depth');
  else strengths.push('Strong on boards');
  
  // Ball movement and turnover analysis (assist-to-turnover ratio)
  if (team.Assists > 0 && team.Turnovers > 0) {
    if (team.Assists / team.Turnovers < 1) needs.push('Playmaking guard');
    else strengths.push('Good ball movement');
  }
  
  return { needs, strengths };
}

/**
 * Calculate division-wide averages for key metrics
 * Used to compare individual teams against their division benchmark
 * @param {Array} teams - Array of all team objects
 * @returns {Object} Object mapping division names to average stats
 */
function divisionAverages(teams) {
  const byDiv = {};      // Accumulator for summing stats by division
  const counts = {};     // Count of teams per division
  
  // First pass: sum all stats by division
  teams.forEach(t => {
    const d = t.Division || 'Unknown';
    counts[d] = (counts[d] || 0) + 1;
    const agg = byDiv[d] || {};
    agg.OffRtg = (agg.OffRtg || 0) + t.OffRtg;
    agg.DefRtg = (agg.DefRtg || 0) + t.DefRtg;
    agg.Rebounds = (agg.Rebounds || 0) + t.Rebounds;
    agg['TS%'] = (agg['TS%'] || 0) + (t['TS%'] || 0);
    byDiv[d] = agg;
  });
  
  // Second pass: divide sums by counts to get averages
  Object.keys(byDiv).forEach(d => {
    const c = counts[d] || 1;
    const agg = byDiv[d];
    byDiv[d].OffRtg = (agg.OffRtg || 0) / c;
    byDiv[d].DefRtg = (agg.DefRtg || 0) / c;
    byDiv[d].Rebounds = (agg.Rebounds || 0) / c;
    byDiv[d]['TS%'] = (agg['TS%'] || 0) / c;
  });
  
  return byDiv;
}

/**
 * Load and parse the CSV file containing NCAA team metrics
 * Reads file as a stream, normalizes each row, and stores in memory
 * @returns {Promise<void>} Resolves when CSV is fully loaded
 */
function loadCsv() {
  return new Promise((resolve, reject) => {
    console.log(`Attempting to load CSV from: ${DATA_PATH}`);
    
    // Verify file exists before attempting to read
    if (!fs.existsSync(DATA_PATH)) {
      return reject(new Error(`CSV file not found at ${DATA_PATH}`));
    }
    
    const rows = [];
    
    // Create read stream and pipe through CSV parser
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (r) => {
        try {
          // Normalize each row and add to collection
          rows.push(normalizeRow(r));
        } catch (err) {
          // Log parse errors but continue processing other rows
          console.warn('Row parse error:', err);
        }
      })
      .on('end', () => {
        // Store parsed data in module-level variable
        teams = rows;
        console.log(`✓ Loaded ${teams.length} rows from CSV`);
        resolve();
      })
      .on('error', (err) => {
        console.error('CSV read stream error:', err);
        reject(err);
      });
  });
}

/**
 * GET /api/teams
 * Returns all team records from the loaded CSV
 * Used by frontend to populate team list and filters
 */
app.get('/api/teams', (req, res) => {
  try {
    console.log(`GET /api/teams → returning ${teams.length} teams`);
    res.json(teams);
  } catch (err) {
    console.error('GET /api/teams error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});

/**
 * GET /api/team/:name
 * Returns all season records for a specific team by name
 * Supports both exact match and URL-encoded team names
 * Used to show year-over-year trends for a selected team
 */
app.get('/api/team/:name', (req, res) => {
  try {
    const name = req.params.name;
    // Match by exact name or URL-encoded name (handles spaces and special chars)
    const matches = teams.filter(t => t.Team === name || encodeURIComponent(t.Team) === name);
    
    if (!matches.length) return res.status(404).json({ error: 'Team not found' });
    
    // Return array of all matching records (one per season)
    res.json(matches);
  } catch (err) {
    console.error('GET /api/team/:name error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});

/**
 * GET /api/analytics
 * Returns comprehensive analytics including:
 * - Total team count
 * - Division-wide averages for benchmarking
 * - Individual team insights (strengths/needs analysis)
 * Used by advanced analytics dashboards and comparison tools
 */
app.get('/api/analytics', (req, res) => {
  try {
    // Calculate division averages for comparative analysis
    const divAvg = divisionAverages(teams);
    
    // Generate insights for each team
    const teamInsights = teams.map(t => ({
      Team: t.Team,
      Season: t.Season,
      OffRtg: t.OffRtg,
      DefRtg: t.DefRtg,
      Rebounds: t.Rebounds,
      Assists: t.Assists,
      WinShares: t.WinShares,
      analysis: analyzeTeam(t),  // Add strengths/needs for this team
    }));
    
    res.json({
      totals: { count: teams.length },
      divisionAverages: divAvg,
      teamInsights,
    });
  } catch (err) {
    console.error('GET /api/analytics error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Load CSV data before starting server
loadCsv()
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Analytics server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('✗ Failed to load CSV:', err);
    process.exit(1);  // Exit with error code if CSV can't be loaded
  });
