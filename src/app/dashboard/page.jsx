



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   updateDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { auth, db } from "@/firebaseConfig";
// import { useRouter } from "next/navigation";
// import styled from "styled-components";
// import Swal from 'sweetalert2'

// /* =========================
//    HOME TAB STYLES
// ========================= */

// const Content = styled.div`
//   padding: 0;
// `;

// const Section = styled.section`
//   margin-bottom: 23px;
// `;

// const SectionHead = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin: 0 1px 12px;
// `;

// const SectionTitle = styled.h2`
//   margin: 0;
//   color: #edf2ff;
//   font-size: 14px;
//   font-weight: 850;
//   letter-spacing: -.3px;
// `;

// const LinkButton = styled.button`
//   background: transparent;
//   border: 0;
//   color: #a99aff;
//   font-size: 11px;
//   font-weight: 800;
//   cursor: pointer;

//   &:hover {
//     color: #c4baff;
//   }
// `;

// const Card = styled.div`
//   background: #131e33;
//   border: 1px solid #293750;
//   border-radius: 18px;
//   padding: 15px;
// `;

// const Hero = styled.div`
//   color: white;
//   border-radius: 23px;
//   padding: 19px;
//   background: linear-gradient(130deg, #5148d9, #756cf2 65%, #948aff);
//   box-shadow: 0 12px 25px rgba(94, 83, 225, .18);
// `;

// const HeroTop = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 10px;
// `;

// const HeroLabel = styled.div`
//   font-size: 10px;
//   letter-spacing: 1px;
//   font-weight: 800;
//   color: #e3e1ff;
// `;

// const HeroNumber = styled.div`
//   font-size: 36px;
//   font-weight: 900;
//   letter-spacing: -1.5px;
//   margin-top: 15px;
// `;

// const Track = styled.div`
//   height: 7px;
//   border-radius: 20px;
//   overflow: hidden;
//   background: rgba(255,255,255,.25);
//   margin-top: 15px;
// `;

// const Fill = styled.div`
//   height: 100%;
//   width: ${({ $width }) => $width}%;
//   border-radius: inherit;
//   background: white;
//   transition: width .25s ease;
// `;

// const HeroFoot = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 9px;
//   font-size: 10px;
//   color: #e5e3ff;
// `;

// const Grid3 = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 9px;
// `;

// const Stat = styled(Card)`
//   padding: 12px 10px;
//   min-width: 0;
// `;

// const StatIcon = styled.div`
//   font-size: 17px;
//   margin-bottom: 8px;
// `;

// const StatNumber = styled.div`
//   color: #f8faff;
//   font-size: 21px;
//   font-weight: 900;
//   letter-spacing: -.7px;
// `;

// const StatLabel = styled.div`
//   font-size: 9px;
//   color: #8997b0;
//   margin-top: 4px;
// `;

// const CaptureButton = styled.button`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 15px;
//   color: #fff;
//   background: linear-gradient(110deg, #1b2942, #202b46);
//   border: 1px solid #35425e;
//   border-radius: 17px;
//   text-align: left;
//   cursor: pointer;

//   &:hover {
//     border-color: #8878ff;
//   }
// `;

// const CapturePlus = styled.span`
//   width: 34px;
//   height: 34px;
//   border-radius: 11px;
//   display: grid;
//   place-items: center;
//   background: #7167f2;
//   font-size: 22px;
//   flex-shrink: 0;
// `;

// const CaptureText = styled.div`
//   font-size: 13px;
//   font-weight: 800;
// `;

// const CaptureSub = styled.div`
//   font-size: 10px;
//   color: #aab6cc;
//   margin-top: 4px;
// `;

// const QuickGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 9px;
// `;

// const Quick = styled.button`
//   border: 1px solid #293750;
//   background: #131e33;
//   border-radius: 15px;
//   padding: 12px 3px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 8px;
//   cursor: pointer;

//   &:hover {
//     border-color: #8878ff;
//     transform: translateY(-2px);
//   }
// `;

// const QuickIcon = styled.span`
//   width: 37px;
//   height: 37px;
//   border-radius: 12px;
//   display: grid;
//   place-items: center;
//   background: ${({ $bg }) => $bg};
//   font-size: 18px;
// `;

// const QuickLabel = styled.span`
//   color: #c4cde0;
//   font-size: 9px;
//   font-weight: 750;
// `;

// const Row = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
// `;

// const TaskRow = styled(Row)`
//   padding: 12px 0;
//   border-bottom: 1px solid #293750;

//   &:last-child {
//     border-bottom: 0;
//   }
// `;

// const Check = styled.button`
//   width: 21px;
//   height: 21px;
//   border: 1.5px solid ${({ $done }) =>
//     $done ? "#7965f4" : "#53617a"};
//   background: ${({ $done }) =>
//     $done ? "#6b61ee" : "#17243a"};
//   color: white;
//   border-radius: 7px;
//   flex-shrink: 0;
//   cursor: pointer;
//   display: grid;
//   place-items: center;

//   &:disabled {
//     opacity: .5;
//     cursor: not-allowed;
//   }
// `;

// const TaskBody = styled.div`
//   flex: 1;
//   min-width: 0;
// `;

// const TaskTitle = styled.div`
//   font-size: 11px;
//   font-weight: 750;
//   color: ${({ $done }) => $done ? "#77849b" : "#e4eaf6"};
//   text-decoration: ${({ $done }) => $done ? "line-through" : "none"};
//   overflow-wrap: anywhere;
// `;

// const TaskMeta = styled.div`
//   margin-top: 4px;
//   font-size: 9px;
//   color: #8794ab;
// `;

