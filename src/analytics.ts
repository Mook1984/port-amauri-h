import { TeamData } from './types/team';

export function normalizeRow(raw: Record<string, any>): TeamData {
  // coerce common numeric fields, keep original keys for flexibility
  const n = (k: string) =>
    raw[k] !== undefined && raw[k] !== '' ? Number(raw[k]) : undefined;
  return {
    Season: n('Season') || 0,
    Team: String(raw.Team ?? raw.TeamName ?? ''),
    Division: String(raw.Division ?? ''),
    Wins: n('Wins') || 0,
    Losses: n('Losses') || 0,
    PointsPerGame: n('PointsPerGame') || 0,
    OppPointsPerGame: n('OppPointsPerGame') || 0,
    'FG%': n('FG%'),
    '3P%': n('3P%'),
    'FT%': n('FT%'),
    Rebounds: n('Rebounds') || 0,
    Assists: n('Assists') || 0,
    Turnovers: n('Turnovers') || 0,
    Steals: n('Steals'),
    Blocks: n('Blocks'),
    OffRtg: n('OffRtg') || 0,
    DefRtg: n('DefRtg') || 0,
    NetRtg: n('NetRtg') || 0,
    Pace: n('Pace'),
    'TS%': n('TS%'),
    'eFG%': n('eFG%'),
    WinShares: n('WinShares') || 0,
    StrengthOfSchedule: n('StrengthOfSchedule') || 0,
  };
}

export function analyzeTeam(team: TeamData) {
  const needs: string[] = [];
  const strengths: string[] = [];

  if (team.OffRtg < 100) needs.push('Scoring help');
  else strengths.push('Efficient offense');

  if (team.DefRtg > 110) needs.push('Defensive improvement');
  else strengths.push('Solid defense');

  if (team.Rebounds < 35) needs.push('Rebounding depth');
  else strengths.push('Strong on boards');

  if (team.Assists > 0 && team.Turnovers > 0) {
    if (team.Assists / team.Turnovers < 1) needs.push('Playmaking guard');
    else strengths.push('Good ball movement');
  }

  return { needs, strengths };
}

export function divisionAverages(teams: TeamData[]) {
  const byDiv: Record<string, Partial<Record<keyof TeamData, number>>> = {};
  const counts: Record<string, number> = {};
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
  Object.keys(byDiv).forEach(d => {
    const c = counts[d] || 1;
    const agg = byDiv[d];
    (byDiv[d] as any).OffRtg = (agg.OffRtg || 0) / c;
    (byDiv[d] as any).DefRtg = (agg.DefRtg || 0) / c;
    (byDiv[d] as any).Rebounds = (agg.Rebounds || 0) / c;
    (byDiv[d] as any)['TS%'] = (agg['TS%'] || 0) / c;
  });
  return byDiv;
}
