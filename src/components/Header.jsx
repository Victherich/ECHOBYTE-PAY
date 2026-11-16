

"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import PaymentInProgressModal from "./PaymentInProgressModal";
import { useAppContext } from "./Context";

import HostingExpiryGuard from "./HostingExpiryGuard";
import { primaryColoring, secondaryColoring } from "./Context";


/* ================= COLORS ================= */
const PrimaryColor = primaryColoring; 
const ComplementaryPurple = secondaryColoring; 
const AccentGradient = `linear-gradient(135deg, ${primaryColoring} 0%, ${secondaryColoring} 100%)`; 
const Dark = "#0f172a"; 
const Border = "#e2e8f0";
const White = "#ffffff";
const TopBarBg = "#11382b"; 
const TopBarText = "#d4af37"; 

/* ================= TOP ANNOUNCEMENT BAR ================= */
const TopBar = styled.div`
  position: relative;
  z-index: 301;
  background: ${TopBarBg};
  color: ${TopBarText};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 900px) {
    display: none; 
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-transform: uppercase;

  span {
    color: white;
    font-size: 0.7rem;
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  a {
    color: ${TopBarText};
    text-decoration: none;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }

  span.separator {
    opacity: 0.4;
  }
`;

/* ================= HEADER ================= */
const HeaderContainer = styled.header`
  position: fixed;
  top: ${(p) => (p.$scrolled ? "0" : "34px")};
  left: 0;
  width: 100%;
  z-index: 300;
  background: rgba(250, 248, 244, 0.98);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid ${Border};
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  transition: top 0.2s ease;

  @media (max-width: 900px) {
    top: 0;
  }
`;

const Inner = styled.div`
  max-width: 1350px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
`;

/* ================= LOGO ================= */
const LogoWrapper = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 40px;
    width: auto;
    border-radius: 6px;
    object-fit: contain;
  }
`;

/* ================= NAV ================= */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.75rem;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 380px;
    height: 100vh;
    background: ${White};
    border-left: 1px solid ${Border};
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem 1.5rem 2rem 1.5rem;
    gap: 0.25rem;
    overflow-y: auto;
    transform: translateX(${(p) => (p.$open ? "0" : "100%")});
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 450;
  }
`;