// const Tag = styled.span`
//   padding: 5px 7px;
//   border-radius: 7px;
//   background: ${({ $tone }) =>
//     $tone === "red" ? "rgba(255,100,100,.13)" :
//     $tone === "green" ? "rgba(70,210,145,.13)" :
//     "rgba(120,105,255,.15)"};
//   color: ${({ $tone }) =>
//     $tone === "red" ? "#ff9999" :
//     $tone === "green" ? "#70dcb5" :
//     "#b5a7ff"};
//   font-size: 8px;
//   font-weight: 850;
//   white-space: nowrap;
// `;

// const ModuleGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 10px;
// `;

// const Module = styled.button`
//   display: flex;
//   gap: 10px;
//   align-items: center;
//   text-align: left;
//   border: 1px solid #293750;
//   border-radius: 16px;
//   padding: 12px 10px;
//   background: #131e33;
//   min-width: 0;
//   cursor: pointer;

//   &:hover {
//     border-color: #8878ff;
//     background: #192640;
//   }
// `;

// const ModuleIcon = styled.div`
//   width: 39px;
//   height: 39px;
//   display: grid;
//   place-items: center;
//   flex-shrink: 0;
//   border-radius: 12px;
//   background: ${({ $bg }) => $bg};
//   font-size: 18px;
// `;

// const ModuleName = styled.div`
//   font-size: 10px;
//   font-weight: 850;
//   color: #e7edfa;
// `;

// const ModuleDesc = styled.div`
//   margin-top: 4px;
//   font-size: 8px;
//   color: #8997b0;
//   line-height: 1.4;
// `;

// const LogoutButton = styled.button`
//   border: 1px solid #49364a;
//   background: #251d30;
//   color: #ff9999;
//   border-radius: 11px;
//   padding: 9px 13px;
//   font-size: 10px;
//   font-weight: 800;
//   cursor: pointer;

//   &:hover {
//     background: #382438;
//   }

//   &:disabled {
//     opacity: .5;
//     cursor: not-allowed;
//   }
// `;

// const Empty = styled.div`
//   padding: 18px 5px;
//   color: #8997b0;
//   text-align: center;
//   font-size: 11px;
// `;

// const StatusMessage = styled.div`
//   padding: 13px;
//   border-radius: 12px;
//   background: ${({ $error }) =>
//     $error ? "rgba(255,100,100,.09)" : "#192640"};
//   border: 1px solid ${({ $error }) =>
//     $error ? "rgba(255,100,100,.25)" : "#293750"};
//   color: ${({ $error }) =>
//     $error ? "#ff9999" : "#aab6cc"};
//   font-size: 11px;
//   line-height: 1.5;
// `;

// const DashboardHeader = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   align-items: center;
//   margin-bottom: 17px;
// `;

// const ToastMessage = styled.div`
//   position: fixed;
//   z-index: 120;
//   bottom: 90px;
//   left: 50%;
//   transform: translateX(-50%);
//   color: white;
//   background: #26344d;
//   border: 1px solid #43516c;
//   border-radius: 12px;
//   padding: 11px 15px;
//   font-size: 10px;
//   max-width: calc(100% - 30px);
//   text-align: center;
// `;

// /* =========================
//    LIFEOS MODULES
// ========================= */

// const modules = [
//   {
//     name: "Universal Inbox",
//     desc: "Capture everything",
//     icon: "📥",
//     bg: "#eeedff",
//     href: "/dashboard/inbox",
//   },
//   {
//     name: "My Tasks",
//     desc: "One-off and recurring",
//     icon: "☑️",
//     bg: "#eaf8f0",
//     href: "/dashboard/tasks",
//   },
//   {
//     name: "Life Areas",
//     desc: "Organise life categories",
//     icon: "🌐",
//     bg: "#f0efff",
//     href: "/dashboard/life-areas",
//   },
//   {
//     name: "Routines & Habits",
//     desc: "Daily consistency",
//     icon: "🔁",
//     bg: "#fff6df",
//     href: "/dashboard/routines",
//   },
//   {
//     name: "Goals & Vision",
//     desc: "Your bigger picture",
//     icon: "🎯",
//     bg: "#ffeef1",
//     href: "/dashboard/goals",
//   },
//   {
//     name: "Finances",
//     desc: "Bills, budgets and income",
//     icon: "💰",
//     bg: "#e9f8f0",
//     href: "/dashboard/finances",
//   },
//   {
//     name: "Notes & Knowledge",
//     desc: "Ideas and information",
//     icon: "📝",
//     bg: "#e8f5ff",
//     href: "/dashboard/notes",
//   },
//   {
//     name: "Reports & Reviews",
//     desc: "Progress and insights",
//     icon: "📊",
//     bg: "#f2efff",
//     href: "/dashboard/reports",
//   },
//   {
//     name: "Settings",
//     desc: "Profile and preferences",
//     icon: "⚙️",
//     bg: "#f0f2f6",
//     href: "/dashboard/settings",
//   },
// ];

// /* =========================
//    DATE HELPERS
// ========================= */

// function getLocalDateString(date = new Date()) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function formatTaskTime(time) {
//   if (!time) return "No time set";

//   // Supports values such as 09:00 or 9:00 AM.
//   if (/^\d{1,2}:\d{2}$/.test(time)) {
//     const [hours, minutes] = time.split(":").map(Number);
//     const suffix = hours >= 12 ? "PM" : "AM";
//     const formattedHour = hours % 12 || 12;

//     return `${formattedHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
//   }

//   return time;
// }

// function getPriorityTone(priority, overdue) {
//   if (overdue || priority === "Critical" || priority === "High") {
//     return "red";
//   }

//   return "purple";
// }

// /* =========================
//    HOME TAB COMPONENT
// ========================= */

// export default function HomeTab() {
//   const router = useRouter();

//   /* =========================
//      STATE
//   ========================= */

//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   const [tasks, setTasks] = useState([]);
//   const [inbox, setInbox] = useState([]);

//   const [tasksLoading, setTasksLoading] = useState(true);
//   const [inboxLoading, setInboxLoading] = useState(true);

