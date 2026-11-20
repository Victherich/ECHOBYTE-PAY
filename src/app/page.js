
// "use client";

// import styled, { createGlobalStyle } from "styled-components";

// const GlobalStyle = createGlobalStyle`
//   * {
//     box-sizing: border-box;
//   }

//   body {
//     background: #070b14;
//     color: #f8fafc;
//   }
// `;

// const PageWrapper = styled.main`
//   min-height: 100vh;
//   background:
//     radial-gradient(
//       circle at 50% 0%,
//       rgba(37, 99, 235, 0.15),
//       transparent 35%
//     ),
//     #070b14;
// `;

// const Navbar = styled.nav`
//   width: 100%;
//   padding: 20px 7%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   border-bottom: 1px solid #172033;
//   background: rgba(7, 11, 20, 0.85);

//   @media (max-width: 700px) {
//     padding: 18px 5%;
//   }
// `;

// const Logo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   font-size: 21px;
//   font-weight: 800;
//   letter-spacing: -0.5px;

//   span {
//     color: #38bdf8;
//   }
// `;

// const LogoIcon = styled.div`
//   width: 42px;
//   height: 42px;
//   border-radius: 13px;
//   background: linear-gradient(135deg, #2563eb, #06b6d4);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 23px;
//   color: white;
//   font-weight: 900;
//   box-shadow: 0 5px 25px rgba(37, 99, 235, 0.3);
// `;

// const NavLinks = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 30px;
//   color: #94a3b8;
//   font-size: 14px;

//   a {
//     transition: 0.2s;
//   }

//   a:hover {
//     color: white;
//   }

//   @media (max-width: 700px) {
//     display: none;
//   }
// `;

// const NavButton = styled.a`
//   padding: 11px 20px;
//   border-radius: 10px;
//   background: #2563eb;
//   color: white !important;
//   font-weight: 600;
//   transition: 0.2s;

//   &:hover {
//     background: #1d4ed8;
//     transform: translateY(-1px);
//   }
// `;

// const Hero = styled.section`
//   padding: 100px 7% 80px;
//   display: grid;
//   grid-template-columns: 1.1fr 0.9fr;
//   gap: 70px;
//   align-items: center;
//   max-width: 1500px;
//   margin: auto;

//   @media (max-width: 900px) {
//     grid-template-columns: 1fr;
//     gap: 50px;
//     padding-top: 70px;
//   }

//   @media (max-width: 600px) {
//     padding: 60px 5%;
//   }
// `;

// const HeroContent = styled.div``;

// const Badge = styled.div`
//   display: inline-flex;
//   align-items: center;
//   gap: 9px;
//   padding: 9px 14px;
//   background: rgba(37, 99, 235, 0.1);
//   border: 1px solid rgba(59, 130, 246, 0.25);
//   color: #60a5fa;
//   border-radius: 30px;
//   font-size: 12px;
//   font-weight: 700;
//   margin-bottom: 28px;

//   span {
//     width: 7px;
//     height: 7px;
//     border-radius: 50%;
//     background: #22c55e;
//   }
// `;

// const HeroTitle = styled.h1`
//   font-size: clamp(40px, 5.5vw, 72px);
//   line-height: 1.08;
//   letter-spacing: -3px;
//   margin: 0 0 25px;
//   font-weight: 800;

//   span {
//     background: linear-gradient(90deg, #60a5fa, #22d3ee);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//   }

//   @media (max-width: 600px) {
//     letter-spacing: -1.8px;
//   }
// `;

// const HeroText = styled.p`
//   color: #94a3b8;
//   font-size: 16px;
//   line-height: 1.9;
//   max-width: 560px;
//   margin: 0 0 35px;
// `;

// const HeroButtons = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 15px;
// `;

// const PrimaryButton = styled.a`
//   padding: 15px 24px;
//   border-radius: 12px;
//   background: linear-gradient(135deg, #2563eb, #0891b2);
//   color: white;
//   font-weight: 700;
//   font-size: 14px;
//   display: inline-flex;
//   align-items: center;
//   gap: 10px;
//   transition: 0.2s;

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
//   }
// `;

// const SecondaryButton = styled.a`
//   padding: 15px 24px;
//   border-radius: 12px;
//   background: #111827;
//   border: 1px solid #263449;
//   color: white;
//   font-weight: 600;
//   font-size: 14px;
//   transition: 0.2s;

