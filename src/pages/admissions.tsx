import styled from 'styled-components';
import React, { useState } from 'react';
import SlideMenu from '../components/SlideMenu';

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

export const AdmissionsPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <HeroSection>
        <MenuButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
          Menu
        </MenuButton>
        <Wrapper>
          <HeroTitle>Admissions — Computer Science</HeroTitle>

          <p style={{ maxWidth: 900, margin: '1rem auto', fontSize: 18 }}>
            This page lists the Computer Science courses and program information (relative URL).
          </p>

          <section
            style={{
              marginTop: 24,
              textAlign: 'left',
              maxWidth: 900,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <h3 style={{ color: '#ff6b35' }}>Computer Science Courses (example)</h3>
            <ul>
              <li>CS 101 — Introduction to Computer Science</li>
              <li>CS 201 — Data Structures</li>
              <li>CS 310 — Databases and SQL</li>
              <li>CS 350 — Software Engineering</li>
              <li>CS 420 — Algorithms</li>
            </ul>
            <p>
              Replace these example course entries with the actual course list you want to show.
              Since this page lives at a relative URL, links from the homepage such as{' '}
              <code>/admissions/computer-science</code> will land here.
            </p>

            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => {
                  // navigate back to site root — performs a full navigation to ensure Homepage loads
                  window.location.href = '/';
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

      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
};

export default AdmissionsPage;
