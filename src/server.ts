import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { normalizeRow, analyzeTeam, divisionAverages } from './analytics';
import { TeamData } from './types/team';

const app = express();

// CORS MUST be first — before any routes or middleware that might block requests
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'assets', 'mock_ncaa_team_metrics_2022_2024.csv');
let teams: TeamData[] = [];

// load CSV on startup
function loadCsv() {
  return new Promise<void>((resolve, reject) => {
    console.log(`Attempting to load CSV from: ${DATA_PATH}`);
    if (!fs.existsSync(DATA_PATH)) {
      return reject(new Error(`CSV file not found at ${DATA_PATH}`));
    }
    const rows: TeamData[] = [];
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (r: Record<string, any>) => {
        try {
          rows.push(normalizeRow(r));
        } catch (err) {
          console.warn('Row parse error:', err);
        }
      })
      .on('end', () => {
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

app.get('/api/teams', (req, res) => {
  try {
    console.log(`GET /api/teams → returning ${teams.length} teams`);
    res.json(teams);
  } catch (err) {
    console.error('GET /api/teams error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});

app.get('/api/team/:name', (req, res) => {
  try {
    const name = req.params.name;
    const matches = teams.filter(t => t.Team === name || encodeURIComponent(t.Team) === name);
    if (!matches.length) return res.status(404).json({ error: 'Team not found' });
    res.json(matches);
  } catch (err) {
    console.error('GET /api/team/:name error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
});

app.get('/api/analytics', (req, res) => {
  try {
    const divAvg = divisionAverages(teams);
    const teamInsights = teams.map(t => ({
      Team: t.Team,
      Season: t.Season,
      OffRtg: t.OffRtg,
      DefRtg: t.DefRtg,
      Rebounds: t.Rebounds,
      Assists: t.Assists,
      WinShares: t.WinShares,
      analysis: analyzeTeam(t),
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

const PORT = process.env.PORT || 5000;
loadCsv()
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Analytics server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('✗ Failed to load CSV:', err);
    process.exit(1);
  });
