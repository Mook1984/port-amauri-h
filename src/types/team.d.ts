export interface TeamData {
  Season: number;
  Team: string;
  Division: string;
  Wins: number;
  Losses: number;
  PointsPerGame: number;
  OppPointsPerGame: number;
  "FG%"?: number;
  "3P%"?: number;
  "FT%"?: number;
  Rebounds: number;
  Assists: number;
  Turnovers: number;
  Steals?: number;
  Blocks?: number;
  OffRtg: number;
  DefRtg: number;
  NetRtg: number;
  Pace?: number;
  "TS%"?: number;
  "eFG%"?: number;
  WinShares?: number;
  StrengthOfSchedule?: number;
}
