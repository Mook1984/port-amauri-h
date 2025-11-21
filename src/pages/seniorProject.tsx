import styled from 'styled-components';
import React, { useState } from 'react';
import SlideMenu from '../components/SlideMenu';
import Dashboard from '../components/Dashboard';

const Section = styled.section`
  padding-block: 2rem;
  background-color: #f1e6cf;
`;
const Wrapper = styled.div`
  max-width: 75rem;
  margin: 0 auto;
`;
const HeroTitle = styled.h1`
  text-align: center;
  font-size: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* fallback color */
  background-color: #ff6b35;
  /* actual gradient */
  background: linear-gradient(180deg, #ff6b35 0%, black 100%);
  color: #ffffff; /* ensures text inside is readable */
  margin-top: 0;
`;

const HeroSection = styled(Section)`
  padding-block: 5rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  position: relative;
`;
const MenuButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: 2px solid #000;
  padding: 8px 12px;
  cursor: pointer;
`;

export const SeniorProjectPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <HeroSection>
        <MenuButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
          Menu
        </MenuButton>
        <Wrapper>
          <HeroTitle>Senior Project</HeroTitle>
          <p style={{ maxWidth: 900, margin: '1rem auto', fontSize: 18 }}>
            NCAA Basketball Team Analytics Dashboard — A comprehensive data visualization platform
            analyzing team performance metrics across divisions and seasons (2022-2024).
          </p>

          <section style={{ marginTop: 24, textAlign: 'center' }}>
            <h3 style={{ color: '#ff6b35' }}>Project details</h3>
            <p style={{ maxWidth: 800, margin: '0.5rem auto' }}>
              - Technology stack: React, TypeScript, Node.js, Express, Recharts, CSV Parser <br />-
              Features: Radar charts, trend analysis, comparative metrics, division benchmarking{' '}
              <br />- Data: 90+ NCAA teams across 3 seasons with 20+ performance metrics
            </p>

            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => {
                  window.location.hash = '';
                }}
                style={{
                  background: '#ff6b35',
                  color: '#fff',
                  border: 'none',
                  padding: '0.6rem 1rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Back to Home
              </button>
            </div>
          </section>
        </Wrapper>
      </HeroSection>

      {/* NCAA Team Analytics Dashboard */}
      <Section style={{ backgroundColor: '#000', paddingBlock: '3rem' }}>
        <Wrapper>
          <h2
            style={{
              color: '#ff6b35',
              textAlign: 'center',
              fontSize: '3rem',
              marginBottom: '2rem',
            }}
          >
            Team Analytics Dashboard
          </h2>
          <p style={{ color: '#ddd', textAlign: 'center', maxWidth: 900, margin: '0 auto 2rem' }}>
            Interactive visualizations comparing team performance across divisions. Select any team
            card to view detailed charts including radar comparisons, year-over-year trends, and
            league-wide rankings.
          </p>
          <Dashboard />
        </Wrapper>
      </Section>

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
};

export default SeniorProjectPage;