//   &:hover {
//     background: #1e293b;
//   }
// `;

// const PaymentPreview = styled.div`
//   padding: 30px;
//   border-radius: 26px;
//   border: 1px solid #243149;
//   background: linear-gradient(
//     145deg,
//     rgba(20, 31, 52, 0.95),
//     rgba(10, 16, 29, 0.98)
//   );
//   box-shadow: 0 30px 100px rgba(0, 0, 0, 0.3);
//   position: relative;

//   @media (max-width: 600px) {
//     padding: 20px;
//   }
// `;

// const PreviewHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 30px;

//   p {
//     margin: 0;
//     color: #94a3b8;
//     font-size: 12px;
//   }

//   h3 {
//     margin: 6px 0 0;
//     font-size: 20px;
//   }
// `;

// const SecureBadge = styled.div`
//   padding: 8px 12px;
//   border-radius: 9px;
//   color: #4ade80;
//   background: rgba(34, 197, 94, 0.1);
//   font-size: 11px;
//   font-weight: 700;
// `;

// const AmountBox = styled.div`
//   background: #0a1020;
//   border: 1px solid #1d2a41;
//   padding: 25px;
//   border-radius: 17px;
//   margin-bottom: 25px;

//   p {
//     color: #64748b;
//     font-size: 12px;
//     margin: 0 0 10px;
//   }

//   h2 {
//     font-size: 38px;
//     letter-spacing: -1px;
//     margin: 0;
//   }

//   span {
//     font-size: 14px;
//     color: #94a3b8;
//   }
// `;

// const PaymentOptions = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const PaymentOption = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;
//   background: #101a2d;
//   border: 1px solid #25344c;
//   padding: 17px;
//   border-radius: 13px;

//   &:first-child {
//     border-color: #3b82f6;
//     background: rgba(37, 99, 235, 0.08);
//   }
// `;

// const PaymentIcon = styled.div`
//   width: 42px;
//   height: 42px;
//   background: #1e293b;
//   border-radius: 11px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 20px;
// `;

// const PaymentInfo = styled.div`
//   flex: 1;

//   h4 {
//     margin: 0 0 5px;
//     font-size: 13px;
//   }

//   p {
//     margin: 0;
//     color: #64748b;
//     font-size: 11px;
//   }
// `;

// const Radio = styled.div`
//   width: 17px;
//   height: 17px;
//   border-radius: 50%;
//   border: 2px solid #3b82f6;
//   position: relative;

//   &::after {
//     content: "";
//     position: absolute;
//     inset: 3px;
//     background: #3b82f6;
//     border-radius: 50%;
//   }
// `;

// const PreviewPayButton = styled.div`
//   margin-top: 25px;
//   background: linear-gradient(90deg, #2563eb, #0891b2);
//   padding: 17px;
//   border-radius: 12px;
//   text-align: center;
//   font-weight: 700;
//   font-size: 14px;
//   color: white;
// `;

// const Section = styled.section`
//   padding: 90px 7%;
//   max-width: 1500px;
//   margin: auto;

//   @media (max-width: 600px) {
//     padding: 65px 5%;
//   }
// `;

// const SectionHeader = styled.div`
//   text-align: center;
//   max-width: 700px;
//   margin: 0 auto 55px;

//   span {
//     color: #38bdf8;
//     font-size: 12px;
//     font-weight: 800;
//     letter-spacing: 2px;
//     text-transform: uppercase;
//   }

//   h2 {
//     font-size: clamp(28px, 4vw, 44px);
//     letter-spacing: -1.5px;
//     margin: 17px 0;
//   }

//   p {
//     color: #94a3b8;
//     font-size: 15px;
//     line-height: 1.8;
//   }
// `;

// const FeaturesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 22px;

//   @media (max-width: 900px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (max-width: 600px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const FeatureCard = styled.div`
//   padding: 30px;
//   background: #0d1422;
//   border: 1px solid #1c293d;
//   border-radius: 18px;
//   transition: 0.25s;

//   &:hover {
//     border-color: #2563eb;
//     transform: translateY(-4px);
//   }

