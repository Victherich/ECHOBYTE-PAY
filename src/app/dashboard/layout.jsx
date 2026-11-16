

// "use client";

// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/firebaseConfig";
// import { useRouter, usePathname } from "next/navigation";
// import styled from "styled-components";
// import Swal from "sweetalert2";
// import {
//   LayoutDashboard,
//   Home,
//   Menu,
//   LogOut,
//   ChevronRight,
// } from "lucide-react";
// import { primaryColoring, secondaryColoring } from "@/components/Context";

// /* ================= 🎨 ENITZ BRAND THEME COLORS ================= */
// const PrimaryNavy = primaryColoring || "#0B1B48";
// const PrimaryCyan = secondaryColoring || "#00AEEF";
// const ThemeGradient = `linear-gradient(135deg, ${PrimaryNavy} 0%, ${PrimaryCyan} 100%)`;
// const Dark = "#0f172a";
// const Border = "#cbd5e1";
// const White = "#ffffff";
// const TextMuted = "#475569";
// const LightBg = "#f8fafc";

// /* ================= 🌟 STYLED COMPONENTS ================= */
// const LayoutWrapper = styled.div`
//   display: flex;
//   min-height: 100vh;
//   position: relative;
//   background: ${LightBg};
//   font-family: inherit;
// `;

// const Sidebar = styled.div`
// display:none;
// // width: 280px;
//   background: ${White};
//   border-right: 1px solid ${Border};
//   color: ${Dark};
//   padding: 28px 20px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
//   z-index: 200;
//   box-shadow: 10px 0 30px rgba(15, 23, 42, 0.03);

//   @media (max-width: 768px) {
//     position: fixed;
//     top: 0;
//     left: 0;
//     transform: translateX(${(props) => (props.$open ? "0" : "-100%")});
//     height: 100vh;
//     box-shadow: ${(props) =>
//       props.$open ? "20px 0 50px rgba(15, 23, 42, 0.15)" : "none"};
//   }
// `;

// const SidebarTop = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 28px;
// `;

// const BrandLogo = styled.h2`
//   font-family: "Playfair Display", Georgia, serif;
//   font-size: 1.4rem;
//   font-weight: 500;
//   letter-spacing: -0.3px;
//   color: ${PrimaryNavy};
//   padding-bottom: 20px;
//   border-bottom: 1px solid ${Border};
//   margin: 0;
//   display: flex;
//   align-items: center;
//   gap: 8px;

//   span {
//     color: ${PrimaryCyan};
//     font-weight: 700;
//   }
// `;

// const NavLinks = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 6px;
// `;