//   const [tasksError, setTasksError] = useState("");
//   const [inboxError, setInboxError] = useState("");

//   const [loggingOut, setLoggingOut] = useState(false);
//   const [updatingTaskId, setUpdatingTaskId] = useState(null);

//   const [toast, setToast] = useState("");

//   /* =========================
//      AUTH LISTENER
//   ========================= */

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setAuthLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* =========================
//      FIRESTORE LISTENERS
//   ========================= */

//   useEffect(() => {
//     if (!user?.uid) {
//       setTasks([]);
//       setInbox([]);
//       setTasksLoading(false);
//       setInboxLoading(false);
//       setTasksError("");
//       setInboxError("");
//       return;
//     }

//     setTasksLoading(true);
//     setInboxLoading(true);
//     setTasksError("");
//     setInboxError("");

//     const tasksRef = collection(db, "users", user.uid, "tasks");
//     const inboxRef = collection(db, "users", user.uid, "inbox");

//     const unsubscribeTasks = onSnapshot(
//       tasksRef,
//       (snapshot) => {
//         const fetchedTasks = snapshot.docs.map((item) => ({
//           id: item.id,
//           ...item.data(),
//         }));

//         setTasks(fetchedTasks);
//         setTasksLoading(false);
//         setTasksError("");
//       },
//       (error) => {
//         console.error("Home tasks Firestore error:", error);
//         setTasksError("Unable to load your tasks. Please refresh and try again.");
//         setTasksLoading(false);
//       }
//     );

//     const unsubscribeInbox = onSnapshot(
//       inboxRef,
//       (snapshot) => {
//         const fetchedInbox = snapshot.docs.map((item) => ({
//           id: item.id,
//           ...item.data(),
//         }));

//         setInbox(fetchedInbox);
//         setInboxLoading(false);
//         setInboxError("");
//       },
//       (error) => {
//         console.error("Home inbox Firestore error:", error);
//         setInboxError("Unable to load your inbox. Please refresh and try again.");
//         setInboxLoading(false);
//       }
//     );

//     return () => {
//       unsubscribeTasks();
//       unsubscribeInbox();
//     };
//   }, [user?.uid]);

//   /* =========================
//      TOAST NOTIFICATION
//   ========================= */

//   useEffect(() => {
//     if (!toast) return;

//     const timer = window.setTimeout(() => {
//       setToast("");
//     }, 2500);

//     return () => window.clearTimeout(timer);
//   }, [toast]);

//   function notify(message) {
//     setToast(message);
//   }

//   /* =========================
//      TODAY'S DATE
//   ========================= */

//   const todayDate = useMemo(() => getLocalDateString(), []);

//   const todayLabel = useMemo(
//     () =>
//       new Date().toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//       }),
//     []
//   );

//   /* =========================
//      TASK CALCULATIONS
//   ========================= */

//   const todaysTasks = useMemo(() => {
//     return tasks.filter((task) => {
//       const scheduledDate = task.scheduledDate || "";

//       // Include today's tasks and unfinished tasks scheduled in the past.
//       return (
//         scheduledDate === todayDate ||
//         (!task.done && scheduledDate && scheduledDate < todayDate)
//       );
//     });
//   }, [tasks, todayDate]);

//   const sortedTodaysTasks = useMemo(() => {
//     return [...todaysTasks].sort((a, b) => {
//       // Unfinished tasks first.
//       if (a.done !== b.done) {
//         return a.done ? 1 : -1;
//       }

//       // Earlier scheduled dates first.
//       const dateA = a.scheduledDate || "9999-12-31";
//       const dateB = b.scheduledDate || "9999-12-31";

//       if (dateA !== dateB) {
//         return dateA.localeCompare(dateB);
//       }

//       // Then sort by time where available.
//       return (a.time || "").localeCompare(b.time || "");
//     });
//   }, [todaysTasks]);

//   const completed = todaysTasks.filter((task) => task.done).length;

//   const remaining = todaysTasks.filter((task) => !task.done).length;

//   const overdue = tasks.filter((task) => {
//     return (
//       !task.done &&
//       (
//         task.overdue === true ||
//         (task.scheduledDate && task.scheduledDate < todayDate)
//       )
//     );
//   }).length;

//   const progress = todaysTasks.length
//     ? Math.round((completed / todaysTasks.length) * 100)
//     : 0;

//   const displayedTasks = sortedTodaysTasks.slice(0, 4);

//   /* =========================
//      TASK COMPLETION
//   ========================= */

//   async function toggleTask(task) {
//     if (!user?.uid || updatingTaskId) return;

//     // Recurring tasks have their own scheduling logic in TasksTab.
//     // Open the Tasks page so recurrence is handled consistently.
//     if (
//       task.recurrenceType &&
//       task.recurrenceType !== "none"
//     ) {
//       router.push("/dashboard/tasks");
//       return;
//     }

//     try {
//       setUpdatingTaskId(task.id);

//       const taskRef = doc(
//         db,
//         "users",
//         user.uid,
//         "tasks",
//         task.id
//       );

//       await updateDoc(taskRef, {
//         done: !task.done,
//         updatedAt: serverTimestamp(),
//       });

//       notify(
//         task.done
//           ? "Task marked as incomplete"
//           : "Task completed successfully"
//       );
//     } catch (error) {
//       console.error("Task update failed:", error);
//       notify("Unable to update task. Please try again.");
//     } finally {
//       setUpdatingTaskId(null);
//     }
//   }

//   /* =========================
//      NAVIGATION
//   ========================= */

//   function goTo(href) {
//     router.push(href);
//   }

//   function openModule(module) {
//     goTo(module.href);
//   }

//   /* =========================
//      LOGOUT
//   ========================= */
// async function handleLogout() {
//   if (loggingOut) return;