//   .icon {
//     width: 50px;
//     height: 50px;
//     border-radius: 14px;
//     background: rgba(37, 99, 235, 0.12);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 23px;
//     margin-bottom: 25px;
//   }

//   h3 {
//     margin: 0 0 12px;
//     font-size: 17px;
//   }

//   p {
//     color: #94a3b8;
//     font-size: 13px;
//     line-height: 1.8;
//     margin: 0;
//   }
// `;

// const CTA = styled.section`
//   margin: 30px 7% 90px;
//   padding: 65px 30px;
//   text-align: center;
//   border: 1px solid #243a5c;
//   border-radius: 25px;
//   background:
//     radial-gradient(
//       circle at 50% 0%,
//       rgba(37, 99, 235, 0.2),
//       transparent 65%
//     ),
//     #0d1422;

//   h2 {
//     font-size: clamp(28px, 4vw, 42px);
//     letter-spacing: -1px;
//     margin: 0 0 20px;
//   }

//   p {
//     color: #94a3b8;
//     line-height: 1.8;
//     max-width: 600px;
//     margin: 0 auto 30px;
//   }

//   @media (max-width: 600px) {
//     margin: 20px 5% 60px;
//     padding: 45px 20px;
//   }
// `;

// const Footer = styled.footer`
//   padding: 30px 7%;
//   border-top: 1px solid #172033;
//   display: flex;
//   justify-content: space-between;
//   flex-wrap: wrap;
//   gap: 20px;
//   color: #64748b;
//   font-size: 12px;

//   strong {
//     color: #cbd5e1;
//   }
// `;

// const features = [
//   {
//     icon: "🌍",
//     title: "Multi-Currency Payments",
//     description:
//       "Allow customers to pay in supported currencies with a flexible currency selection experience.",
//   },
//   {
//     icon: "🔗",
//     title: "Centralized Integration",
//     description:
//       "Connect all your websites and applications to one central payment infrastructure.",
//   },
//   {
//     icon: "🔐",
//     title: "Secure Verification",
//     description:
//       "Verify transactions on the server and protect your projects from fraudulent payment claims.",
//   },
//   {
//     icon: "⚡",
//     title: "Fast Checkout",
//     description:
//       "Redirect customers to a streamlined payment experience designed for speed and convenience.",
//   },
//   {
//     icon: "📊",
//     title: "Transaction Management",
//     description:
//       "Manage payment records, transaction statuses, and project activity from one dashboard.",
//   },
//   {
//     icon: "🧩",
//     title: "Easy Project Integration",
//     description:
//       "Integrate new applications through a reusable API without implementing Flutterwave each time.",
//   },
// ];

// export default function Home() {
//   return (
//     <>
//       <GlobalStyle />

//       <PageWrapper>
//         <Navbar>
//           <Logo>
//             <LogoIcon>C</LogoIcon>
//             ECHOBYTE<span>PAY1</span>
//           </Logo>

//           <NavLinks>
//             <a href="#features">Features</a>
//             <a href="#integration">Integration</a>
//             <a href="#security">Security</a>
//             <NavButton href="#integration">
//               Get Started →
//             </NavButton>
//           </NavLinks>

//           <NavButton href="#integration">
//             Get Started →
//           </NavButton>
//         </Navbar>

//         <Hero>
//           <HeroContent>
//             <Badge>
//               <span />
//               CENTRALIZED PAYMENT INFRASTRUCTURE
//             </Badge>

//             <HeroTitle>
//               One Payment System.
//               <br />
//               <span>All Your Projects.</span>
//             </HeroTitle>

//             <HeroText>
//               A centralized payment platform powered by Flutterwave.
//               Connect all your applications, accept supported currencies,
//               and manage transactions from one secure payment infrastructure.
//             </HeroText>

//             <HeroButtons>
//               <PrimaryButton href="#integration">
//                 Explore the Platform →
//               </PrimaryButton>

//               <SecondaryButton href="#features">
//                 Discover Features
//               </SecondaryButton>
//             </HeroButtons>
//           </HeroContent>

//           <PaymentPreview>
//             <PreviewHeader>
//               <div>
//                 <p>PAYMENT CHECKOUT</p>
//                 <h3>Complete Your Payment</h3>
//               </div>

//               <SecureBadge>🔒 Secure</SecureBadge>
//             </PreviewHeader>