// const MenuItem = styled.div`
//   padding: 12px 16px;
//   cursor: pointer;
//   border-radius: 8px;
//   font-size: 0.88rem;
//   font-weight: 600;
//   color: ${(props) => (props.$active ? White : TextMuted)};
//   background: ${(props) => (props.$active ? ThemeGradient : "transparent")};
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   box-shadow: ${(props) =>
//     props.$active ? "0 4px 15px rgba(0, 174, 239, 0.25)" : "none"};
//   transition: all 0.25s ease;

//   .item-left {
//     display: flex;
//     align-items: center;
//     gap: 12px;

//     svg {
//       width: 18px;
//       height: 18px;
//     }
//   }

//   &:hover {
//     background: ${(props) =>
//       props.$active ? ThemeGradient : "rgba(0, 174, 239, 0.06)"};
//     color: ${(props) => (props.$active ? White : PrimaryNavy)};
//   }
// `;

// const LogoutButton = styled.div`
//   padding: 12px 16px;
//   cursor: pointer;
//   border-radius: 8px;
//   font-size: 0.88rem;
//   font-weight: 600;
//   color: #dc2626;
//   background: #fef2f2;
//   border: 1px solid #fca5a5;
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   transition: all 0.25s ease;

//   svg {
//     width: 18px;
//     height: 18px;
//   }

//   &:hover {
//     background: #fee2e2;
//     transform: translateY(-1px);
//   }
// `;

// const MainContentArea = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   min-width: 0;
// `;

// const Topbar = styled.header`
//   background: rgba(255, 255, 255, 0.9);
//   backdrop-filter: blur(12px);
//   border-bottom: 1px solid ${Border};
//   padding: 0 28px;
//   // height: 72px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   position: sticky;
//   top: 0;
//   z-index: 100;
// `;

// const TopbarLeft = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
// `;

// const TopbarRight = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
// `;

// const Content = styled.main`
//   flex: 1;
//   // padding: 36px;
//   background: ${LightBg};
//   overflow-y: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 24px;

//   @media (max-width: 768px) {
//     // padding: 20px;
//   }
// `;

// const Overlay = styled.div`
//   display: none;

//   @media (max-width: 768px) {
//     display: ${(props) => (props.$open ? "block" : "none")};
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     background: rgba(15, 23, 42, 0.5);
//     backdrop-filter: blur(4px);
//     z-index: 150;
//   }
// `;

// const Hamburger = styled.button`
//   width: 40px;
//   height: 40px;
//   background: ${White};
//   border: 1px solid ${Border};
//   border-radius: 8px;
//   color: ${PrimaryNavy};
//   display: none;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
//   transition: all 0.2s ease;

//   svg {
//     width: 20px;
//     height: 20px;
//   }

//   &:hover {
//     border-color: ${PrimaryCyan};
//     color: ${PrimaryCyan};
//   }

//   @media (max-width: 768px) {
//     display: flex;
//   }
// `;

// const HomeButton = styled.button`
//   width: 40px;
//   height: 40px;
//   border-radius: 8px;
//   background: ${White};
//   color: ${PrimaryNavy};
//   border: 1px solid ${Border};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
//   transition: all 0.2s ease;

//   svg {
//     width: 18px;
//     height: 18px;
//   }

//   &:hover {
//     border-color: ${PrimaryCyan};
//     color: ${PrimaryCyan};
//     transform: translateY(-1px);
//   }
// `;

// const LoadingWrapper = styled.div`
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: ${LightBg};
//   color: ${PrimaryNavy};
//   font-size: 1.05rem;
//   font-weight: 600;
//   padding: 24px;
//   box-sizing: border-box;
// `;



// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(true);

//   const showHomeButton = pathname !== "/dashboard";

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         router.replace("/login");
//       }

//       setLoading(false);
//     });

//     return () => unsub();
//   }, [router]);

//   if (loading) {
//     return (
//       <LoadingWrapper>
//         <p>Loading your dashboard...</p>
//       </LoadingWrapper>
//     );
//   }

//   return (
//     <LayoutWrapper>
//       <MainContentArea>
//         <Topbar>
//           <TopbarLeft>
//             {/* Sidebar removed */}
//           </TopbarLeft>

//           <TopbarRight>
//             {showHomeButton && (
//               <HomeButton
//                 onClick={() => router.push("/dashboard")}
//                 title="Return to Dashboard"
//               >
//                 <Home />
//               </HomeButton>
//             )}
//           </TopbarRight>
//         </Topbar>

//         <Content>
//           {children}
//         </Content>
//       </MainContentArea>
//     </LayoutWrapper>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled, { createGlobalStyle } from "styled-components";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import ModuleSelectionModal from "@/components/ModuleSelectionModal";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: #080d1b;
    color: #f8faff;
    font-family: Arial, sans-serif;
  }

  body {
    overflow-x: hidden;
  }

  button, input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const AppShell = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  margin: 0 auto;
  position: relative;
  background: #0b1222;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #172238;
  border-right: 1px solid #172238;
`;

const Header = styled.header`
  width: 100%;
  padding: 5px 10px;
  background: #0b1222;
  border-bottom: 1px solid #1c2940;
  position: sticky;
  top: 0;
  z-index: 20;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const BrandName = styled.div`
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 1.5px;
  color: #ffffff;
`;

