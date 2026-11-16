
"use client";

import InstallAppButton from "@/components/InstallAppButton";
import Link from "next/link";
import styled from "styled-components";

const features = [
  {
    icon: "✓",
    title: "Tasks & Daily Planning",
    description:
      "Organise daily responsibilities, set priorities, track deadlines and build realistic schedules.",
  },
  {
    icon: "▦",
    title: "Projects & Business",
    description:
      "Manage client work, business activities, projects, milestones and important deliverables.",
  },
  {
    icon: "◎",
    title: "Goals & Habits",
    description:
      "Turn big ambitions into manageable steps and build routines that move you forward.",
  },
  {
    icon: "▤",
    title: "Calendar & Reminders",
    description:
      "Keep appointments, events, deadlines and recurring activities in one organised place.",
  },
  {
    icon: "₦",
    title: "Finance Management",
    description:
      "Keep track of income, expenses, bills and your personal financial responsibilities.",
  },
  {
    icon: "✎",
    title: "Notes & Ideas",
    description:
      "Capture thoughts, plans, important information and ideas before you forget them.",
  },
];

const categories = [
  "Business",
  "Career",
  "Family",
  "Personal goals",
  "Finances",
  "Learning",
  "Health & wellbeing",
  "Projects",
  "Content creation",
  "Daily responsibilities",
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Set up your personal LIFEOS workspace in just a few steps.",
  },
  {
    number: "02",
    title: "Bring your life together",
    description:
      "Add your tasks, projects, goals, routines, events and responsibilities.",
  },
  {
    number: "03",
    title: "Take control every day",
    description:
      "Plan your time, follow your progress and make better decisions.",
  },
];