//   const result = await Swal.fire({
//     title: "Log out?",
//     text: "Are you sure you want to log out of LIFEOS?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Yes, log out",
//     cancelButtonText: "Cancel",
//     confirmButtonColor: "#7059f5",
//     cancelButtonColor: "#35425a",
//     background: "#131e33",
//     color: "#f8faff",
//     reverseButtons: true,
//   });

//   if (!result.isConfirmed) return;

//   try {
//     setLoggingOut(true);

//     await signOut(auth);

//     router.replace("/login");
//   } catch (error) {
//     console.error("Logout failed:", error);
//     notify("Unable to log out. Please try again.");
//     setLoggingOut(false);
//   }
// }

//   /* =========================
//      AUTH LOADING
//   ========================= */

//   if (authLoading) {
//     return (
//       <Content>
//         <Empty>Loading your LIFEOS account...</Empty>
//       </Content>
//     );
//   }

//   if (!user) {
//     return (
//       <Content>
//         <Card>
//           <Empty>
//             You are not logged in. Please sign in to access your dashboard.
//           </Empty>

//           <LinkButton onClick={() => router.replace("/login")}>
//             Go to login →
//           </LinkButton>
//         </Card>
//       </Content>
//     );
//   }

//   /* =========================
//      DASHBOARD
//   ========================= */

//   return (
//     <Content>
//       {/* HEADER / LOGOUT */}

//       <DashboardHeader>
//         <LogoutButton
//           onClick={handleLogout}
//           disabled={loggingOut}
//         >
//           {loggingOut ? "Logging out..." : "↪ Log out"}
//         </LogoutButton>
//       </DashboardHeader>

//       {/* DAILY OVERVIEW */}

//       <Section>
//         <Hero>
//           <HeroTop>
//             <HeroLabel>YOUR LIFE AT A GLANCE</HeroLabel>
//             <HeroLabel>{todayLabel.toUpperCase()}</HeroLabel>
//           </HeroTop>

//           <HeroNumber>
//             {tasksLoading ? "..." : `${progress}%`}
//           </HeroNumber>

//           <div style={{ fontSize: 11, color: "#e5e3ff" }}>
//             Today's task completion
//           </div>

//           <Track>
//             <Fill $width={progress} />
//           </Track>

//           <HeroFoot>
//             <span>{completed} completed</span>
//             <span>{remaining} remaining</span>
//           </HeroFoot>
//         </Hero>
//       </Section>

//       {/* STATISTICS */}

//       <Section>
//         <Grid3>
//           <Stat>
//             <StatIcon>☑️</StatIcon>
//             <StatNumber>
//               {tasksLoading ? "..." : remaining}
//             </StatNumber>
//             <StatLabel>Tasks remaining</StatLabel>
//           </Stat>

//           <Stat>
//             <StatIcon>⚠️</StatIcon>
//             <StatNumber>
//               {tasksLoading ? "..." : overdue}
//             </StatNumber>
//             <StatLabel>Overdue tasks</StatLabel>
//           </Stat>

//           <Stat>
//             <StatIcon>📥</StatIcon>
//             <StatNumber>
//               {inboxLoading ? "..." : inbox.length}
//             </StatNumber>
//             <StatLabel>Inbox items</StatLabel>
//           </Stat>
//         </Grid3>
//       </Section>

//       {/* UNIVERSAL CAPTURE */}

//       <Section>
//         <CaptureButton
//           onClick={() => goTo("/dashboard/inbox")}
//         >
//           <div>
//             <CaptureText>＋ Inbox / Capture anything</CaptureText>
//             <CaptureSub>
//               Ideas, reminders, events and more
//             </CaptureSub>
//           </div>

//           <CapturePlus>＋</CapturePlus>
//         </CaptureButton>
//       </Section>

//       {/* QUICK ACTIONS */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>Quick actions</SectionTitle>
//         </SectionHead>

//         <QuickGrid>
//           {[
//             ["☑️", "Task", "#eeedff", "/dashboard/tasks"],
//             ["📅", "Event", "#e8f5ff", "/dashboard/inbox"],
//             ["🎯", "Goal", "#fff1e9", "/dashboard/inbox"],
//             ["📝", "Note", "#e9f8f0", "/dashboard/inbox"],
//           ].map(([icon, label, bg, route]) => (
//             <Quick
//               key={label}
//               onClick={() => goTo(route)}
//             >
//               <QuickIcon $bg={bg}>{icon}</QuickIcon>
//               <QuickLabel>{label}</QuickLabel>
//             </Quick>
//           ))}
//         </QuickGrid>
//       </Section>

//       {/* TODAY'S PRIORITIES */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>Today's priorities</SectionTitle>

//           <LinkButton onClick={() => goTo("/dashboard/tasks")}>
//             View all →
//           </LinkButton>
//         </SectionHead>

//         <Card>
//           {tasksLoading ? (
//             <Empty>Loading your tasks...</Empty>
//           ) : tasksError ? (
//             <StatusMessage $error>
//               {tasksError}
//             </StatusMessage>
//           ) : displayedTasks.length === 0 ? (
//             <Empty>
//               No tasks scheduled for today. Enjoy your free time or add a task.
//             </Empty>
//           ) : (
//             displayedTasks.map((task) => {
//               const isRecurring =
//                 task.recurrenceType &&
//                 task.recurrenceType !== "none";

//               const isOverdue =
//                 !task.done &&
//                 (
//                   task.overdue === true ||
//                   (task.scheduledDate && task.scheduledDate < todayDate)
//                 );

//               return (
//                 <TaskRow key={task.id}>
//                   <Check
//                     type="button"
//                     $done={task.done}
//                     disabled={updatingTaskId === task.id}
//                     onClick={() => toggleTask(task)}
//                     title={
//                       isRecurring
//                         ? "Manage recurring task"
//                         : task.done
//                         ? "Mark as incomplete"
//                         : "Mark as complete"
//                     }
//                   >
//                     {task.done ? "✓" : ""}
//                   </Check>