const BrandCaption = styled.div`
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #8190aa;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid #293750;
  background: #101a2e;
  color: #cbd5e8;
  font-size: 17px;
  display: grid;
  place-items: center;

  &:hover {
    background: #192640;
  }
`;

const WelcomeSection = styled.div`
  margin-top: 5px;
`;

const WelcomeTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #f8faff;
`;

const WelcomeSubtitle = styled.p`
  margin: 0px 0 0;
  color: #8290a9;
  font-size: 12px;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  padding: 18px 16px 105px;
  min-height: 0;
`;

const BottomNav = styled.nav`
  position: fixed;
  z-index: 30;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  min-height: 72px;
  padding: 9px 8px calc(9px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: rgba(13, 22, 39, 0.97);
  border-top: 1px solid #293750;
  backdrop-filter: blur(18px);
`;

const NavItem = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: ${({ $active }) => ($active ? "#8d7aff" : "#7887a1")};
  font-size: 10px;
  font-weight: 700;
  transition: color 0.2s ease;

  .nav-icon {
    width: 31px;
    height: 27px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ $active }) =>
      $active ? "rgba(118, 93, 245, 0.16)" : "transparent"};
    font-size: 17px;
  }
`;

const MoreButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: ${({ $active }) => ($active ? "#8d7aff" : "#7887a1")};
  font-size: 10px;
  font-weight: 700;

  .nav-icon {
    width: 31px;
    height: 27px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ $active }) =>
      $active ? "rgba(118, 93, 245, 0.16)" : "transparent"};
    font-size: 17px;
  }
`;

const LoadingScreen = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #080d1b;
  color: #9aa8c1;
  font-size: 13px;
`;

const navItems = [
  { label: "Home", href: "/dashboard", icon: "⌂" },
  { label: "Inbox", href: "/dashboard/inbox", icon: "▤🌐" },
   { label: "Projects", href: "/dashboard/projects", icon: "🔳" },
  { label: "Tasks", href: "/dashboard/tasks", icon: "✓" },
  // { label: "Calendar", href: "/dashboard/calendar", icon: "▦" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showModules, setShowModules] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        setUser(null);
      } else {
        setUser(currentUser);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <>
        <GlobalStyle />
        <LoadingScreen>Loading LIFEOS...</LoadingScreen>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GlobalStyle />
        <LoadingScreen>Redirecting...</LoadingScreen>
      </>
    );
  }

  const firstName =
    user.displayName?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <GlobalStyle />

      <AppShell>
        <Header>
          <HeaderTop>
            <Brand>
              <BrandName>LIFEOS</BrandName>
              <BrandCaption>YOUR LIFE. ORGANIZED.</BrandCaption>
            </Brand>

            <HeaderActions>
              <IconButton
                type="button"
                aria-label="Search"
                onClick={() => router.push("/dashboard/search")}
              >
                ⌕
              </IconButton>

              <IconButton
                type="button"
                aria-label="Settings"
                onClick={() => router.push("/dashboard/settings")}
              >
                ⚙
              </IconButton>
            </HeaderActions>
          </HeaderTop>

          <WelcomeSection>
            <WelcomeTitle>Hello, {firstName} 👋</WelcomeTitle>
            <WelcomeSubtitle>{formattedDate}</WelcomeSubtitle>
          </WelcomeSection>
        </Header>

        <MainContent>{children}</MainContent>

        <BottomNav>
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <NavItem
                key={item.href}
                href={item.href}
                $active={active}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavItem>
            );
          })}

          <MoreButton
            type="button"
            $active={showModules}
            onClick={() => setShowModules(true)}
          >
            <span className="nav-icon">•••</span>
            <span>More</span>
          </MoreButton>
        </BottomNav>

        {showModules && (
          <ModuleSelectionModal
            onClose={() => setShowModules(false)}
            onSelect={(href) => {
              setShowModules(false);
              router.push(href);
            }}
          />
        )}
      </AppShell>
    </>
  );
}