export default function LandingPage() {
  return (
    <Page>
      <Nav>
        <Brand href="/">
          <BrandIcon>✳</BrandIcon>
          <span>LIFEOS</span>
        </Brand>

        <NavLinks>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </NavLinks>

        <NavActions>
          <LoginLink href="/login">Log in</LoginLink>
          <NavButton href="/register">Get started <span>↗</span></NavButton>
        </NavActions>
      </Nav>

      <Hero>
        <HeroContent>
          <Eyebrow>
            <EyebrowDot />
            YOUR LIFE. ONE ORGANised SYSTEM.
          </Eyebrow>

          <HeroTitle>
            Everything in your life.
            <GradientText> Finally, in one place.</GradientText>
          </HeroTitle>

          <HeroDescription>
            LIFEOS brings your tasks, business, projects, family,
            finances, goals and everyday responsibilities together
            in one simple system.
          </HeroDescription>

          <HeroActions>
            <PrimaryButton href="/register">
              Get started for free <span>→</span>
            </PrimaryButton>
            <SecondaryButton href="#features">
              Explore LIFEOS
            </SecondaryButton>

            <InstallAppButton/>
          </HeroActions>

          <TrustLine>
            <TrustIcon>✓</TrustIcon>
            One workspace. Every area of your life.
          </TrustLine>
        </HeroContent>

        <PhoneArea>
          <Glow />
          <Phone>
            <PhoneTop>
              <PhoneTime>9:41</PhoneTime>
              <PhoneStatus>● ● ●</PhoneStatus>
            </PhoneTop>

            <PhoneHeader>
              <div>
                <SmallGreeting>MONDAY, NOVEMBER 16</SmallGreeting>
                <PhoneHeading>Good morning 👋</PhoneHeading>
                <PhoneSubheading>Let's make today count.</PhoneSubheading>
              </div>
              <Avatar>Y</Avatar>
            </PhoneHeader>

            <FocusCard>
              <FocusTop>
                <span>YOUR DAILY OVERVIEW</span>
                <span className="live">● TODAY</span>
              </FocusTop>
              <FocusNumber>68%</FocusNumber>
              <FocusLabel>Daily progress</FocusLabel>
              <ProgressTrack>
                <ProgressFill />
              </ProgressTrack>
              <FocusBottom>
                <span>5 of 8 tasks completed</span>
                <span>Keep going!</span>
              </FocusBottom>
            </FocusCard>

            <PhoneSectionHeading>
              <span>Today's priorities</span>
              <span className="view">View all →</span>
            </PhoneSectionHeading>

            <TaskRow>
              <TaskCheck>✓</TaskCheck>
              <div>
                <TaskTitle>Review project proposal</TaskTitle>
                <TaskMeta>Work · 9:00 AM</TaskMeta>
              </div>
              <TaskTag>Done</TaskTag>
            </TaskRow>

            <TaskRow>
              <TaskCheck className="empty" />
              <div>
                <TaskTitle>Complete client website</TaskTitle>
                <TaskMeta>Business · 11:00 AM</TaskMeta>
              </div>
              <TaskTag className="priority">High</TaskTag>
            </TaskRow>

            <TaskRow>
              <TaskCheck className="empty" />
              <div>
                <TaskTitle>Plan weekly goals</TaskTitle>
                <TaskMeta>Personal · 2:00 PM</TaskMeta>
              </div>
              <TaskTag className="normal">Normal</TaskTag>
            </TaskRow>

            <PhoneSectionHeading>
              <span>Your life at a glance</span>
              <span className="view">Overview</span>
            </PhoneSectionHeading>

            <MiniGrid>
              <MiniCard>
                <MiniIcon $color="#e9e7ff">▦</MiniIcon>
                <MiniValue>04</MiniValue>
                <MiniLabel>Projects</MiniLabel>
              </MiniCard>
              <MiniCard>
                <MiniIcon $color="#e1f7ee">◎</MiniIcon>
                <MiniValue>07</MiniValue>
                <MiniLabel>Active goals</MiniLabel>
              </MiniCard>
              <MiniCard>
                <MiniIcon $color="#fff0dc">◷</MiniIcon>
                <MiniValue>12</MiniValue>
                <MiniLabel>Upcoming</MiniLabel>
              </MiniCard>
              <MiniCard>
                <MiniIcon $color="#e4f1ff">↗</MiniIcon>
                <MiniValue>82%</MiniValue>
                <MiniLabel>Weekly focus</MiniLabel>
              </MiniCard>
            </MiniGrid>

            <PhoneNav>
              <PhoneNavItem $active>
                <span>⌂</span>
                Home
              </PhoneNavItem>
              <PhoneNavItem>
                <span>▤</span>
                Tasks
              </PhoneNavItem>
              <PhoneNavItem>
                <span>▦</span>
                Calendar
              </PhoneNavItem>
              <PhoneNavItem>
                <span>☰</span>
                More
              </PhoneNavItem>
            </PhoneNav>
          </Phone>

          <FloatingCard $top="15%" $left="-14%">
            <FloatingIcon>✓</FloatingIcon>
            <div>
              <strong>Stay organised</strong>
              <small>Everything in one place</small>
            </div>
          </FloatingCard>

          <FloatingCard $bottom="16%" $right="-12%">
            <FloatingIcon $purple>↗</FloatingIcon>
            <div>
              <strong>Keep making progress</strong>
              <small>Your goals, always in view</small>
            </div>
          </FloatingCard>
        </PhoneArea>
      </Hero>

      <Stats>
        <Stat>
          <strong>ONE</strong>
          <span>Central workspace</span>
        </Stat>
        <Stat>
          <strong>ALL</strong>
          <span>Areas of your life</span>
        </Stat>
        <Stat>
          <strong>EVERY</strong>
          <span>Day, better organised</span>
        </Stat>
      </Stats>

      <FeaturesSection id="features">
        <SectionIntro>
          <SectionLabel>WHAT YOU CAN DO</SectionLabel>
          <SectionTitle>
            Your entire life,
            <GradientText> working together.</GradientText>
          </SectionTitle>
          <SectionDescription>
            Stop jumping between different apps and scattered notes.
            LIFEOS gives every important part of your life a place.
          </SectionDescription>
        </SectionIntro>

        <FeatureGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.title}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <FeatureArrow>↗</FeatureArrow>
            </FeatureCard>
          ))}
        </FeatureGrid>
        <br/>
        
         <InstallAppButton/>
      </FeaturesSection>

      <LifeSection id="about">
        <LifeContent>
          <SectionLabel>MORE THAN A TO-DO LIST</SectionLabel>
          <SectionTitle>
            One system for
            <GradientText> your whole life.</GradientText>
          </SectionTitle>
          <SectionDescription>
            Your life is made up of many responsibilities. LIFEOS
            helps you organise them without losing sight of what
            matters most.
          </SectionDescription>

          <CategoryGrid>
            {categories.map((category) => (
              <Category key={category}>
                <span>✓</span>
                {category}
              </Category>
            ))}
          </CategoryGrid>
        </LifeContent>

        <LifeVisual>
          <LifeVisualCard>
            <LifeVisualHeader>
              <div>
                <small>YOUR LIFE WORKSPACE</small>
                <h3>Everything connected.</h3>
              </div>
              <span>✳</span>
            </LifeVisualHeader>

            <LifeVisualItem>
              <div className="circle purple">▦</div>
              <div>
                <strong>Work & Business</strong>
                <small>Projects, clients and tasks</small>
              </div>
              <b>→</b>
            </LifeVisualItem>
            <LifeVisualItem>
              <div className="circle green">◎</div>
              <div>
                <strong>Personal Growth</strong>
                <small>Goals, habits and routines</small>
              </div>
              <b>→</b>
            </LifeVisualItem>
            <LifeVisualItem>
              <div className="circle orange">⌂</div>
              <div>
                <strong>Home & Family</strong>
                <small>Events and responsibilities</small>
              </div>
              <b>→</b>
            </LifeVisualItem>
            <LifeVisualItem>
              <div className="circle blue">₦</div>
              <div>
                <strong>Money & Finance</strong>
                <small>Bills, income and expenses</small>
              </div>
              <b>→</b>
            </LifeVisualItem>
            <LifeVisualItem>
              <div className="circle pink">✎</div>
              <div>
                <strong>Ideas & Knowledge</strong>
                <small>Notes, plans and inspiration</small>
              </div>
              <b>→</b>
            </LifeVisualItem>
          </LifeVisualCard>
        </LifeVisual>
         <InstallAppButton/>
      </LifeSection>

      <StepsSection id="how-it-works">
        <SectionIntro>
          <SectionLabel>GET STARTED</SectionLabel>
          <SectionTitle>
            A better organised life
            <GradientText> starts here.</GradientText>
          </SectionTitle>
          <SectionDescription>
            Get your workspace ready and start bringing everything
            together.
          </SectionDescription>
        </SectionIntro>

        <StepsGrid>
          {steps.map((step) => (
            <StepCard key={step.number}>
              <StepNumber>{step.number}</StepNumber>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </StepCard>
          ))}
        </StepsGrid>
