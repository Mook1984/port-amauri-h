import React, { useEffect, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
} from 'recharts';

/**
 * TeamCharts - Comprehensive visualization suite for team analysis
 *
 * Displays 4 chart types:
 * 1. Radar Chart - Compare team stats vs division average
 * 2. Bar Chart - Top 10 teams by WinShares
 * 3. Line Chart - Year-over-year trends for selected team
 * 4. Scatter Plot - Pace vs NetRtg for all teams
 *
 * @param team - Currently selected team object
 * @param teams - Full array of all teams for comparative analysis
 */
export default function TeamCharts({ team, teams }: { team: any; teams: any[] }) {
  // Historical data for selected team (all seasons)
  // Fetched from /api/team/:name endpoint
  const [history, setHistory] = useState<any[]>([]);

  /**
   * Fetch historical data for the selected team
   * Triggers whenever team selection changes
   * Used to populate the year-over-year trend line chart
   */
  useEffect(() => {
    fetch(`/api/team/${encodeURIComponent(team.Team)}`)
      .then(r => r.json())
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [team]);

  /**
   * Calculate division averages for radar chart baseline
   * Filters all teams to current division, then computes mean for each metric
   */
  const division = team.Division;
  const divTeams = teams.filter((t: any) => t.Division === division);
  const avg = {
    OffRtg:
      divTeams.reduce((s: number, t: any) => s + (Number(t.OffRtg) || 0), 0) /
      (divTeams.length || 1),
    DefRtg:
      divTeams.reduce((s: number, t: any) => s + (Number(t.DefRtg) || 0), 0) /
      (divTeams.length || 1),
    Rebounds:
      divTeams.reduce((s: number, t: any) => s + (Number(t.Rebounds) || 0), 0) /
      (divTeams.length || 1),
    'TS%':
      divTeams.reduce((s: number, t: any) => s + (Number(t['TS%']) || 0), 0) /
      (divTeams.length || 1),
    Turnovers:
      divTeams.reduce((s: number, t: any) => s + (Number(t.Turnovers) || 0), 0) /
      (divTeams.length || 1),
  };

  /**
   * Radar Chart Data
   * Compares selected team's stats vs division average across 5 key metrics
   * Two series: team (green) and division avg (blue)
   */
  const radarData = [
    { metric: 'OffRtg', team: Number(team.OffRtg), avg: avg.OffRtg },
    { metric: 'DefRtg', team: Number(team.DefRtg), avg: avg.DefRtg },
    { metric: 'Rebounds', team: Number(team.Rebounds), avg: avg.Rebounds },
    { metric: 'TS%', team: Number(team['TS%']) || 0, avg: Number(avg['TS%']) || 0 },
    { metric: 'Turnovers', team: Number(team.Turnovers) || 0, avg: Number(avg.Turnovers) || 0 },
  ];

  /**
   * Bar Chart Data
   * Shows top 10 teams by WinShares across all seasons and divisions
   * Useful for identifying league-wide performance leaders
   */
  const topWinShares = [...teams]
    .sort((a, b) => (b.WinShares || 0) - (a.WinShares || 0))
    .slice(0, 10);

  /**
   * Scatter Plot Data
   * Maps all teams on Pace (x-axis) vs NetRtg (y-axis)
   * Reveals correlation between tempo and efficiency
   */
  const scatterData = teams.map(t => ({ Pace: t.Pace || 0, NetRtg: t.NetRtg || 0, Team: t.Team }));

  /**
   * Line Chart Data
   * Shows year-over-year progression for selected team
   * Three metrics: OffRtg, DefRtg, NetRtg
   * Sorted chronologically by season
   */
  const lineData = history
    .sort((a, b) => a.Season - b.Season)
    .map(h => ({ season: h.Season, OffRtg: h.OffRtg, DefRtg: h.DefRtg, NetRtg: h.NetRtg }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
        gap: 16,
      }}
    >
      {/* Chart 1: Radar - Team vs Division Average */}
      <div style={{ background: '#111', padding: 12, borderRadius: 8 }}>
        <h4 style={{ color: '#ff6b35' }}>Radar: vs division avg</h4>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              {/* Green fill = selected team */}
              <Radar name="Team" dataKey="team" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.5} />
              {/* Blue fill = division average */}
              <Radar
                name="DivisionAvg"
                dataKey="avg"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Bar - Top 10 WinShares */}
      <div style={{ background: '#111', padding: 12, borderRadius: 8 }}>
        <h4 style={{ color: '#ff6b35' }}>Top WinShares</h4>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={topWinShares}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="Team" tick={{ fill: '#ddd' }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="WinShares" fill="#ff6b35" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Line - Year-over-Year Trends */}
      <div style={{ background: '#111', padding: 12, borderRadius: 8 }}>
        <h4 style={{ color: '#ff6b35' }}>Trend (2022–2024)</h4>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="season" tick={{ fill: '#ddd' }} />
              <YAxis />
              <Tooltip />
              {/* Three lines: OffRtg (green), DefRtg (blue), NetRtg (orange) */}
              <Line type="monotone" dataKey="OffRtg" stroke="#82ca9d" />
              <Line type="monotone" dataKey="DefRtg" stroke="#8884d8" />
              <Line type="monotone" dataKey="NetRtg" stroke="#ff6b35" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Scatter - Pace vs NetRtg */}
      <div style={{ background: '#111', padding: 12, borderRadius: 8 }}>
        <h4 style={{ color: '#ff6b35' }}>Pace vs NetRtg</h4>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="Pace" name="Pace" />
              <YAxis dataKey="NetRtg" name="NetRtg" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {/* Green dots = individual teams */}
              <Scatter data={scatterData} fill="#82ca9d" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