//                   <TaskBody>
//                     <TaskTitle $done={task.done}>
//                       {task.title || "Untitled task"}
//                     </TaskTitle>

//                     <TaskMeta>
//                       {task.area || "Personal"} · {formatTaskTime(task.time)}
//                     </TaskMeta>
//                   </TaskBody>

//                   {!task.done && (
//                     <Tag
//                       $tone={getPriorityTone(
//                         task.priority,
//                         isOverdue
//                       )}
//                     >
//                       {isOverdue
//                         ? "OVERDUE"
//                         : (task.priority || "MEDIUM").toUpperCase()}
//                     </Tag>
//                   )}
//                 </TaskRow>
//               );
//             })
//           )}
//         </Card>
//       </Section>

//       {/* UNIVERSAL INBOX */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>Universal Inbox</SectionTitle>

//           <LinkButton onClick={() => goTo("/dashboard/inbox")}>
//             Open inbox →
//           </LinkButton>
//         </SectionHead>

//         <Card>
//           {inboxLoading ? (
//             <Empty>Loading your inbox...</Empty>
//           ) : inboxError ? (
//             <StatusMessage $error>
//               {inboxError}
//             </StatusMessage>
//           ) : inbox.length === 0 ? (
//             <Empty>Your inbox is clear.</Empty>
//           ) : (
//             inbox.slice(0, 3).map((item) => (
//               <TaskRow key={item.id}>
//                 <span>📥</span>

//                 <TaskBody>
//                   <TaskTitle>
//                     {item.title || "Untitled item"}
//                   </TaskTitle>

//                   <TaskMeta>
//                     {item.type || "Inbox item"} · Needs organising
//                   </TaskMeta>
//                 </TaskBody>

//                 <Tag>INBOX</Tag>
//               </TaskRow>
//             ))
//           )}
//         </Card>
//       </Section>

//       {/* PROJECTS PLACEHOLDER */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>Projects</SectionTitle>
//         </SectionHead>

//         <Card>
//           <Empty>
//             Your Projects module is not available yet.
//             Your projects will appear here when that feature is built.
//           </Empty>
//         </Card>
//       </Section>

//       {/* CALENDAR PLACEHOLDER */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>Calendar</SectionTitle>
//         </SectionHead>

//         <Card>
//           <Empty>
//             Your Calendar module is not available yet.
//             Your events and schedule will appear here when that feature is built.
//           </Empty>
//         </Card>
//       </Section>

//       {/* ALL LIFEOS MODULES */}

//       <Section>
//         <SectionHead>
//           <SectionTitle>All LIFEOS modules</SectionTitle>
//         </SectionHead>

//         <ModuleGrid>
//           {modules.map((module) => (
//             <Module
//               key={module.name}
//               onClick={() => openModule(module)}
//             >
//               <ModuleIcon $bg={module.bg}>
//                 {module.icon}
//               </ModuleIcon>

//               <div>
//                 <ModuleName>{module.name}</ModuleName>
//                 <ModuleDesc>{module.desc}</ModuleDesc>
//               </div>
//             </Module>
//           ))}
//         </ModuleGrid>
//       </Section>

//       {/* TOAST NOTIFICATION */}

//       {toast && (
//         <ToastMessage>
//           {toast}
//         </ToastMessage>
//       )}
//     </Content>
//   );
// }






"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Swal from "sweetalert2";

/* =========================
   STYLES
========================= */

const Content = styled.div`
  padding: 0;
`;

const Section = styled.section`
  margin-bottom: 23px;
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin: 0 1px 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #edf2ff;
  font-size: 14px;
  font-weight: 850;
  letter-spacing: -.3px;
`;

const LinkButton = styled.button`
  background: transparent;
  border: 0;
  color: #a99aff;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    color: #c4baff;
  }
`;

const Card = styled.div`
  background: #131e33;
  border: 1px solid #293750;
  border-radius: 18px;
  padding: 15px;
`;

const Hero = styled.div`
  color: white;
  border-radius: 23px;
  padding: 19px;
  background: linear-gradient(130deg, #5148d9, #756cf2 65%, #948aff);
  box-shadow: 0 12px 25px rgba(94, 83, 225, .18);
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const HeroLabel = styled.div`
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 800;
  color: #e3e1ff;
`;

const HeroNumber = styled.div`
  font-size: 39px;
  font-weight: 900;
  letter-spacing: -1.5px;
  margin-top: 18px;
`;

const Track = styled.div`
  height: 8px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255,255,255,.25);
  margin-top: 15px;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: inherit;
  background: white;
  transition: width .3s ease;
`;

const HeroFoot = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 11px;
  font-size: 10px;
  color: #e5e3ff;
`;

const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
`;

const Stat = styled(Card)`
  padding: 13px 10px;
  min-width: 0;
`;

const StatIcon = styled.div`
  font-size: 18px;
  margin-bottom: 9px;
`;

const StatNumber = styled.div`
  color: #f8faff;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -.7px;
`;

const StatLabel = styled.div`
  font-size: 9px;
  color: #8997b0;
  margin-top: 5px;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 9px;
`;

const Quick = styled.button`
  border: 1px solid #293750;
  background: #131e33;
  border-radius: 15px;
  padding: 12px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    border-color: #8878ff;
    transform: translateY(-2px);
  }
`;

const QuickIcon = styled.span`
  width: 37px;
  height: 37px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${({ $bg }) => $bg};
  font-size: 18px;
`;

const QuickLabel = styled.span`
  color: #c4cde0;
  font-size: 9px;
  font-weight: 750;
`;

const ProjectCard = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid #293750;

  &:first-child {
    padding-top: 2px;
  }

  &:last-child {
    border-bottom: 0;
    padding-bottom: 2px;
  }
`;

const ProjectTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const ProjectName = styled.div`
  font-size: 12px;
  font-weight: 850;
  color: #e7edfa;
  overflow-wrap: anywhere;
`;

const ProjectMeta = styled.div`
  font-size: 9px;
  color: #8997b0;
  margin-top: 5px;
  line-height: 1.5;
`;

const ProjectTrack = styled.div`
  height: 6px;
  background: #293750;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProjectFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: linear-gradient(90deg, #7059f5, #9a8aff);
  border-radius: inherit;
  transition: width .3s ease;
`;

const ProjectBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const ProgressText = styled.span`
  font-size: 9px;
  color: #a99aff;
  font-weight: 800;
`;

const Tag = styled.span`
  padding: 5px 8px;
  border-radius: 7px;
  background: ${({ $tone }) =>
    $tone === "green"
      ? "rgba(70,210,145,.13)"
      : "rgba(120,105,255,.15)"};
  color: ${({ $tone }) =>
    $tone === "green" ? "#70dcb5" : "#b5a7ff"};
  font-size: 8px;
  font-weight: 850;
  white-space: nowrap;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Module = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;
  text-align: left;
  border: 1px solid #293750;
  border-radius: 16px;
  padding: 12px 10px;
  background: #131e33;
  min-width: 0;
  cursor: pointer;

  &:hover {
    border-color: #8878ff;
    background: #192640;
  }
`;

const ModuleIcon = styled.div`
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  font-size: 18px;
`;

const ModuleName = styled.div`
  font-size: 10px;
  font-weight: 850;
  color: #e7edfa;
`;

const ModuleDesc = styled.div`
  margin-top: 4px;
  font-size: 8px;
  color: #8997b0;
  line-height: 1.4;
`;

const InboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #293750;

  &:last-child {
    border-bottom: 0;
  }
`;

const InboxIcon = styled.div`
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #24254a;
  flex-shrink: 0;
`;

const InboxTitle = styled.div`
  font-size: 11px;
  font-weight: 750;
  color: #e4eaf6;
  overflow-wrap: anywhere;
`;

const InboxMeta = styled.div`
  font-size: 9px;
  color: #8794ab;
  margin-top: 4px;
`;

const InboxBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const Empty = styled.div`
  padding: 21px 5px;
  color: #8997b0;
  text-align: center;
  font-size: 11px;
  line-height: 1.6;
`;

const StatusMessage = styled.div`
  padding: 13px;
  border-radius: 12px;
  background: ${({ $error }) =>
    $error ? "rgba(255,100,100,.09)" : "#192640"};
  border: 1px solid ${({ $error }) =>
    $error ? "rgba(255,100,100,.25)" : "#293750"};
  color: ${({ $error }) =>
    $error ? "#ff9999" : "#aab6cc"};
  font-size: 11px;
  line-height: 1.5;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 17px;
`;

const LogoutButton = styled.button`
  border: 1px solid #49364a;
  background: #251d30;
  color: #ff9999;
  border-radius: 11px;
  padding: 9px 13px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: #382438;
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;

const ToastMessage = styled.div`
  position: fixed;
  z-index: 120;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: #26344d;
  border: 1px solid #43516c;
  border-radius: 12px;
  padding: 11px 15px;
  font-size: 10px;
  max-width: calc(100% - 30px);
  text-align: center;
`;

/* =========================
   LIFEOS MODULES
========================= */

const modules = [
  {
    name: "Projects",
    desc: "Manage your projects",
    icon: "📂",
    bg: "#fff1e9",
    href: "/dashboard/projects",
  },
  {
    name: "Universal Inbox",
    desc: "Capture everything",
    icon: "📥",
    bg: "#eeedff",
    href: "/dashboard/inbox",
  },
  {
    name: "Calendar",
    desc: "Events and time blocks",
    icon: "📅",
    bg: "#e8f5ff",
    href: "/dashboard/calendar",
  },
  {
    name: "Life Areas",
    desc: "Organise life categories",
    icon: "🌐",
    bg: "#f0efff",
    href: "/dashboard/life-areas",
  },
  {
    name: "Routines & Habits",
    desc: "Daily consistency",
    icon: "🔁",
    bg: "#fff6df",
    href: "/dashboard/routines",
  },
  {
    name: "Goals & Vision",
    desc: "Your bigger picture",
    icon: "🎯",
    bg: "#ffeef1",
    href: "/dashboard/goals",
  },
  {
    name: "Finances",
    desc: "Bills, budgets and income",
    icon: "💰",
    bg: "#e9f8f0",
    href: "/dashboard/finances",
  },
  {
    name: "Notes & Knowledge",
    desc: "Ideas and information",
    icon: "📝",
    bg: "#e8f5ff",
    href: "/dashboard/notes",
  },
  {
    name: "Reports & Reviews",
    desc: "Progress and insights",
    icon: "📊",
    bg: "#f2efff",
    href: "/dashboard/reports",
  },
  {
    name: "Settings",
    desc: "Profile and preferences",
    icon: "⚙️",
    bg: "#f0f2f6",
    href: "/dashboard/settings",
  },
];

/* =========================
   PROJECT HELPERS
========================= */

// A project is completed if its completed flag
// or its status indicates completion.
function isProjectCompleted(project) {
  return (
    project.completed === true ||
    project.status?.toLowerCase() === "completed"
  );
}

// Supports common project title field names.
function getProjectName(project) {
  return (
    project.name ||
    project.title ||
    project.projectName ||
    "Untitled project"
  );
}

// Uses saved project progress rather than task calculations.
function getProjectProgress(project) {
  if (isProjectCompleted(project)) return 100;

  const value =
    project.progress ??
    project.progressPercentage ??
    project.completionPercentage ??
    0;

  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.min(100, Math.max(0, number));
}