//             <AmountBox>
//               <p>Total Amount</p>
//               <h2>
//                 ₦5,000 <span>NGN</span>
//               </h2>
//             </AmountBox>

//             <PaymentOptions>
//               <PaymentOption>
//                 <PaymentIcon>💳</PaymentIcon>
//                 <PaymentInfo>
//                   <h4>Debit / Credit Card</h4>
//                   <p>Pay securely with your card</p>
//                 </PaymentInfo>
//                 <Radio />
//               </PaymentOption>

//               <PaymentOption>
//                 <PaymentIcon>🏦</PaymentIcon>
//                 <PaymentInfo>
//                   <h4>Bank Transfer</h4>
//                   <p>Transfer directly from your bank</p>
//                 </PaymentInfo>
//               </PaymentOption>

//               <PaymentOption>
//                 <PaymentIcon>📱</PaymentIcon>
//                 <PaymentInfo>
//                   <h4>Mobile Payment</h4>
//                   <p>Use supported mobile payment methods</p>
//                 </PaymentInfo>
//               </PaymentOption>
//             </PaymentOptions>

//             <PreviewPayButton>
//               Pay ₦5,000 →
//             </PreviewPayButton>
//           </PaymentPreview>
//         </Hero>

//         <Section id="features">
//           <SectionHeader>
//             <span>Platform Features</span>
//             <h2>Everything Your Projects Need</h2>
//             <p>
//               A reusable payment infrastructure designed to simplify
//               payment processing across all your digital products.
//             </p>
//           </SectionHeader>

//           <FeaturesGrid>
//             {features.map((feature) => (
//               <FeatureCard key={feature.title}>
//                 <div className="icon">{feature.icon}</div>
//                 <h3>{feature.title}</h3>
//                 <p>{feature.description}</p>
//               </FeatureCard>
//             ))}
//           </FeaturesGrid>
//         </Section>

//         <CTA id="integration">
//           <h2>One Integration. Multiple Projects.</h2>

//           <p>
//             Build your payment infrastructure once and connect
//             your existing and future applications to Central Pay.
//           </p>

//           <PrimaryButton href="#security">
//             Build With Central Pay →
//           </PrimaryButton>
//         </CTA>

//         <Section id="security">
//           <SectionHeader>
//             <span>Security First</span>
//             <h2>Payments You Can Trust</h2>
//             <p>
//               Central Pay will use secure server-side transaction
//               verification, protected API credentials, and reliable
//               payment event handling.
//             </p>
//           </SectionHeader>
//         </Section>

//         <Footer>
//           <div>
//             <strong>ECHOBYTE PAY</strong> · Powered by Flutterwave
//           </div>

//           <div>
//             © {new Date().getFullYear()} Central Pay. All rights reserved.
//           </div>
//         </Footer>
//       </PageWrapper>
//     </>
//   );
// }





"use client";

import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    background: #f8fafc;
    color: #0f172a;
    font-family: Arial, Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
  }
`;

const PageWrapper = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(37, 99, 235, 0.07),
      transparent 35%
    ),
    #f8fafc;
`;

const Navbar = styled.nav`
  width: 100%;
  padding: 20px 7%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(15px);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 700px) {
    padding: 18px 5%;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #0f172a;

  span {
    color: #0284c7;
  }
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  color: white;
  font-weight: 900;
  box-shadow: 0 5px 20px rgba(37, 99, 235, 0.2);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  color: #64748b;
  font-size: 14px;

  a {
    transition: 0.2s;
  }

  a:hover {
    color: #2563eb;
  }

  @media (max-width: 700px) {
    display: none;
  }
`;

const NavButton = styled.a`
  padding: 11px 20px;
  border-radius: 10px;
  background: #2563eb;
  color: white !important;
  font-weight: 600;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`;

const Hero = styled.section`
  padding: 100px 7% 80px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 70px;
  align-items: center;
  max-width: 1500px;
  margin: auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 50px;
    padding-top: 70px;
  }

  @media (max-width: 600px) {
    padding: 60px 5%;
  }
`;

