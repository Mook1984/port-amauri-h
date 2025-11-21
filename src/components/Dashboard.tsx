import React, { useEffect, useState } from 'react';
// Recharts components for data visualization
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import styled from 'styled-components';

// Type definition for a team row - allows any property name with any value type
type TeamRow = Record<string, any>;

/**
 * Parses CSV text into an array of team objects
 * Handles quoted fields, CRLF/LF line endings, and escaped quotes within fields
 * @param text - Raw CSV text string
 * @returns Array of team objects where keys are column headers
 */
function parseCsvText(text: string): TeamRow[] {
  const rows: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      // handle quoted quotes
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === '\n' || ch === '\r') {
      // normalize CRLF and LF
      if (!inQuotes) {
        if (cur !== '') {
          rows.push(cur);
          cur = '';
        }
        // skip additional \n in CRLF
        if (ch === '\r' && text[i + 1] === '\n') i++;
      } else {
        cur += ch;
      }
    } else {
      cur += ch;
    }
  }
  if (cur !== '') rows.push(cur);

  const parsed: TeamRow[] = [];
  if (rows.length === 0) return parsed;
  const header = splitCsvLine(rows[0] || '');
  for (let r = 1; r < rows.length; r++) {
    const cols = splitCsvLine(rows[r]);
    if (cols.length === 0) continue;
    const obj: TeamRow = {};
    for (let c = 0; c < header.length; c++) {
      obj[header[c]] = cols[c] ?? '';
    }
    parsed.push(obj);
  }
  return parsed;
}

/**
 * Splits a single CSV line into individual field values
 * Respects quoted fields containing commas
 * @param line - Single CSV line to split
 * @returns Array of field values (trimmed)
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result.map(s => s.trim());
}

// Styled component: Grid layout for displaying team cards
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

// Styled component: Individual team card with hover effects and selection state
const TeamCard = styled.div<{ selected?: boolean }>`
  background: ${p => (p.selected ? '#ff6b35' : '#1a1a1a')};
  border: 2px solid ${p => (p.selected ? '#ff6b35' : '#333')};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;

  &:hover {
    border-color: #ff6b35;
    transform: translateY(-4px);
  }
`;

// Styled component: Chart section container
const ChartSection = styled.div`
  margin-bottom: 32px;
  background: #111;
  padding: 20px;
  border-radius: 8px;
`;

/**
 * Dashboard Component
 * Main component for displaying team analytics with interactive visualizations
 * Features:
 * - Load teams from API or CSV upload
 * - Filter by year/season
 * - Select individual teams to view detailed analytics
 * - Compare team stats to division averages via radar chart
 * - Display league-wide percentile rankings
 * - Year-over-year trend analysis (NEW)
 * - Scatter plot for efficiency analysis (NEW)
 * - Team strength/weakness identification (NEW)
 */
