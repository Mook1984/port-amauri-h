import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  padding: 2rem;
`;

const Header = styled.header`
  max-width: 1200px;
  margin: 0 auto 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #ff6b35;
  margin-bottom: 1rem;
`;

const BackLink = styled.a`
  color: #ff6b35;
  text-decoration: none;
  font-size: 1.2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #ccc;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #ff6b35;
  }
`;

const DataGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
    border-color: #ff6b35;
  }
`;

const TeamName = styled.h3`
  color: #ff6b35;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Division = styled.div`
  color: #aaa;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const StatsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: #ccc;
`;

const StatValue = styled.span`
  color: #fff;
  font-weight: bold;
`;

// Mock data for teams
const mockTeams = [
  { id: 1, name: 'Team 1', division: 'D1', wins: 15, losses: 3, points: 1450 },
  { id: 2, name: 'Team 2', division: 'D1', wins: 12, losses: 6, points: 1320 },
  { id: 3, name: 'Team 3', division: 'D2', wins: 14, losses: 4, points: 1380 },
  { id: 4, name: 'Team 4', division: 'D2', wins: 10, losses: 8, points: 1200 },
  { id: 5, name: 'Team 5', division: 'D3', wins: 11, losses: 7, points: 1250 },
  { id: 6, name: 'Team 6', division: 'D3', wins: 9, losses: 9, points: 1150 },
  { id: 7, name: 'Team 7', division: 'D1', wins: 13, losses: 5, points: 1350 },
  { id: 8, name: 'Team 8', division: 'D2', wins: 8, losses: 10, points: 1100 },
];

export default function AnalyticsPage() {
  const [divisionFilter, setDivisionFilter] = useState<string>('all');

  const filteredTeams = mockTeams.filter(team => {
    if (divisionFilter === 'all') return true;
    return team.division === divisionFilter;
  });

  return (
    <PageContainer>
      <Header>
        <Title>Teams Analytics</Title>
        <BackLink href="/">← Back to Home</BackLink>
      </Header>

      <FiltersSection>
        <FilterGroup>
          <Label htmlFor="division-filter">Filter by Division:</Label>
          <Select
            id="division-filter"
            value={divisionFilter}
            onChange={e => setDivisionFilter(e.target.value)}
          >
            <option value="all">All Divisions</option>
            <option value="D1">D1</option>
            <option value="D2">D2</option>
            <option value="D3">D3</option>
          </Select>
        </FilterGroup>
      </FiltersSection>

      <DataGrid>
        {filteredTeams.map(team => (
          <Card key={team.id}>
            <TeamName>{team.name}</TeamName>
            <Division>{team.division}</Division>
            <StatsList>
              <StatItem>
                <StatLabel>Wins:</StatLabel>
                <StatValue>{team.wins}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Losses:</StatLabel>
                <StatValue>{team.losses}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Win Rate:</StatLabel>
                <StatValue>{((team.wins / (team.wins + team.losses)) * 100).toFixed(1)}%</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Points:</StatLabel>
                <StatValue>{team.points}</StatValue>
              </StatItem>
            </StatsList>
          </Card>
        ))}
      </DataGrid>
    </PageContainer>
  );
}
