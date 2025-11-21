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
  font-size: 8rem;
`;
const HeroSection = styled(Section)`
  padding-block: 5rem;
  height: 100vh;
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

export const AboutPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main>
      <HeroSection>
        <MenuButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
          Menu
        </MenuButton>
        <Wrapper>
          <HeroTitle>About</HeroTitle>
          <p style={{ maxWidth: 800, margin: '1rem auto', fontSize: 18 }}>
            Brief bio and details about you. Edit this content to describe your background,
            interests, education, and anything else you'd like to share.
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
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Back to Home
            </button>
          </div>
        </Wrapper>
      </HeroSection>
      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
};

export default AboutPage;
