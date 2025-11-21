import React, { useEffect, useState } from 'react';
import TeamCard from './TeamCard';
import TeamCharts from './TeamCharts';
import './analytics.css';

type TeamRow = Record<string, any>;

/**
 * TeamAnalytics - Main dashboard component for NCAA team analytics
 *
 * Features:
 * - Fetches all team data from backend API on mount
 * - Provides division filter to narrow team list
 * - Displays team cards in responsive grid layout
 * - Shows detailed charts for selected team
 * - Handles loading and error states gracefully
 */
export default function TeamAnalytics() {
  // All teams loaded from API
  const [teams, setTeams] = useState<TeamRow[]>([]);

  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);

  // Error message if fetch fails
  const [error, setError] = useState<string | null>(null);

  // Current division filter selection ('All' shows all divisions)
  const [filterDivision, setFilterDivision] = useState<string>('All');

  // Currently selected team for detailed chart view
  const [selected, setSelected] = useState<TeamRow | null>(null);

  /**
   * Fetch all team data from backend on component mount
   * Uses relative URL /api/teams which is proxied to localhost:5000 in development
   */
  useEffect(() => {
    console.log('Fetching /api/teams...');
    fetch('/api/teams')
      .then(async r => {
        console.log(`Response status: ${r.status}`);
        if (!r.ok) {
          // Extract error message from response body if available
          const text = await r.text().catch(() => '');
          throw new Error(`HTTP ${r.status} ${r.statusText}${text ? ' - ' + text : ''}`);
        }
        return r.json();
      })
      .then((data: TeamRow[]) => {
        console.log(`✓ Loaded ${data.length} teams`);
        setTeams(data);
        setLoading(false);
      })
      .catch(e => {
        console.error('Fetch error:', e);
        setError(String(e));
        setLoading(false);
      });
  }, []);

  // Extract unique division names for filter dropdown
  // filter(Boolean) removes any undefined/null/empty values
  const divisions = Array.from(new Set(teams.map(t => t.Division))).filter(Boolean);

  // Apply division filter to team list
  // If 'All' is selected, show all teams; otherwise filter by selected division
  const list = teams.filter(t => (filterDivision === 'All' ? true : t.Division === filterDivision));

  return (
    <main style={{ padding: 20 }}>
      <h2 style={{ color: '#ff6b35' }}>NCAA Team Analytics</h2>

      {/* Division filter dropdown */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Division:</label>
        <select value={filterDivision} onChange={e => setFilterDivision(e.target.value)}>
          <option value="All">All</option>
          {divisions.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Team grid - displays cards for all teams matching current filter */}
      <div className="analytics-container">
        {loading && <div style={{ color: '#fff' }}>Loading…</div>}
        {error && <div style={{ color: 'tomato' }}>{error}</div>}
        {!loading &&
          list.map(t => (
            // Click handler sets selected team for detailed chart view
            <div key={`${t.Team}-${t.Season}`} onClick={() => setSelected(t)}>
              <TeamCard team={t} />
            </div>
          ))}
      </div>

      {/* Chart section - shows detailed analysis for selected team */}
      <div style={{ marginTop: 20 }}>
        {selected ? (
          // Pass selected team and full team list for comparative analysis
          <TeamCharts team={selected} teams={teams} />
        ) : (
          <div style={{ color: '#ccc' }}>Select a team to view charts</div>
        )}
      </div>
    </main>
  );
}