<br/>
         <InstallAppButton/>
      </StepsSection>

      <FinalCTA>
        <CTAContent>
          <div className="cta-symbol">✳</div>
          <h2>
            Your life deserves
            <br />
            a better system.
          </h2>
          <p>
            Start organising your responsibilities, building better
            habits and making meaningful progress with LIFEOS.
          </p>
          <PrimaryButton href="/register">
            Create your free account <span>→</span>
          </PrimaryButton>
          <small>One account. Your own personal workspace.</small>
        </CTAContent>
     <br/>
      <InstallAppButton/>
      </FinalCTA>

      <Footer>
        <FooterBrand>
          <BrandIcon>✳</BrandIcon>
          LIFEOS
        </FooterBrand>
        <span>Your Personal Life Operating System.</span>
        <FooterLinks>
          <Link href="/login">Log in</Link>
          <Link href="/register">Get started</Link>
        </FooterLinks>
        <Copyright>© {new Date().getFullYear()} LIFEOS. All rights reserved.</Copyright>
      </Footer>

      <MobileBottomCTA>
        <Link href="/login">Log in</Link>
        <Link href="/register">Get started →</Link>
      </MobileBottomCTA>
    </Page>
  );
}

/* ---------------- STYLES ---------------- */

const Page = styled.main`
  min-height: 100vh;
  overflow: hidden;
  background: #080d1b;
  color: #f8faff;
  font-family: Arial, Helvetica, sans-serif;
`;

