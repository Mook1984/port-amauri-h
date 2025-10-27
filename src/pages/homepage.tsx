import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import jcsuIcon from '../assets/jcsuicon.png';

const Section = styled.section`
  padding-block: 2rem;
  background-color: black;
`;
const PStyled = styled.p`
  margin-bottom: 2.5rem;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  color: white;
`;
const Wrapper = styled.div`
  max-width: 75rem;
  text-align: center;
  margin: 0 auto;
`;
const H2Styled = styled.h2`
  font-style: italic;
  text-align: center;
  color: #ff6b35;
  font-size: 4rem;
  margin-bottom: 3rem;
`;

const H3Styled = styled.h3`
  font-family: 'Arial', sans-serif;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  color: lightgray;
`;
const H4Styled = styled.h4`
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 2.5rem;
`;
const H5Styled = styled.h5`
  font-style: italic;
  margin-bottom: 2.5rem;
`;
const H6Styled = styled.h6`
  font-weight: 700;
  margin-bottom: 2.5rem;
`;
const JCSUIcon = styled.img`
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: auto;
  max-width: 1200px;
`;
const CardContainer = styled.div`
  height: 16rem;
  cursor: pointer;
  perspective: 1000px;
`;
const CardInner = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${props => (props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;
const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CardFront = styled(CardFace)`
  background-color: #ff6b35;
`;
const CardBack = styled(CardFace)`
  background-color: #333333;
  transform: rotateY(180deg);
  align-items: flex-start;
  justify-content: center;
`;
const HeroTitle = styled.h1`
  text-align: center;
  font-size: 8rem;
  margin: 0;
`;
const HeroSection = styled(Section)`
  padding-block: 5rem;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* fallback color */
  background-color: #ff6b35;
  /* actual gradient */
  background: linear-gradient(180deg, #ff6b35 0%, black 100%);
  color: #ffffff; /* ensures text inside is readable */
  position: relative;
`;
const ChevronDown = styled.i`
  font-size: 4rem;
  color: #ffffff;
  animation: bounce 2s infinite;
`;
const ChevronHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;
const skills = [
  { name: 'JavaScript', level: 'Proficient' },
  { name: 'Python', level: 'Proficient' },
  { name: 'Java', level: 'Proficient' },
  { name: 'C++', level: 'Proficient' },
  { name: 'HTML', level: 'Familiar' },
  { name: 'CSS', level: 'Familiar' },
  { name: 'SQL', level: 'Familiar' },
  { name: 'Ruby', level: 'Familiar' },
];
const achievements = [
  'Dean’s List for Academic Excellence - Fall 2022',
  'Completed Full-Stack Web Development Bootcamp - Summer 2023',
  'Certified Java Programmer - Oracle, 2023',
];
export const Homepage = () => {
  const [flipped, setFlipped] = useState<{ [k: string]: boolean }>({
    edu: false,
    work: false,
    projects: false,
  });
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  // refs for each skill list item so the observer can watch them
  const skillRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const index =
            entry.target instanceof HTMLElement ? entry.target.dataset.index : undefined;
          if (index !== undefined) {
            setVisible(prev => ({
              ...prev,
              [index]: entry.isIntersecting,
            }));
          }
        });
      },
      { threshold: 0.5, rootMargin: '-100px 0px' },
    );

    skillRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const flipCard = (card: string) => {
    setFlipped(prev => ({ ...prev, [card]: !prev[card] }));
  };
  return (
    <main>
      <HeroSection>
        <Wrapper>
          <HeroTitle>Amauri Hampton</HeroTitle>
          <H3Styled>Computer Science Information Systems</H3Styled>
        </Wrapper>

        <ChevronHolder>
          <a href="#about">
            <ChevronDown className="si-chevron-down" />
          </a>
        </ChevronHolder>
      </HeroSection>
      <Section id="about">
        <Wrapper>
          <H2Styled>About Me</H2Styled>
          <CardGrid>
            <CardContainer onClick={() => flipCard('edu')}>
              <CardInner flipped={!!flipped.edu}>
                <CardFront>
                  <h3>Education</h3>
                  <p>B.S. Computer Science / Information Systems</p>
                </CardFront>
                <CardBack>
                  <h4>Highlights</h4>
                  <ul>
                    {achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </CardBack>
              </CardInner>
            </CardContainer>
            <CardContainer onClick={() => flipCard('work')}>
              <CardInner flipped={!!flipped.work}>
                <CardFront>
                  <h3>Work</h3>
                  <p>Internships &amp; Projects</p>
                </CardFront>
                <CardBack>
                  <h4>Details</h4>
                  <p>Experience building web apps and collaborating on teams.</p>
                </CardBack>
              </CardInner>
            </CardContainer>
            <CardContainer onClick={() => flipCard('projects')}>
              <CardInner flipped={!!flipped.projects}>
                <CardFront>
                  <h3>Projects</h3>
                  <p>Full-stack and data projects</p>
                </CardFront>
                <CardBack>
                  <h4>Examples</h4>
                  <p>Links available in the Portfolio section below.</p>
                </CardBack>
              </CardInner>
            </CardContainer>
          </CardGrid>
          <H2Styled>Skills</H2Styled>
          <PStyled>
            I am proficient in several programming languages, including JavaScript, Python, Java,
            and C++.
          </PStyled>
          <H3Styled>Programming Languages:</H3Styled>
          <ul>
            {skills.map((s, i) => (
              <li
                key={s.name}
                ref={el => (skillRefs.current[i] = el)}
                data-index={String(i)}
                style={{
                  opacity: visible[i] ? 1 : 0.25,
                  transition: 'opacity 300ms ease',
                }}
              >
                {s.name} — {s.level}
              </li>
            ))}
          </ul>
        </Wrapper>
      </Section>
      <Section>
        <Wrapper>
          <H2Styled>Portfoilio</H2Styled>
          <ul>
            <li>
              <a href="https://www.thrivent.com" target="_blank">
                Thrivent.com
              </a>
            </li>
            <li>
              <a href="https://github.com/Mook1984" target="_blank">
                Github Link
              </a>
            </li>
          </ul>
        </Wrapper>
      </Section>
      <Section>
        <Wrapper>
          <H2Styled>Contacts</H2Styled>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/amauri-hampton-b476161ab/" target="_blank">
                LinkedIn Profile
              </a>
            </li>
          </ul>
        </Wrapper>
      </Section>
    </main>
  );
};