export default function Dashboard() {
  // State: All teams data loaded from API or CSV
  const [teams, setTeams] = useState<TeamRow[]>([]);

  // State: Loading indicator while fetching data
  const [loading, setLoading] = useState(false);

  // State: Error message if data loading fails
  const [error, setError] = useState<string | null>(null);

  // State: Name of uploaded CSV file (currently stored but not displayed)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // State: Currently selected team for detailed view (null = no selection)
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  // State: Toggle to show/hide the team grid
  const [showAllTeams, setShowAllTeams] = useState(true);

  // State: Selected year filter ('all' = show all years)
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Sample data for testing when backend is unavailable
  const sampleTeams: TeamRow[] = [
    {
      Team: 'Sample A',
      Division: 'D1',
      Year: '2023',
      OffRtg: 105,
      DefRtg: 102,
      Rebounds: 36,
      'TS%': 58,
      WinShares: 6,
    },
    {
      Team: 'Sample B',
      Division: 'D1',
      Year: '2023',
      OffRtg: 99,
      DefRtg: 110,
      Rebounds: 33,
      'TS%': 52,
      WinShares: 3,
    },
    {
      Team: 'Sample C',
      Division: 'D2',
      Year: '2024',
      OffRtg: 112,
      DefRtg: 100,
      Rebounds: 38,
      'TS%': 60,
      WinShares: 8,
    },
  ];

  /**
   * Effect: Fetch teams data from API on component mount
   * (Removed to avoid showing API errors; rely on CSV upload or sample data)
   */
  // useEffect(() => {
  //   // Removed auto API fetching per user preference
  // }, []);

  /**
   * Handler: Load sample data into the dashboard
   * Useful for testing UI without backend or CSV upload
   */
  const onUseSample = () => {
    // Parse sample data to ensure consistent numeric types
    const parsed = sampleTeams.map(team => ({
      ...team,
      OffRtg: Number(team.OffRtg) || 0,
      DefRtg: Number(team.DefRtg) || 0,
      Rebounds: Number(team.Rebounds) || 0,
      'TS%': Number(team['TS%']) || 0,
      WinShares: Number(team.WinShares) || 0,
    }));
    setTeams(parsed);
    setError(null);
    setLoading(false);
  };

  /**
   * Handler: Parse and load CSV file uploaded by user
   * Normalizes field names and converts strings to numbers where appropriate
   * @param file - File object from file input element
   */
  const handleFile = (file: File | null) => {
    if (!file) return;
    setUploadedFileName(file.name);

    // Use FileReader API to read file contents as text
    const reader = new FileReader();
    reader.onload = e => {
      const text = String(e.target?.result || '');
      try {
        // Parse CSV text into array of objects
        const raw = parseCsvText(text);

        // Normalize field names and convert to numbers
        // Supports multiple common column name variations
        const parsed = raw.map(team => ({
          ...team,
          // Look for Year/Season/year field and convert to string
          Year: String(team['Year'] ?? team['Season'] ?? team['year'] ?? '').trim(),
          // Look for OffRtg variations and convert to number
          OffRtg: Number(team['OffRtg'] ?? team['Off Rating'] ?? team['OffRtg']) || 0,
          DefRtg: Number(team['DefRtg'] ?? team['Def Rating'] ?? team['DefRtg']) || 0,
          Rebounds: Number(team['Rebounds'] ?? team['Reb'] ?? team['Rebounds']) || 0,
          'TS%': Number(team['TS%'] ?? team['TS%']) || 0,
          WinShares: Number(team['WinShares'] ?? team['WinShares']) || 0,
        }));
        setTeams(parsed);
        setError(null);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to parse CSV: ' + (err.message || String(err)));
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    // Start reading the file as text
    reader.readAsText(file);
  };

  // Empty state: Let user upload a file (or use sample) without any API calls
  if (teams.length === 0 && !loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: 40 }}>
        <h2 style={{ color: '#ff6b35', marginBottom: 12 }}>NCAA Basketball Analytics</h2>
        <p style={{ color: '#bbb', marginBottom: 20 }}>
          Upload a CSV or load sample data to explore the dashboard.
        </p>
        <div style={{ marginBottom: 16 }}>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={e => {
              const f = e.target.files?.[0] || null;
              // Note: handleFile sets teams and shows the app; no API calls are made
              handleFile(f);
            }}
          />
        </div>
        <button
          onClick={onUseSample}
          style={{
            background: '#ff6b35',
            color: '#fff',
            padding: '0.8rem 1.5rem',
            borderRadius: 6,
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Use Sample Data
        </button>
      </div>
    );
  }

  // Loading state (rare now, kept for completeness)
  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center' }}>
        Loading analytics…
        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={e => handleFile(e.target.files ? e.target.files[0] : null)}
          />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={onUseSample}
              style={{
                background: '#ff6b35',
                color: '#fff',
                padding: '0.4rem 0.6rem',
                borderRadius: 6,
                border: 'none',
              }}
            >
              Use sample data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state (only shows CSV/file errors now; no API fetch errors anymore)
  if (error) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: 20 }}>
        <div style={{ marginBottom: 8, color: '#ff6b35', fontWeight: 700 }}>Analytics error</div>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            color: '#ddd',
            background: '#111',
            padding: 12,
            borderRadius: 6,
          }}
        >
          {error}
        </pre>
        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={e => handleFile(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={onUseSample}
            style={{
              background: '#ff6b35',
              color: '#fff',
              padding: '0.4rem 0.6rem',
              borderRadius: 6,
              border: 'none',
            }}
          >
            Use sample data
          </button>
        </div>
      </div>
    );
  }

  /**
   * Helper: Calculate average stats for all teams in a division
   * Used for radar chart comparison
   * @param teams - Array of all teams to analyze
   * @param division - Division name to filter by
   * @returns Object with average values for each key metric
   */
  function getDivisionAverages(teams: TeamRow[], division: string) {
    // Filter to only teams in the specified division
    const divisionTeams = teams.filter(t => t.Division === division);

    // Define which metrics to calculate averages for
    const keys = ['OffRtg', 'DefRtg', 'Rebounds', 'TS%', 'WinShares'];
    const avg: Record<string, number> = {};

    // For each metric, calculate the average across all division teams
    keys.forEach(key => {
      const vals = divisionTeams.map(t => Number(t[key]) || 0);
      avg[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    });
    return avg;
  }

  /**
   * Helper: Calculate percentile ranking for a team's metric value
   * Shows what percentage of teams the selected team performs better than
   * @param teams - Array of all teams to compare against
   * @param metricKey - Which stat to calculate percentile for
   * @param value - The team's value for this metric
   * @returns Percentile (0-100) rounded to nearest whole number
   */
  function getPercentile(teams: TeamRow[], metricKey: string, value: number): number {
    // Get all values for this metric and sort them ascending
    const values = teams.map(t => Number(t[metricKey]) || 0).sort((a, b) => a - b);

    // Count how many teams have a lower value
    const count = values.filter(v => v < value).length;

    // Convert to percentage (0-100)
    return Math.round((count / values.length) * 100);
  }

  /**
   * Helper: Get year-over-year trend data for a specific team
   * Tracks how team performance metrics change across seasons
   * @param teamName - Name of the team to analyze
   * @returns Array of data points for trend visualization
   */
  function getTeamTrends(teamName: string) {
    // Filter all entries for this team across all years, sorted by year
    const teamHistory = teams
      .filter(t => t.Team === teamName)
      .sort((a, b) => (a.Year || '').localeCompare(b.Year || ''));

    // Return empty array if no historical data
    if (teamHistory.length === 0) return [];

    // Map to chart-friendly format with all key metrics
    return teamHistory.map(team => ({
      year: team.Year || 'N/A',
      OffRtg: team.OffRtg || 0,
      DefRtg: team.DefRtg || 0,
      NetRtg: (team.OffRtg || 0) - (team.DefRtg || 0), // Net Rating = Off - Def
      WinShares: team.WinShares || 0,
      'TS%': team['TS%'] || 0,
      Rebounds: team.Rebounds || 0,
    }));
  }

  /**
   * Helper: Identify team strengths and weaknesses based on percentiles
   * Categorizes metrics as strengths (>75th), weaknesses (<25th), or neutral
   * @param team - Team object to analyze
   * @returns Object with strengths and weaknesses arrays
   */
  function analyzeTeamProfile(team: TeamRow) {
    const metrics = [
      { key: 'OffRtg', label: 'Offensive Rating' },
      { key: 'DefRtg', label: 'Defensive Rating', inverse: true }, // Lower is better
      { key: 'Rebounds', label: 'Rebounds' },
      { key: 'TS%', label: 'True Shooting %' },
      { key: 'WinShares', label: 'Win Shares' },
    ];

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    metrics.forEach(({ key, label, inverse }) => {
      const percentile = getPercentile(filteredTeams, key, Number(team[key]) || 0);

      // For inverse metrics (like DefRtg), flip the logic
      if (inverse) {
        if (percentile <= 25) strengths.push(label); // Low DefRtg is good
        if (percentile >= 75) weaknesses.push(label); // High DefRtg is bad
      } else {
        if (percentile >= 75) strengths.push(label);
        if (percentile <= 25) weaknesses.push(label);
      }
    });

    return { strengths, weaknesses };
  }

  /**
   * Helper: Calculate Net Rating (Offensive Rating - Defensive Rating)
   * Positive net rating = team scores more than it allows
   * @param team - Team object
   * @returns Net rating value
   */
  function calculateNetRating(team: TeamRow): number {
    return (Number(team.OffRtg) || 0) - (Number(team.DefRtg) || 0);
  }

  // Extract unique years from all teams data, sorted
  // Creates a list of available years for the year filter dropdown
  const availableYears = Array.from(new Set(teams.map(t => t.Year).filter(Boolean))).sort();

  // Filter teams based on selected year
  // If 'all' is selected, show all teams; otherwise filter by year
  const filteredTeams = selectedYear === 'all' ? teams : teams.filter(t => t.Year === selectedYear);

  // Get trend data for selected team (if available)
  const trendData = selectedTeam ? getTeamTrends(selectedTeam.Team) : [];

  // Analyze selected team's strengths and weaknesses
  const teamProfile = selectedTeam ? analyzeTeamProfile(selectedTeam) : null;

  return (
    <div>
      {/* Control Bar: Year selector, team selector, and clear button */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {/* Year/Season Filter Dropdown */}
        <select
          value={selectedYear}
          onChange={e => {
            setSelectedYear(e.target.value);
            // Clear selected team when changing year filter
            setSelectedTeam(null);
          }}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #ff6b35',
            padding: '0.6rem 1.2rem',
            borderRadius: 6,
            marginRight: '1rem',
            minWidth: 140,
          }}
        >
          <option value="all">All Years</option>
          {/* Map over available years to create dropdown options */}
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Team Selector Dropdown */}
        <select
          value={selectedTeam ? selectedTeam.Team : ''}
          onChange={e => {
            // Find the team object matching the selected team name
            const team = filteredTeams.find(t => t.Team === e.target.value);
            setSelectedTeam(team || null);
            // Hide team grid when a specific team is selected
            setShowAllTeams(!team);
          }}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #ff6b35',
            padding: '0.6rem 1.2rem',
            borderRadius: 6,
            marginRight: '1rem',
            minWidth: 180,
          }}
        >
          <option value="">Select a team...</option>
          {/* Map over filtered teams to create dropdown options */}
          {filteredTeams.map((team, idx) => (
            <option key={idx} value={team.Team}>
              {team.Team} {team.Year ? `(${team.Year})` : ''}
            </option>
          ))}
        </select>

        {/* Clear Selection Button - only visible when a team is selected */}
        {selectedTeam && (
          <button
            onClick={() => {
              setSelectedTeam(null);
              setShowAllTeams(true);
            }}
            style={{
              background: '#333',
              color: '#fff',
              border: '1px solid #ff6b35',
              padding: '0.6rem 1.2rem',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Team Grid: Shows all teams as clickable cards when showAllTeams is true */}
      {showAllTeams && (
        <TeamGrid>
          {/* Map over filtered teams to create a card for each */}
          {filteredTeams.map((team, idx) => (
            <TeamCard
              key={idx}
              // Highlight card if this team is currently selected
              selected={selectedTeam?.Team === team.Team && selectedTeam?.Year === team.Year}
              // Set this team as selected when card is clicked
              onClick={() => setSelectedTeam(team)}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{team.Team}</h3>
              {/* Show year if available */}
              {team.Year && (
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.3rem' }}>
                  {team.Year}
                </p>
              )}
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Division: {team.Division || 'N/A'}</p>
              {/* Show Net Rating as a quick performance indicator */}
              <p
                style={{
                  fontSize: '0.9rem',
                  color: calculateNetRating(team) > 0 ? '#82ca9d' : '#ff6b6b',
                }}
              >
                Net Rating: {calculateNetRating(team).toFixed(1)}
              </p>
            </TeamCard>
          ))}
        </TeamGrid>
      )}

      {/* Selected Team Details: Only visible when a team is selected */}
      {selectedTeam && (
        <div style={{ marginTop: '3rem', padding: '2rem', background: '#1a1a1a', borderRadius: 8 }}>
          {/* Header with team name and year */}
          <h2 style={{ color: '#ff6b35', marginBottom: '1.5rem' }}>
            {selectedTeam.Team} {selectedTeam.Year && `(${selectedTeam.Year})`} - Detailed Analytics
          </h2>

          {/* Team Profile Summary: Strengths and Weaknesses */}
          {teamProfile && (
            <ChartSection>
              <h4 style={{ color: '#fff', marginBottom: 16 }}>Team Profile Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Strengths */}
                <div>
                  <h5 style={{ color: '#82ca9d', marginBottom: 8 }}>Strengths (Top 25%)</h5>
                  {teamProfile.strengths.length > 0 ? (
                    <ul style={{ color: '#fff', paddingLeft: 20 }}>
                      {teamProfile.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                      No standout strengths identified
                    </p>
                  )}
                </div>
                {/* Weaknesses */}
                <div>
                  <h5 style={{ color: '#ff6b6b', marginBottom: 8 }}>Weaknesses (Bottom 25%)</h5>
                  {teamProfile.weaknesses.length > 0 ? (
                    <ul style={{ color: '#fff', paddingLeft: 20 }}>
                      {teamProfile.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                      No major weaknesses identified
                    </p>
                  )}
                </div>
              </div>
            </ChartSection>
          )}

          {/* Year-over-Year Trends: Line chart showing performance changes */}
          {trendData.length > 1 && (
            <ChartSection>
              <h4 style={{ color: '#fff', marginBottom: 8 }}>Year-Over-Year Performance Trends</h4>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: 12 }}>
                Track how key metrics evolved across {trendData.length} seasons
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{ background: '#1a1a1a', border: '1px solid #ff6b35' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="OffRtg"
                    stroke="#ff6b35"
                    strokeWidth={2}
                    name="Offensive Rating"
                  />
                  <Line
                    type="monotone"
                    dataKey="DefRtg"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Defensive Rating"
                  />
                  <Line
                    type="monotone"
                    dataKey="NetRtg"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Net Rating"
                  />
                  <Line
                    type="monotone"
                    dataKey="WinShares"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Win Shares"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartSection>
          )}

          {/* Radar Chart Section: Compares team stats to division average */}
          <ChartSection>
            <h4 style={{ color: '#fff', marginBottom: 8 }}>
              Radar Comparison: Team vs Division Avg
            </h4>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart
                // Data array: one object per metric with team value and division average
                data={[
                  {
                    metric: 'OffRtg',
                    Team: selectedTeam.OffRtg,
                    Division: getDivisionAverages(filteredTeams, selectedTeam.Division).OffRtg,
                  },
                  {
                    metric: 'DefRtg',
                    Team: selectedTeam.DefRtg,
                    Division: getDivisionAverages(filteredTeams, selectedTeam.Division).DefRtg,
                  },
                  {
                    metric: 'Rebounds',
                    Team: selectedTeam.Rebounds,
                    Division: getDivisionAverages(filteredTeams, selectedTeam.Division).Rebounds,
                  },
                  {
                    metric: 'TS%',
                    Team: selectedTeam['TS%'],
                    Division: getDivisionAverages(filteredTeams, selectedTeam.Division)['TS%'],
                  },
                  {
                    metric: 'WinShares',
                    Team: selectedTeam.WinShares,
                    Division: getDivisionAverages(filteredTeams, selectedTeam.Division).WinShares,
                  },
                ]}
              >
                {/* Grid lines radiating from center */}
                <PolarGrid />
                {/* Labels around the perimeter showing metric names */}
                <PolarAngleAxis dataKey="metric" />
                {/* Orange area showing team's stats */}
                <Radar
                  name="Team"
                  dataKey="Team"
                  stroke="#ff6b35"
                  fill="#ff6b35"
                  fillOpacity={0.5}
                />
                {/* Green area showing division average stats */}
                <Radar
                  name="Division Avg"
                  dataKey="Division"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
                {/* Legend showing which color = team vs division */}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Efficiency Scatter Plot: OffRtg vs DefRtg comparison across league */}
          <ChartSection>
            <h4 style={{ color: '#fff', marginBottom: 8 }}>League-Wide Efficiency Comparison</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: 12 }}>
              Top-right quadrant = Elite teams (high offense, low defense). Your team is highlighted
              in orange.
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  type="number"
                  dataKey="OffRtg"
                  name="Offensive Rating"
                  stroke="#fff"
                  label={{ value: 'Offensive Rating', position: 'bottom', fill: '#fff' }}
                />
                <YAxis
                  type="number"
                  dataKey="DefRtg"
                  name="Defensive Rating"
                  stroke="#fff"
                  reversed
                  label={{
                    value: 'Defensive Rating (Lower is Better)',
                    angle: -90,
                    position: 'left',
                    fill: '#fff',
                  }}
                />
                <ZAxis range={[50, 50]} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #ff6b35' }}
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any) => value.toFixed(1)}
                />
                {/* All other teams in the league */}
                <Scatter
                  name="League Teams"
                  data={filteredTeams.filter(t => t.Team !== selectedTeam.Team)}
                  fill="#82ca9d"
                  opacity={0.5}
                />
                {/* Selected team highlighted */}
                <Scatter name="Your Team" data={[selectedTeam]} fill="#ff6b35" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Percentiles Section: Shows where team ranks league-wide for each stat */}
          <ChartSection>
            <h4 style={{ color: '#fff', marginBottom: 16 }}>League-Wide Percentiles</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 16,
              }}
            >
              {/* Array of metrics to display percentiles for */}
              {[
                { key: 'OffRtg', label: 'Offensive Rating' },
                { key: 'DefRtg', label: 'Defensive Rating' },
                { key: 'Rebounds', label: 'Rebounds' },
                { key: 'TS%', label: 'True Shooting %' },
                { key: 'WinShares', label: 'Win Shares' },
              ].map(({ key, label }) => {
                // Calculate percentile for this metric
                const percentile = getPercentile(
                  filteredTeams,
                  key,
                  Number(selectedTeam[key]) || 0,
                );
                return (
                  <div
                    key={key}
                    style={{
                      background: '#0a0a0a',
                      padding: 16,
                      borderRadius: 8,
                      textAlign: 'center',
                      border: `2px solid ${
                        percentile >= 75 ? '#82ca9d' : percentile <= 25 ? '#ff6b6b' : '#333'
                      }`,
                    }}
                  >
                    {/* Metric name */}
                    <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: 8 }}>
                      {label}
                    </div>
                    {/* Large percentile number (e.g., "85th") */}
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ff6b35' }}>
                      {percentile}
                      <span style={{ fontSize: '1rem', color: '#fff' }}>th</span>
                    </div>
                    {/* Actual stat value */}
                    <div style={{ fontSize: '0.9rem', color: '#ddd', marginTop: 4 }}>
                      {selectedTeam[key]}
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartSection>
        </div>
      )}
    </div>
  );
}