const HeroContent = styled.div``;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 14px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1d4ed8;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 28px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(40px, 5.5vw, 72px);
  line-height: 1.08;
  letter-spacing: -3px;
  margin: 0 0 25px;
  font-weight: 800;
  color: #0f172a;

  span {
    background: linear-gradient(90deg, #2563eb, #0891b2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 600px) {
    letter-spacing: -1.8px;
  }
`;

const HeroText = styled.p`
  color: #64748b;
  font-size: 16px;
  line-height: 1.9;
  max-width: 560px;
  margin: 0 0 35px;
`;

const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const PrimaryButton = styled.a`
  padding: 15px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2563eb, #0891b2);
  color: white;
  font-weight: 700;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: 0.2s;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
  }
`;

const SecondaryButton = styled.a`
  padding: 15px 24px;
  border-radius: 12px;
  background: white;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

const PaymentPreview = styled.div`
  padding: 30px;
  border-radius: 26px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.08);
  position: relative;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  h3 {
    margin: 6px 0 0;
    font-size: 20px;
    color: #0f172a;
  }
`;

const SecureBadge = styled.div`
  padding: 8px 12px;
  border-radius: 9px;
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  font-size: 11px;
  font-weight: 700;
`;

const AmountBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 25px;
  border-radius: 17px;
  margin-bottom: 25px;

  p {
    color: #64748b;
    font-size: 12px;
    margin: 0 0 10px;
  }

  h2 {
    font-size: 38px;
    letter-spacing: -1px;
    margin: 0;
    color: #0f172a;
  }

  span {
    font-size: 14px;
    color: #64748b;
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 17px;
  border-radius: 13px;
  transition: 0.2s;

  &:first-child {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const PaymentIcon = styled.div`
  width: 42px;
  height: 42px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const PaymentInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 5px;
    font-size: 13px;
    color: #0f172a;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 11px;
  }
`;

const Radio = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: 3px;
    background: #3b82f6;
    border-radius: 50%;
  }
`;

const PreviewPayButton = styled.div`
  margin-top: 25px;
  background: linear-gradient(90deg, #2563eb, #0891b2);
  padding: 17px;
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.15);
`;

const Section = styled.section`
  padding: 90px 7%;
  max-width: 1500px;
  margin: auto;

  @media (max-width: 600px) {
    padding: 65px 5%;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 55px;

  span {
    color: #0284c7;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  h2 {
    font-size: clamp(28px, 4vw, 44px);
    letter-spacing: -1.5px;
    margin: 17px 0;
    color: #0f172a;
  }

  p {
    color: #64748b;
    font-size: 15px;
    line-height: 1.8;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  transition: 0.25s;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.025);

  &:hover {
    border-color: #93c5fd;
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.08);
  }

  .icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 23px;
    margin-bottom: 25px;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 17px;
    color: #0f172a;
  }

  p {
    color: #64748b;
    font-size: 13px;
    line-height: 1.8;
    margin: 0;
  }
`;

const CTA = styled.section`
  margin: 30px 7% 90px;
  padding: 65px 30px;
  text-align: center;
  border: 1px solid #dbeafe;
  border-radius: 25px;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(37, 99, 235, 0.1),
      transparent 65%
    ),
    #ffffff;
  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.04);

  h2 {
    font-size: clamp(28px, 4vw, 42px);
    letter-spacing: -1px;
    margin: 0 0 20px;
    color: #0f172a;
  }

  p {
    color: #64748b;
    line-height: 1.8;
    max-width: 600px;
    margin: 0 auto 30px;
  }

  @media (max-width: 600px) {
    margin: 20px 5% 60px;
    padding: 45px 20px;
  }
`;

const Footer = styled.footer`
  padding: 30px 7%;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  color: #64748b;
  font-size: 12px;
  background: #ffffff;

  strong {
    color: #0f172a;
  }
