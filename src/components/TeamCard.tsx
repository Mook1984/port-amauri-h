import React from 'react';

type Props = { team: Record<string, any> };

/**
 * TeamCard - Displays summary statistics for a single team
 *
 * Shows:
 * - Team name (prominent display)
 * - Division and season year
 * - Key metrics: OffRtg, DefRtg, Rebounds, WinShares
 *
 * Card is clickable - parent component handles selection for detailed view
 */
export default function TeamCard({ team }: Props) {
  return (
    <div className="team-card" role="button" tabIndex={0}>
      {/* Team name - primary identifier */}
      <div style={{ fontWeight: 700, color: '#ff6b35' }}>{team.Team}</div>

      {/* Secondary info: division and season */}
      <div style={{ color: '#666' }}>
        {team.Division} — {team.Season}
      </div>

      {/* Key statistics - rounded for readability */}
      <div style={{ marginTop: 8 }}>
        <div>OffRtg: {Math.round(team.OffRtg)}</div>
        <div>DefRtg: {Math.round(team.DefRtg)}</div>
        <div>Reb: {Math.round(team.Rebounds)}</div>
        <div>WinShares: {Math.round(team.WinShares || 0)}</div>
      </div>
    </div>
  );
}
