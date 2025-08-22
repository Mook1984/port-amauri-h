import styled from 'styled-components';
const Section = styled.section`
  padding-block: 2rem;
  background-color: #f8f9fa;
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
const ChevronDown = styled.i`
  font-size: 4rem;
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
export const Homepage = () => {
  return (
    <main>
      <HeroSection>
        <Wrapper>
          <HeroTitle>Amauri Hampton</HeroTitle>
        </Wrapper>

        <ChevronHolder>
          <a href="#about">
            <ChevronDown className="si-chevron-down" />
          </a>
        </ChevronHolder>
      </HeroSection>
      <Section id="about">
        <Wrapper>
          <h2>About Me</h2>
          <p> Hello everyone I go to JSCU! </p>
        </Wrapper>
      </Section>
      <Section>
        <Wrapper>
          <h2>Portfoilio</h2>
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
          <h2>Contacts</h2>
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