`;

const features = [
  {
    icon: "🌍",
    title: "Multi-Currency Payments",
    description:
      "Allow customers to pay in supported currencies with a flexible currency selection experience.",
  },
  {
    icon: "🔗",
    title: "Centralized Integration",
    description:
      "Connect all your websites and applications to one central payment infrastructure.",
  },
  {
    icon: "🔐",
    title: "Secure Verification",
    description:
      "Verify transactions on the server and protect your projects from fraudulent payment claims.",
  },
  {
    icon: "⚡",
    title: "Fast Checkout",
    description:
      "Redirect customers to a streamlined payment experience designed for speed and convenience.",
  },
  {
    icon: "📊",
    title: "Transaction Management",
    description:
      "Manage payment records, transaction statuses, and project activity from one dashboard.",
  },
  {
    icon: "🧩",
    title: "Easy Project Integration",
    description:
      "Integrate new applications through a reusable API without implementing Flutterwave each time.",
  },
];

export default function Home() {
  return (
    <>
      <GlobalStyle />

      <PageWrapper>
        <Navbar>
          <Logo>
            <LogoIcon>C</LogoIcon>
            ECHOBYTE<span>PAY1</span>
          </Logo>

          <NavLinks>
            <a href="#features">Features</a>
            <a href="#integration">Integration</a>
            <a href="#security">Security</a>
            <NavButton href="#integration">
              Get Started →
            </NavButton>
          </NavLinks>

          <NavButton href="#integration">
            Get Started →
          </NavButton>
        </Navbar>

        <Hero>
          <HeroContent>
            <Badge>
              <span />
              CENTRALIZED PAYMENT INFRASTRUCTURE
            </Badge>

            <HeroTitle>
              One Payment System.
              <br />
              <span>All Your Projects.</span>
            </HeroTitle>

            <HeroText>
              A centralized payment platform powered by Flutterwave.
              Connect all your applications, accept supported currencies,
              and manage transactions from one secure payment infrastructure.
            </HeroText>

            <HeroButtons>
              <PrimaryButton href="#integration">
                Explore the Platform →
              </PrimaryButton>

              <SecondaryButton href="#features">
                Discover Features
              </SecondaryButton>
            </HeroButtons>
          </HeroContent>

          <PaymentPreview>
            <PreviewHeader>
              <div>
                <p>PAYMENT CHECKOUT</p>
                <h3>Complete Your Payment</h3>
              </div>

              <SecureBadge>🔒 Secure</SecureBadge>
            </PreviewHeader>

            <AmountBox>
              <p>Total Amount</p>
              <h2>
                ₦5,000 <span>NGN</span>
              </h2>
            </AmountBox>

            <PaymentOptions>
              <PaymentOption>
                <PaymentIcon>💳</PaymentIcon>
                <PaymentInfo>
                  <h4>Debit / Credit Card</h4>
                  <p>Pay securely with your card</p>
                </PaymentInfo>
                <Radio />
              </PaymentOption>

              <PaymentOption>
                <PaymentIcon>🏦</PaymentIcon>
                <PaymentInfo>
                  <h4>Bank Transfer</h4>
                  <p>Transfer directly from your bank</p>
                </PaymentInfo>
              </PaymentOption>

              <PaymentOption>
                <PaymentIcon>📱</PaymentIcon>
                <PaymentInfo>
                  <h4>Mobile Payment</h4>
                  <p>Use supported mobile payment methods</p>
                </PaymentInfo>
              </PaymentOption>
            </PaymentOptions>

            <PreviewPayButton>
              Pay ₦5,000 →
            </PreviewPayButton>
          </PaymentPreview>
        </Hero>

        <Section id="features">
          <SectionHeader>
            <span>Platform Features</span>
            <h2>Everything Your Projects Need</h2>
            <p>
              A reusable payment infrastructure designed to simplify
              payment processing across all your digital products.
            </p>
          </SectionHeader>

          <FeaturesGrid>
            {features.map((feature) => (
              <FeatureCard key={feature.title}>
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Section>

        <CTA id="integration">
          <h2>One Integration. Multiple Projects.</h2>

          <p>
            Build your payment infrastructure once and connect
            your existing and future applications to Central Pay.
          </p>

          <PrimaryButton href="#security">
            Build With Central Pay →
          </PrimaryButton>
        </CTA>

        <Section id="security">
          <SectionHeader>
            <span>Security First</span>
            <h2>Payments You Can Trust</h2>
            <p>
              Central Pay will use secure server-side transaction
              verification, protected API credentials, and reliable
              payment event handling.
            </p>
          </SectionHeader>
        </Section>

        <Footer>
          <div>
            <strong>ECHOBYTE PAY</strong> · Powered by Flutterwave
          </div>

          <div>
            © {new Date().getFullYear()} Central Pay. All rights reserved.
          </div>
        </Footer>
      </PageWrapper>
    </>
  );
}
