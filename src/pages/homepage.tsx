import styled from 'styled-components';
import React, { useState, useEffect, useRef } from 'react';
import jcsuIcon from '../assets/jcsuicon.png';
import PortfolioPage from './portfolio';
import SeniorProjectPage from './seniorProject';
import AboutPage from './about';
import SlideMenu from '../components/SlideMenu';
import '../styles/jcsu.css';

// TargetLink helper: supports targetType = 'self' | 'blank' | 'parent' | 'top'
type TargetType = 'self' | 'blank' | 'parent' | 'top';
const TargetLink: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { targetType?: TargetType }
> = ({ targetType = 'self', children, ...props }) => {
  const map: Record<TargetType, string> = {
    self: '_self',
    blank: '_blank',
    parent: '_parent',
    top: '_top',
  };
  const target = map[targetType];
  const rel = props.rel ?? (target === '_blank' ? 'noreferrer' : undefined);
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} target={target} rel={rel}>
      {children}
    </a>
  );
};
const P1Styled = styled.p`
  margin-bottom: 2.5rem;
  font-size: 1.25rem;
  font-family: 'Arial', sans-serif;
  color: green;
`;

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

const AnimatedImage = styled.img`
  display: block;
  margin: 2rem auto;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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
const MenuButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: 2px solid #000;
  padding: 8px 12px;
  cursor: pointer;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
`;

export const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Set page title and favicon
  useEffect(() => {
    document.title = 'JCSU CS Department';

    // Add or update favicon
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    // link.href = jcsuFavicon; // Uncomment when you have the favicon file
    link.href = jcsuIcon; // Using existing icon as fallback
  }, []);

  // simple hash-based routing to show the portfolio page
  // detect portfolio or senior-project hashes
  const [route, setRoute] = useState<string>(() => {
    if (typeof window === 'undefined') return 'home';
    if (window.location.hash.includes('senior-project')) return 'senior';
    if (window.location.hash.includes('portfolio')) return 'portfolio';
    if (window.location.hash.includes('about')) return 'about';
    return 'home';
  });
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.includes('senior-project')) setRoute('senior');
      else if (window.location.hash.includes('portfolio')) setRoute('portfolio');
      else if (window.location.hash.includes('about')) setRoute('about');
      else setRoute('home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === 'portfolio') return <PortfolioPage />; // portfolio.tsx handles its own Back action
  if (route === 'senior') return <SeniorProjectPage />; // senior project page
  if (route === 'about') return <AboutPage />; // about page

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
      <style>{`
        .internal-jcsu-heading { color: blue; text-align: center; margin: 1rem 0; }
        .internal-jcsu-paragraph { color: blue; text-align: center; max-width: 60ch; margin: 0.5rem auto 2rem; }
      `}</style>

      <HeroSection>
        <MenuButton onClick={() => setMenuOpen(true)} aria-label="Open menu">
          Menu
        </MenuButton>
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
      {/* slide menu for site navigation */}
      <SlideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* quick link to the portfolio page */}
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
                  {/* portfolio link — stopPropagation so clicking it won't flip the card */}
                  <p>
                    <a
                      href="#portfolio"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.stopPropagation();
                        // href will update the hash and the homepage router will show the PortfolioPage
                      }}
                      style={{ color: '#ff6b35', fontWeight: 700 }}
                    >
                      Open Portfolio page
                    </a>
                  </p>
                  {/* senior project link */}
                  <p>
                    <a
                      href="#senior-project"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.stopPropagation();
                        // hash change will route to SeniorProjectPage
                      }}
                      style={{ color: '#ff6b35', fontWeight: 700 }}
                    >
                      Open Senior Project
                    </a>
                  </p>
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
          <H2Styled>Portfolio</H2Styled>
          <ul>
            <li>
              <a href="#portfolio" style={{ color: '#ff6b35', fontWeight: 700 }}>
                Open Portfolio page
              </a>
            </li>
            <li>
              <a href="#senior-project" style={{ color: '#ff6b35', fontWeight: 700 }}>
                Open Senior Project
              </a>
            </li>
            <li>
              <a href="https://github.com/Mook1984" target="_blank" rel="noreferrer">
                Github Link
              </a>
            </li>
          </ul>
        </Wrapper>
      </Section>
      <Section>
        <Wrapper>
          <H2Styled>JCSU</H2Styled>
          <PStyled>
            I am currently a student at Johnson C. Smith University (JCSU), where I am pursuing my
            degree in Computer Science Information Systems. JCSU has provided me with a solid
            foundation in computer science principles and practical skills that I am eager to apply
            in real-world scenarios.
            {/* Relative URL to the Computer Science courses on the JCSU admissions area */}
            <TargetLink
              href="https://www.jcsu.edu/academics/undergraduate-program/computer-scienceinformation-systems"
              targetType="top"
              style={{ marginLeft: 8 }}
            >
              JCSU — Computer Science courses (relative)
            </TargetLink>
            <TargetLink
              href="https://www.jcsu.edu/admissions"
              targetType="blank"
              style={{ marginLeft: 8 }}
            >
              JCSU Admissions
            </TargetLink>
            <TargetLink href="https://www.jcsu.edu" targetType="top" style={{ marginLeft: 8 }}>
              JCSU Home
            </TargetLink>
            <TargetLink
              href="https://www.jcsu.edu/who-we-are/tour"
              targetType="self"
              style={{ marginLeft: 8 }}
            >
              JCSU Home Campus Tour›
            </TargetLink>
          </PStyled>
        </Wrapper>
      </Section>

      <Section id="jcsu-cs-department">
        <Wrapper>
          <H2Styled>
            <a
              href="https://www.jcsu.edu/academics/undergraduate-program/computer-scienceinformation-systems#cs-bookmark"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#ff6b35', textDecoration: 'none' }}
            >
              JOHNSON C SMITH UNIVERSITY - Computer Science Department
            </a>
          </H2Styled>

          <JCSUIcon
            src={jcsuIcon}
            alt="Computer Science"
            width="600"
            height="400"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          <PStyled style={{ marginTop: '2rem' }}>
            Explore the Computer Science department at Johnson C. Smith University and discover the
            innovative programs and opportunities available.
          </PStyled>

          <AnimatedImage
            src={jcsuIcon}
            alt="JCSU Animated"
            width="400"
            height="300"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Wrapper>
      </Section>
      {/* Internal */}
      <Section>
        <Wrapper>
          <H2Styled>Weather</H2Styled>
          <P1Styled>
            Charlotte sits in a humid subtropical climate — warm, humid summers with frequent
            afternoon thunderstorms and mild winters where snow is occasional but not unheard of.
            Average summer highs reach the mid-80s to low-90s (29–34°C) while winter daytime
            temperatures typically hover in the 40s–50s°F (5–15°C). Spring and fall are often the
            most pleasant seasons with comfortable temperatures and lower humidity.
          </P1Styled>
        </Wrapper>
      </Section>
      <Section>
        {/* External */}
        <Wrapper>
          <link rel="stylesheet" href="/styles/jcsu.css" />
          <h1>Weather</h1>
          <p>
            The region can experience heavy rainfall from convective storms and the occasional
            remnants of tropical systems. Pollen counts are commonly high in spring, and urban heat
            island effects can make downtown Charlotte a few degrees warmer than surrounding
            suburbs.
          </p>
        </Wrapper>
      </Section>
    </main>
  );
};