/* ================= DROPDOWN MENU ================= */
const NavItemWrapper = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #454545;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.35rem;
    height: 2px;
    background: #d4af37;
    transform: scaleX(${(p) => (p.$active ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.22s ease;
  }

  &:hover {
    color: ${PrimaryColor};
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: 1024px) {
    font-size: 0.9rem;
    width: 100%;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${Border};
    &::after { display: none; }
  }
`;

const DropdownButton = styled.button`
  position: relative;
  height: 100%;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #454545;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.65rem 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: #d4af37;
    transform: scaleX(${(p) => (p.$active || p.$isOpen ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.22s ease;
  }

  &:hover {
    color: ${PrimaryColor};
  }

  span {
    font-size: 0.6rem;
    transition: transform 0.2s ease;
    transform: ${(p) => (p.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }

  @media (max-width: 1024px) {
    font-size: 0.9rem;
    width: 100%;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${Border};
    &::after { display: none; }
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: -1rem;
  width: 260px;
  background: rgba(250, 248, 244, 0.98);
  border: 1px solid #e8e2d8;
  box-shadow: 0 14px 32px rgba(20, 20, 20, 0.13);
  padding: 0.85rem 1rem;
  display: ${(p) => (p.$isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 400;
  border-radius: 6px;

  .menu-heading {
    color: #c59b3b;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin: 0 0 0.5rem;
  }

  @media (min-width: 1025px) {
    ${NavItemWrapper}:hover & { display: flex; }
  }

  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    box-shadow: none;
    border: none;
    background: #f8fafc;
    border-radius: 6px;
    margin: 0.3rem 0 0.6rem 0;
    padding: 0.5rem 0.75rem;
    display: ${(p) => (p.$isOpen ? "flex" : "none")};
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.55rem 0.2rem;
  color: #454545;
  text-decoration: none;
  border-bottom: 1px solid rgba(120, 110, 90, 0.08);
  transition: all 0.2s ease;

  &:last-child { border-bottom: none; }

  .item-title {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .item-description {
    color: #77736d;
    font-size: 0.65rem;
    line-height: 1.3;
  }

  &:hover {
    color: #b28a2e;
    padding-left: 0.35rem;
  }

  @media (max-width: 1024px) {
    padding: 0.5rem 0;
    .item-title { font-size: 0.8rem; }
    .item-description { font-size: 0.7rem; }
  }
`;

/* ================= ACTION ICONS & BUTTONS ================= */
const ActionIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-start;
    padding: 0.75rem 0;
    gap: 1.5rem;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${Dark};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: ${PrimaryColor};
  }

  span.badge {
    position: absolute;
    top: -6px;
    right: -8px;
    background: ${PrimaryColor};
    color: ${White};
    font-size: 0.6rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 10px;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
    border-top: 1px solid ${Border};
    padding-top: 1rem;
    margin-top: 0.5rem;
  }
`;

const ActionButton = styled(Link)`
  text-decoration: none;
  padding: 0.45rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  transition: all 0.2s ease;

  background: ${(p) => (p.$isPrimary ? TopBarBg : "transparent")};
  color: ${(p) => (p.$isPrimary ? White : Dark)};
  border: ${(p) => (p.$isPrimary ? "none" : `1px solid ${Border}`)};

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    border-color: ${PrimaryColor};
  }

  @media (max-width: 1024px) {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.8rem;
  }
`;

/* ================= HAMBURGER ================= */
const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 500;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 28px;
    height: 20px;
  }

  div {
    width: 100%;
    height: 2.5px;
    background: ${Dark};
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
  }

  &.open div:nth-child(1) {
    transform: translateY(8.5px) rotate(45deg);
    background: ${PrimaryColor};
  }

  &.open div:nth-child(2) {
    opacity: 0;
  }

  &.open div:nth-child(3) {
    transform: translateY(-8.5px) rotate(-45deg);
    background: ${PrimaryColor};
  }
`;

/* ================= OVERLAY ================= */
const Overlay = styled.div`
  display: ${(p) => (p.$open ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 100;
`;

/* ================= COMPONENT ================= */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const [userData, setUserData] = useState(null);
  const { paymentSession, showSearch, setShowSearch } = useAppContext();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let unsubscribeDoc = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        unsubscribeDoc = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        });
      } else {
        setUserData(null);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeAll = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <TopBar>
        <TopBarLeft>
          <span>Empowering brands. Building legacies.</span>
        </TopBarLeft>
        <TopBarRight>
          <span>Lagos · Abuja · Port Harcourt</span>
          <span className="separator">|</span>
          <a href="tel:+2348000000000">+234 800 000 0000</a>
          <span className="separator">|</span>
          <Link href="/track-order">Track Order</Link>
        </TopBarRight>
      </TopBar>

      <Overlay $open={open} onClick={closeAll} />

      <HeaderContainer ref={dropdownRef} $scrolled={scrolled}>
        {paymentSession && <PaymentInProgressModal />}

        <Inner>
          <LogoWrapper href="/" onClick={closeAll}>
            <img src="/logo.jpg" alt="Logo" />
          </LogoWrapper>

          <Nav $open={open}>
            <NavLink href="/" $active={pathname === "/"} onClick={closeAll}>
              Home
            </NavLink>

            <NavLink href="/about" $active={pathname === "/about"} onClick={closeAll}>
              About
            </NavLink>

            <NavLink href="/gallery" $active={pathname === "/gallery"} onClick={closeAll}>
              Gallery
            </NavLink>

            {/* Dropdown: Living */}
            <NavItemWrapper 
              onMouseEnter={() => { if (window.innerWidth > 1024) setActiveDropdown("living"); }} 
              onMouseLeave={() => { if (window.innerWidth > 1024) setActiveDropdown(null); }}
            >
              <DropdownButton
                onClick={() => toggleDropdown("living")}
                $isOpen={activeDropdown === "living"}
                $active={pathname.startsWith("/living")}
              >
                Living <span>▼</span>
              </DropdownButton>
              <DropdownMenu $isOpen={activeDropdown === "living"}>
                <div className="menu-heading">Living Division</div>
                <DropdownItem href="/interior-decor" onClick={closeAll}><span className="item-title">Interior Decor</span><span className="item-description">Interiors, home decor & staging</span></DropdownItem>
                <DropdownItem href="/short-let" onClick={closeAll}><span className="item-title">Short-let</span><span className="item-description">Furnished apartments & executive stays</span></DropdownItem>
                <DropdownItem href="/cleaning" onClick={closeAll}><span className="item-title">Cleaning</span><span className="item-description">Residential, office & post-construction</span></DropdownItem>
              </DropdownMenu>
            </NavItemWrapper>

            {/* Dropdown: Lifestyle */}
            <NavItemWrapper 
              onMouseEnter={() => { if (window.innerWidth > 1024) setActiveDropdown("lifestyle"); }} 
              onMouseLeave={() => { if (window.innerWidth > 1024) setActiveDropdown(null); }}
            >
              <DropdownButton
                onClick={() => toggleDropdown("lifestyle")}
                $isOpen={activeDropdown === "lifestyle"}
                $active={pathname.startsWith("/lifestyle")}
              >
                Lifestyle <span>▼</span>
              </DropdownButton>
              <DropdownMenu $isOpen={activeDropdown === "lifestyle"}>
                <div className="menu-heading">Lifestyle Division</div>
                <DropdownItem href="/ashakeade-closet" onClick={closeAll}><span className="item-title">ASHÉVON</span><span className="item-description">Women's fashion & couture</span></DropdownItem>
                <DropdownItem href="/book-now" onClick={closeAll}><span className="item-title">Pinkles Spa · Nail · Hair</span><span className="item-description">Spa, beauty & wellness</span></DropdownItem>
              </DropdownMenu>
            </NavItemWrapper>

            {/* Dropdown: Property */}
            <NavItemWrapper 
              onMouseEnter={() => { if (window.innerWidth > 1024) setActiveDropdown("property"); }} 
              onMouseLeave={() => { if (window.innerWidth > 1024) setActiveDropdown(null); }}
            >
              <DropdownButton
                onClick={() => toggleDropdown("property")}
                $isOpen={activeDropdown === "property"}
                $active={pathname.startsWith("/property")}
              >
                Property <span>▼</span>
              </DropdownButton>
              <DropdownMenu $isOpen={activeDropdown === "property"}>
                <div className="menu-heading">Property Division</div>
                <DropdownItem href="/properties" onClick={closeAll}><span className="item-title">Properties</span><span className="item-description">Buy, rent, invest & shortlet</span></DropdownItem>
                <DropdownItem href="/propety-management" onClick={closeAll}><span className="item-title">Property Management</span><span className="item-description">End-to-end property management</span></DropdownItem>
                <DropdownItem href="/legal-mortgage" onClick={closeAll}><span className="item-title">Legal & Mortgage</span><span className="item-description">Property advisory & finance guidance</span></DropdownItem>
              </DropdownMenu>
            </NavItemWrapper>

            {/* Dropdown: Professional */}
            <NavItemWrapper 
              onMouseEnter={() => { if (window.innerWidth > 1024) setActiveDropdown("professional"); }} 
              onMouseLeave={() => { if (window.innerWidth > 1024) setActiveDropdown(null); }}
            >
              <DropdownButton
                onClick={() => toggleDropdown("professional")}
                $isOpen={activeDropdown === "professional"}
                $active={pathname.startsWith("/professional")}
              >
                Professional <span>▼</span>
              </DropdownButton>
              <DropdownMenu $isOpen={activeDropdown === "professional"}>
                <div className="menu-heading">Professional Division</div>
                <DropdownItem href="/business-consulting" onClick={closeAll}><span className="item-title">Business Consulting</span><span className="item-description">Strategy, growth & operations</span></DropdownItem>
                <DropdownItem href="/media-advertising" onClick={closeAll}><span className="item-title">Media & Advertising</span><span className="item-description">Brand campaigns & ambassador services</span></DropdownItem>
              </DropdownMenu>
            </NavItemWrapper>

            <NavLink href="/contact" $active={pathname === "/contact"} onClick={closeAll}>
              Contact
            </NavLink>

            <ActionIcons>
              <IconButton aria-label="Search" onClick={() => { setShowSearch(!showSearch); setOpen(false); }}>
                🔍
              </IconButton>
              <IconButton as={Link} href="/ashakeade-closet" aria-label="Wishlist" onClick={closeAll}>
                🤍
              </IconButton>
              <IconButton as={Link} href="/ashakeade-closet" aria-label="Cart" onClick={closeAll}>
                🛍️
             
              </IconButton>
            </ActionIcons>

            <NavActions>
              <ActionButton 
                href="/book-now" 
                $isPrimary={true}
                onClick={closeAll}
              >
                📅 Book Now
              </ActionButton>

              <ActionButton 
                href={userData ? "/dashboard" : "/login"} 
                $isPrimary={false}
                onClick={closeAll}
              >
                👤 {userData ? "My Dashboard" : "Login"}
              </ActionButton>
            </NavActions>
          </Nav>

          <Hamburger
            onClick={() => setOpen(!open)}
            className={open ? "open" : ""}
            aria-label="Toggle navigation menu"
          >
            <div />
            <div />
            <div />
          </Hamburger>
        </Inner>

        {showSearch && <InlineSearch onClose={() => setShowSearch(false)} />}
      </HeaderContainer>

      <div style={{ height: "50px" }} />
      <HostingExpiryGuard />
    </>
  );
}