function getProjectType(project) {
  const type = project.projectType || project.type || "";

  if (
    type.toLowerCase() === "continuous" ||
    type.toLowerCase() === "ongoing"
  ) {
    return "Continuous";
  }

  if (type.toLowerCase() === "one-off") {
    return "One-off";
  }

  return type || "Project";
}

/* =========================
   HOME TAB
========================= */

export default function HomeTab() {
  const router = useRouter();

  /* STATE */

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [inbox, setInbox] = useState([]);

  const [projectsLoading, setProjectsLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(true);

  const [projectsError, setProjectsError] = useState("");
  const [inboxError, setInboxError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState("");

  /* AUTH LISTENER */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* FIRESTORE LISTENERS */

  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      setInbox([]);
      setProjectsLoading(false);
      setInboxLoading(false);
      return;
    }

    setProjectsLoading(true);
    setInboxLoading(true);
    setProjectsError("");
    setInboxError("");

    const projectsRef = collection(
      db,
      "users",
      user.uid,
      "projects"
    );

    const inboxRef = collection(
      db,
      "users",
      user.uid,
      "inbox"
    );

    const unsubscribeProjects = onSnapshot(
      projectsRef,
      (snapshot) => {
        setProjects(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        setProjectsLoading(false);
        setProjectsError("");
      },
      (error) => {
        console.error("Projects loading error:", error);
        setProjectsError(
          "Unable to load your projects. Please refresh and try again."
        );
        setProjectsLoading(false);
      }
    );

    const unsubscribeInbox = onSnapshot(
      inboxRef,
      (snapshot) => {
        setInbox(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        setInboxLoading(false);
        setInboxError("");
      },
      (error) => {
        console.error("Inbox loading error:", error);
        setInboxError(
          "Unable to load your inbox. Please try again."
        );
        setInboxLoading(false);
      }
    );

    return () => {
      unsubscribeProjects();
      unsubscribeInbox();
    };
  }, [user?.uid]);

  /* TOAST */

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message) {
    setToast(message);
  }

  /* DATE */

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  /* PROJECT CALCULATIONS */

  const completedProjects = useMemo(
    () => projects.filter(isProjectCompleted),
    [projects]
  );

  const activeProjects = useMemo(
    () => projects.filter(
      (project) => !isProjectCompleted(project)
    ),
    [projects]
  );

  const totalProjects = projects.length;

  const projectProgress = useMemo(() => {
    if (!totalProjects) return 0;

    const totalProgress = projects.reduce(
      (sum, project) => sum + getProjectProgress(project),
      0
    );

    return Math.round(totalProgress / totalProjects);
  }, [projects, totalProjects]);

  const recentActiveProjects = useMemo(() => {
    return [...activeProjects]
      .sort((a, b) => {
        const dateA =
          a.updatedAt?.toMillis?.() ||
          a.createdAt?.toMillis?.() ||
          0;

        const dateB =
          b.updatedAt?.toMillis?.() ||
          b.createdAt?.toMillis?.() ||
          0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [activeProjects]);

  const recentCompletedProjects = useMemo(() => {
    return [...completedProjects]
      .sort((a, b) => {
        const dateA =
          a.updatedAt?.toMillis?.() ||
          a.createdAt?.toMillis?.() ||
          0;

        const dateB =
          b.updatedAt?.toMillis?.() ||
          b.createdAt?.toMillis?.() ||
          0;

        return dateB - dateA;
      })
      .slice(0, 3);
  }, [completedProjects]);

  /* NAVIGATION */

  function goTo(href) {
    router.push(href);
  }

  /* LOGOUT */

  async function handleLogout() {
    if (loggingOut) return;

    const result = await Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to log out of LIFEOS?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#7059f5",
      cancelButtonColor: "#35425a",
      background: "#131e33",
      color: "#f8faff",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      notify("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  /* LOADING */

  if (authLoading) {
    return (
      <Content>
        <Empty>Loading your LIFEOS account...</Empty>
      </Content>
    );
  }

  if (!user) {
    return (
      <Content>
        <Card>
          <Empty>
            You are not logged in. Please sign in to access your dashboard.
          </Empty>

          <LinkButton onClick={() => router.replace("/login")}>
            Go to login →
          </LinkButton>
        </Card>
      </Content>
    );
  }

  /* PROJECT CARD */

  function renderProject(project) {
    const completed = isProjectCompleted(project);
    const progress = getProjectProgress(project);

    return (
      <ProjectCard key={project.id}>
        <ProjectTop>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ProjectName>
              {getProjectName(project)}
            </ProjectName>

            <ProjectMeta>
              {project.area || project.lifeArea || "General"} 
              {" · "}
              {getProjectType(project)}
              {project.dueDate
                ? ` · Due ${project.dueDate}`
                : ""}
            </ProjectMeta>
          </div>

          <Tag $tone={completed ? "green" : "purple"}>
            {completed ? "COMPLETED" : "ACTIVE"}
          </Tag>
        </ProjectTop>

        <ProjectTrack>
          <ProjectFill $width={progress} />
        </ProjectTrack>

        <ProjectBottom>
          <ProgressText>
            {progress}% complete
          </ProgressText>

          <LinkButton
            onClick={() => goTo("/dashboard/projects")}
          >
            View project →
          </LinkButton>
        </ProjectBottom>
      </ProjectCard>
    );
  }

  /* DASHBOARD */

  return (
    <Content>

      {/* HEADER */}

      <DashboardHeader>
        <LogoutButton
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "↪ Log out"}
        </LogoutButton>
      </DashboardHeader>

      {/* PROJECT OVERVIEW */}

      <Section>
        <Hero>
          <HeroTop>
            <HeroLabel>YOUR PROJECTS AT A GLANCE</HeroLabel>
            <HeroLabel>{todayLabel.toUpperCase()}</HeroLabel>
          </HeroTop>

          <HeroNumber>
            {projectsLoading ? "..." : `${projectProgress}%`}
          </HeroNumber>

          <div style={{ fontSize: 11, color: "#e5e3ff" }}>
            Overall project completion
          </div>

          <Track>
            <Fill $width={projectProgress} />
          </Track>

          <HeroFoot>
            <span>{completedProjects.length} completed</span>
            <span>{activeProjects.length} active</span>
          </HeroFoot>
        </Hero>
      </Section>

      {/* PROJECT STATISTICS */}

      <Section>
        <Grid3>
          <Stat>
            <StatIcon>📂</StatIcon>
            <StatNumber>
              {projectsLoading ? "..." : totalProjects}
            </StatNumber>
            <StatLabel>Total projects</StatLabel>
          </Stat>

          <Stat>
            <StatIcon>🚀</StatIcon>
            <StatNumber>
              {projectsLoading ? "..." : activeProjects.length}
            </StatNumber>
            <StatLabel>Active projects</StatLabel>
          </Stat>

          <Stat>
            <StatIcon>🏆</StatIcon>
            <StatNumber>
              {projectsLoading ? "..." : completedProjects.length}
            </StatNumber>
            <StatLabel>Completed</StatLabel>
          </Stat>
        </Grid3>
      </Section>

      {/* QUICK ACTIONS */}

      <Section>
        <SectionHead>
          <SectionTitle>Quick actions</SectionTitle>
        </SectionHead>

        <QuickGrid>
          {[
            ["📂", "Project", "#fff1e9", "/dashboard/projects"],
            ["📥", "Inbox", "#eeedff", "/dashboard/inbox"],
            // ["🎯", "Goal", "#ffeef1", "/dashboard/goals"],
            // ["📝", "Note", "#e9f8f0", "/dashboard/notes"],
          ].map(([icon, label, bg, route]) => (
            <Quick
              key={label}
              onClick={() => goTo(route)}
            >
              <QuickIcon $bg={bg}>
                {icon}
              </QuickIcon>

              <QuickLabel>{label}</QuickLabel>
            </Quick>
          ))}
        </QuickGrid>
      </Section>

      {/* ACTIVE PROJECTS */}

      <Section>
        <SectionHead>
          <SectionTitle>
            Active projects ({activeProjects.length})
          </SectionTitle>

          <LinkButton
            onClick={() => goTo("/dashboard/projects")}
          >
            All projects →
          </LinkButton>
        </SectionHead>

        <Card>
          {projectsLoading ? (
            <Empty>Loading your projects...</Empty>
          ) : projectsError ? (
            <StatusMessage $error>
              {projectsError}
            </StatusMessage>
          ) : activeProjects.length === 0 ? (
            <Empty>
              You have no active projects at the moment.
              <br />
              Start something new and bring your ideas to life.
              <div style={{ marginTop: 12 }}>
                <LinkButton
                  onClick={() => goTo("/dashboard/projects")}
                >
                  Go to Projects →
                </LinkButton>
              </div>
            </Empty>
          ) : (
            recentActiveProjects.map(renderProject)
          )}
        </Card>
      </Section>

      {/* RECENT COMPLETED PROJECTS */}

      <Section>
        <SectionHead>
          <SectionTitle>
            Recently completed ({completedProjects.length})
          </SectionTitle>

          <LinkButton
            onClick={() => goTo("/dashboard/projects")}
          >
            View all →
          </LinkButton>
        </SectionHead>

        <Card>
          {projectsLoading ? (
            <Empty>Loading completed projects...</Empty>
          ) : projectsError ? (
            <StatusMessage $error>
              {projectsError}
            </StatusMessage>
          ) : recentCompletedProjects.length === 0 ? (
            <Empty>
              Completed projects will appear here.
            </Empty>
          ) : (
            recentCompletedProjects.map(renderProject)
          )}
        </Card>
      </Section>

      {/* UNIVERSAL INBOX */}

      <Section>
        <SectionHead>
          <SectionTitle>
            Universal Inbox ({inbox.length})
          </SectionTitle>

          <LinkButton
            onClick={() => goTo("/dashboard/inbox")}
          >
            Open inbox →
          </LinkButton>
        </SectionHead>

        <Card>
          {inboxLoading ? (
            <Empty>Loading your inbox...</Empty>
          ) : inboxError ? (
            <StatusMessage $error>
              {inboxError}
            </StatusMessage>
          ) : inbox.length === 0 ? (
            <Empty>
              Your inbox is clear.
              <br />
              Capture ideas and information whenever they come to mind.
            </Empty>
          ) : (
            inbox.slice(0, 4).map((item) => (
              <InboxRow key={item.id}>
                <InboxIcon>📥</InboxIcon>

                <InboxBody>
                  <InboxTitle>
                    {item.title || "Untitled item"}
                  </InboxTitle>

                  <InboxMeta>
                    {item.type || "Inbox item"}
                  </InboxMeta>
                </InboxBody>

                <Tag>INBOX</Tag>
              </InboxRow>
            ))
          )}
        </Card>
      </Section>

      {/* ALL LIFEOS MODULES */}

      <Section>
        <SectionHead>
          <SectionTitle>All LIFEOS modules</SectionTitle>
        </SectionHead>

        <ModuleGrid>
          {modules.map((module) => (
            <Module
              key={module.name}
              onClick={() => goTo(module.href)}
            >
              <ModuleIcon $bg={module.bg}>
                {module.icon}
              </ModuleIcon>

              <div>
                <ModuleName>{module.name}</ModuleName>
                <ModuleDesc>{module.desc}</ModuleDesc>
              </div>
            </Module>
          ))}
        </ModuleGrid>
      </Section>

      {/* TOAST */}

      {toast && (
        <ToastMessage>
          {toast}
        </ToastMessage>
      )}

    </Content>
  );
}