const Nav = styled.nav`
  max-width: 1240px;
  height: 82px;
  padding: 0 28px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.07);

  @media(max-width: 700px) {
    height: 68px;
    padding: 0 20px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -1px;
`;

const BrandIcon = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: white;
  border-radius: 11px;
  background: linear-gradient(135deg, #735bff, #36b9ff);
  font-size: 23px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 34px;

  a {
    color: #a6afc3;
    font-size: 13px;
    text-decoration: none;
    transition: color .2s;
  }

  a:hover { color: white; }

  @media(max-width: 760px) { display: none; }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  @media(max-width: 500px) { display: none; }
`;

const LoginLink = styled(Link)`
  color: #d9deeb;
  font-size: 13px;
  text-decoration: none;
`;

const NavButton = styled(Link)`
  padding: 12px 18px;
  border-radius: 11px;
  color: white;
  text-decoration: none;
  background: #6554ed;
  font-size: 13px;
  font-weight: 700;

  span { margin-left: 8px; }
`;

const Hero = styled.section`
  max-width: 1240px;
  min-height: 660px;
  margin: auto;
  padding: 85px 28px 80px;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  align-items: center;
  gap: 40px;

  @media(max-width: 850px) {
    grid-template-columns: 1fr;
    padding: 65px 22px 60px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  max-width: 610px;
  position: relative;
  z-index: 2;

  @media(max-width: 850px) { margin: auto; }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 13px;
  border: 1px solid rgba(139,125,255,.25);
  border-radius: 30px;
  color: #b6aaff;
  background: rgba(105,83,255,.09);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
`;

const EyebrowDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8d7aff;
  box-shadow: 0 0 12px #8d7aff;
`;

const HeroTitle = styled.h1`
  margin: 26px 0 20px;
  max-width: 620px;
  font-size: clamp(43px, 5.7vw, 72px);
  line-height: 1.05;
  letter-spacing: -3.8px;
  font-weight: 850;

  @media(max-width: 850px) {
    margin-left: auto;
    margin-right: auto;
    letter-spacing: -2.5px;
  }

  @media(max-width: 480px) { font-size: 43px; }
`;

const GradientText = styled.span`
  display: inline;
  background: linear-gradient(100deg, #a99aff 5%, #69caff 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const HeroDescription = styled.p`
  max-width: 530px;
  color: #a8b1c5;
  font-size: 16px;
  line-height: 1.85;

  @media(max-width: 850px) {
    margin: auto;
    font-size: 14px;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  margin-top: 32px;

  @media(max-width: 850px) { justify-content: center; }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 16px 22px;
  border-radius: 13px;
  color: white;
  text-decoration: none;
  font-weight: 750;
  font-size: 14px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  box-shadow: 0 10px 35px rgba(94,83,239,.25);
  transition: transform .2s, box-shadow .2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 40px rgba(94,83,239,.4);
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 22px;
  border-radius: 13px;
  border: 1px solid #30394d;
  color: #e0e5f1;
  text-decoration: none;
  font-weight: 650;
  font-size: 14px;
  background: rgba(255,255,255,.025);
`;

const TrustLine = styled.div`
  margin-top: 28px;
  color: #8994aa;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 9px;

  @media(max-width: 850px) { justify-content: center; }
`;

const TrustIcon = styled.span`
  width: 19px;
  height: 19px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #173e36;
  color: #5ce2b0;
`;

const PhoneArea = styled.div`
  min-height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media(max-width: 850px) {
    margin-top: 35px;
    min-height: 560px;
  }
`;

const Glow = styled.div`
  position: absolute;
  width: 440px;
  height: 440px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100,82,255,.25), transparent 68%);
  filter: blur(15px);
`;

const Phone = styled.div`
  position: relative;
  z-index: 1;
  width: 310px;
  min-height: 570px;
  padding: 17px 17px 10px;
  border-radius: 38px;
  border: 6px solid #30394d;
  background: #f8f9ff;
  color: #17223a;
  box-shadow: 0 35px 100px rgba(0,0,0,.55), 0 0 60px rgba(108,91,255,.15);
  transform: rotate(2deg);

  @media(max-width: 400px) {
    width: 285px;
    transform: none;
  }
`;

const PhoneTop = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 5px 16px;
  font-size: 10px;
  font-weight: 800;
  color: #27334b;
`;

const PhoneTime = styled.span``;
const PhoneStatus = styled.span`letter-spacing: 3px;`;

const PhoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
`;

const SmallGreeting = styled.div`
  color: #8993a6;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .8px;
`;

const PhoneHeading = styled.h3`
  margin: 5px 0 3px;
  font-size: 19px;
  letter-spacing: -.7px;
`;

const PhoneSubheading = styled.p`
  margin: 0;
  color: #8490a4;
  font-size: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, #765ff5, #49a8ed);
`;

const FocusCard = styled.div`
  padding: 16px;
  border-radius: 19px;
  color: white;
  background: linear-gradient(130deg, #6955ec, #426ee2);
  box-shadow: 0 10px 20px rgba(91,92,220,.2);
`;

const FocusTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: .6px;
  opacity: .9;

  .live { color: #b7f8df; }
`;

const FocusNumber = styled.div`
  margin-top: 13px;
  font-size: 37px;
  font-weight: 850;
  letter-spacing: -2px;
`;

const FocusLabel = styled.div`
  font-size: 10px;
  opacity: .8;
  margin-top: -2px;
`;

const ProgressTrack = styled.div`
  height: 6px;
  margin-top: 15px;
  border-radius: 10px;
  background: rgba(255,255,255,.23);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: 68%;
  height: 100%;
  border-radius: 10px;
  background: #b9f6df;
`;

const FocusBottom = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 9px;
  font-size: 8px;
  opacity: .9;
`;

const PhoneSectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 11px;
  font-size: 11px;
  font-weight: 850;

  .view { color: #7162df; font-size: 9px; }
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  border-bottom: 1px solid #edf0f6;
`;

const TaskCheck = styled.div`
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  background: #6e5de9;
  color: white;
  font-size: 10px;

  &.empty {
    background: white;
    border: 1.5px solid #cbd2df;
  }
`;

const TaskTitle = styled.div`
  font-size: 9px;
  font-weight: 800;
`;

const TaskMeta = styled.div`
  margin-top: 4px;
  color: #939daf;
  font-size: 8px;
`;

const TaskTag = styled.span`
  margin-left: auto;
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 7px;
  font-weight: 800;
  color: #258b67;
  background: #e4f8ef;

  &.priority { color: #d66a48; background: #fff0e8; }
  &.normal { color: #7c69d9; background: #eeebff; }
`;

const MiniGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
`;

const MiniCard = styled.div`
  padding: 10px;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  background: white;
`;

const MiniIcon = styled.div`
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: ${(p) => p.$color};
  font-size: 12px;
`;

const MiniValue = styled.div`
  margin-top: 6px;
  font-size: 15px;
  font-weight: 850;
`;

const MiniLabel = styled.div`
  margin-top: 2px;
  color: #8c96a8;
  font-size: 8px;
`;

const PhoneNav = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 13px;
  margin-top: 12px;
  border-top: 1px solid #edf0f5;
`;

const PhoneNavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${(p) => p.$active ? "#6b5be7" : "#9aa3b4"};
  font-size: 7px;
  font-weight: 700;

  span { font-size: 16px; }
`;

const FloatingCard = styled.div`
  position: absolute;
  z-index: 2;
  top: ${(p) => p.$top || "auto"};
  bottom: ${(p) => p.$bottom || "auto"};
  left: ${(p) => p.$left || "auto"};
  right: ${(p) => p.$right || "auto"};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: #182238;
  box-shadow: 0 15px 35px rgba(0,0,0,.3);

  strong {
    display: block;
    color: white;
    font-size: 10px;
  }

  small {
    display: block;
    margin-top: 4px;
    color: #9ba7bd;
    font-size: 8px;
  }

  @media(max-width: 850px) {
    ${(p) => p.$left && "left: 0;"}
    ${(p) => p.$right && "right: 0;"}
  }

  @media(max-width: 400px) { display: none; }
`;

const FloatingIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: ${(p) => p.$purple ? "#c3b7ff" : "#70e4b9"};
  background: ${(p) => p.$purple ? "#30295a" : "#174638"};
  font-weight: 900;
`;

const Stats = styled.section`
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #202a3e;
  border-bottom: 1px solid #202a3e;

  @media(max-width: 550px) { padding: 24px 8px; }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  text-align: center;

  strong {
    font-size: 20px;
    color: #b6aaff;
    letter-spacing: 1px;
  }

  span { color: #8e9ab0; font-size: 11px; }

  @media(max-width: 500px) {
    strong { font-size: 16px; }
    span { font-size: 9px; }
  }
`;

const FeaturesSection = styled.section`
  max-width: 1160px;
  margin: auto;
  padding: 110px 25px;

  @media(max-width: 700px) { padding: 80px 20px; }
`;

const SectionIntro = styled.div`
  max-width: 650px;
  margin: 0 auto 48px;
  text-align: center;
`;

const SectionLabel = styled.div`
  color: #a99aff;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 1.8px;
`;

const SectionTitle = styled.h2`
  margin: 15px 0;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.12;
  letter-spacing: -2px;
`;

const SectionDescription = styled.p`
  max-width: 550px;
  margin: 0 auto;
  color: #9ba7bd;
  font-size: 14px;
  line-height: 1.8;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;

  @media(max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
  @media(max-width: 520px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  position: relative;
  padding: 26px;
  min-height: 210px;
  border: 1px solid #222d43;
  border-radius: 20px;
  background: linear-gradient(145deg, #111b30, #0d1425);
  transition: transform .2s, border-color .2s;

  &:hover {
    transform: translateY(-5px);
    border-color: #6558b8;
  }

  h3 { margin: 20px 0 9px; font-size: 16px; }
  p { margin: 0; color: #929eb4; font-size: 12px; line-height: 1.8; }

  @media(max-width: 520px) { min-height: auto; }
`;

const FeatureIcon = styled.div`
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  color: #c1b7ff;
  background: rgba(117,96,255,.15);
  font-size: 20px;
  font-weight: 800;
`;

const FeatureArrow = styled.div`
  position: absolute;
  top: 27px;
  right: 27px;
  color: #64708a;
`;

const LifeSection = styled.section`
  max-width: 1160px;
  margin: auto;
  padding: 40px 25px 110px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 65px;

  @media(max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px 20px 80px;
  }
`;

const LifeContent = styled.div`
  ${SectionTitle} { max-width: 480px; }
  ${SectionDescription} { margin: 0; }

  @media(max-width: 850px) {
    text-align: center;
    ${SectionDescription} { margin: auto; }
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
  margin-top: 30px;

  @media(max-width: 850px) { text-align: left; }
  @media(max-width: 400px) { grid-template-columns: 1fr; }
`;

const Category = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  color: #d0d7e6;
  font-size: 12px;

  span {
    width: 19px;
    height: 19px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background: #1b3c39;
    color: #70dfb3;
    font-size: 10px;
  }
`;

const LifeVisual = styled.div`
  padding: 22px;
  border: 1px solid #27334a;
  border-radius: 27px;
  background: linear-gradient(145deg, #121e35, #0d1425);
  box-shadow: 0 25px 70px rgba(0,0,0,.25);
`;

const LifeVisualCard = styled.div`
  padding: 10px;
`;

const LifeVisualHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5px 22px;

  small { color: #a99aff; font-size: 9px; letter-spacing: 1px; }
  h3 { margin: 7px 0 0; font-size: 21px; }
  > span { color: #a99aff; font-size: 29px; }
`;

const LifeVisualItem = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 10px;
  border-top: 1px solid #273249;

  .circle {
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-size: 17px;
  }

  .purple { background: #302957; color: #c2b5ff; }
  .green { background: #183d35; color: #6fe2b7; }
  .orange { background: #493323; color: #ffbd7d; }
  .blue { background: #1b3554; color: #8dc9ff; }
  .pink { background: #462b43; color: #f0a9dc; }

  strong { display: block; font-size: 12px; }
  small { display: block; margin-top: 5px; color: #8793a9; font-size: 10px; }
  b { margin-left: auto; color: #8995aa; font-size: 17px; }
`;

const StepsSection = styled.section`
  padding: 100px 25px;
  background: #0c1425;

  @media(max-width: 600px) { padding: 75px 20px; }
`;

const StepsGrid = styled.div`
  max-width: 1080px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media(max-width: 700px) { grid-template-columns: 1fr; }
`;

const StepCard = styled.div`
  padding: 28px;
  border: 1px solid #26334a;
  border-radius: 19px;
  background: #101b30;

  h3 { margin: 20px 0 9px; font-size: 16px; }
  p { margin: 0; color: #95a1b7; font-size: 12px; line-height: 1.8; }
`;

const StepNumber = styled.div`
  color: #a99aff;
  font-size: 30px;
  font-weight: 850;
  letter-spacing: -1px;
`;

const FinalCTA = styled.section`
  padding: 100px 20px;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 100%, rgba(103,81,255,.22), transparent 60%),
    #080d1b;
`;

const CTAContent = styled.div`
  max-width: 650px;
  margin: auto;

  .cta-symbol {
    width: 55px;
    height: 55px;
    display: grid;
    place-items: center;
    margin: 0 auto 25px;
    border-radius: 17px;
    background: linear-gradient(135deg, #765df5, #38a9ef);
    font-size: 31px;
  }

  h2 {
    margin: 0;
    font-size: clamp(38px, 5vw, 55px);
    line-height: 1.1;
    letter-spacing: -2px;
  }

  p {
    max-width: 480px;
    margin: 20px auto 28px;
    color: #9ba7bd;
    font-size: 14px;
    line-height: 1.8;
  }

  small {
    display: block;
    margin-top: 17px;
    color: #78849a;
    font-size: 10px;
  }
`;

const Footer = styled.footer`
  max-width: 1160px;
  margin: auto;
  padding: 30px 25px 35px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  border-top: 1px solid #202a3e;
  color: #8793a9;
  font-size: 11px;

  @media(max-width: 650px) {
    padding-bottom: 95px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 17px;
  font-weight: 900;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-left: auto;

  a { color: #aeb8ca; text-decoration: none; }

  @media(max-width: 650px) { margin-left: 0; }
`;

const Copyright = styled.div`
  width: 100%;
  padding-top: 15px;
  border-top: 1px solid #202a3e;
  color: #657189;
`;

const MobileBottomCTA = styled.div`
  display: none;

  @media(max-width: 500px) {
    position: fixed;
    z-index: 20;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 10px;
    padding: 12px 17px calc(12px + env(safe-area-inset-bottom));
    background: rgba(10,15,29,.94);
    backdrop-filter: blur(15px);
    border-top: 1px solid #283148;

    a {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 14px;
      border-radius: 11px;
      color: white;
      text-decoration: none;
      font-size: 13px;
      font-weight: 750;
    }

    a:first-child {
      border: 1px solid #39445c;
      background: #151e31;
    }

    a:last-child {
      background: linear-gradient(110deg, #7059f5, #477eea);
    }
  }
`;
