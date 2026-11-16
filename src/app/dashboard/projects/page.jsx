
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import styled from "styled-components";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "@/firebaseConfig";
// import ProjectModal from "@/components/ProjectModal";

// /* =========================
//    HELPERS
// ========================= */

// function getToday() {
//   const date = new Date();

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function formatDate(dateString) {
//   if (!dateString) return "No deadline";

//   return new Date(`${dateString}T00:00:00`).toLocaleDateString(
//     "en-US",
//     {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }
//   );
// }

// /* =========================
//    STYLES
// ========================= */

// const Page = styled.div`
//   width: 100%;
//   color: #f8faff;
//   padding-bottom: 25px;
// `;

// const Heading = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 18px;
// `;

// const Title = styled.h1`
//   font-size: 21px;
//   font-weight: 900;
//   letter-spacing: -0.8px;
//   margin: 0;
// `;

// const Subtitle = styled.p`
//   color: #8997b0;
//   font-size: 10px;
//   margin: 5px 0 0;
// `;

// const Primary = styled.button`
//   border: 0;
//   border-radius: 12px;
//   padding: 12px 14px;
//   background: linear-gradient(110deg, #7059f5, #477eea);
//   color: white;
//   font-size: 11px;
//   font-weight: 850;
//   cursor: pointer;
// `;

// const Search = styled.input`
//   width: 100%;
//   border: 1px solid #293750;
//   background: #131e33 !important;
//   color: white !important;
//   border-radius: 12px;
//   padding: 13px;
//   outline: none;
//   font-size: 11px;
//   margin-bottom: 15px;

//   &::placeholder {
//     color: #68758d;
//   }

//   &:focus {
//     border-color: #8878ff;
//   }
// `;

// const Stats = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 9px;
//   margin-bottom: 18px;
// `;

// const Stat = styled.div`
//   background: #131e33;
//   border: 1px solid #293750;
//   border-radius: 15px;
//   padding: 13px 10px;
// `;

// const StatNum = styled.div`
//   font-size: 21px;
//   font-weight: 900;
//   color: ${(p) => (p.$red ? "#ff7777" : "#f8faff")};
// `;

// const StatLabel = styled.div`
//   color: #8997b0;
//   font-size: 9px;
//   margin-top: 4px;
// `;

// const ProjectCard = styled.div`
//   background: #131e33;
//   border: 1px solid
//     ${(p) =>
//       p.$overdue
//         ? "rgba(255,80,80,.65)"
//         : "#293750"};
//   border-radius: 16px;
//   padding: 14px;
//   margin-bottom: 11px;

//   box-shadow: ${(p) =>
//     p.$overdue
//       ? "0 0 0 1px rgba(255,80,80,.12)"
//       : "none"};
// `;

// const ProjectHeader = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: flex-start;
// `;

// const ProjectMain = styled.div`
//   flex: 1;
//   min-width: 0;
// `;

// const ProjectTitle = styled.div`
//   font-size: 13px;
//   font-weight: 900;
//   color: #e4eaf6;
//   overflow-wrap: anywhere;
// `;

// const Details = styled.div`
//   font-size: 10px;
//   color: #8997b0;
//   line-height: 1.5;
//   margin-top: 5px;
//   overflow-wrap: anywhere;
// `;

// const Tags = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 6px;
//   margin-top: 11px;
// `;

// const Tag = styled.span`
//   background: ${(p) =>
//     p.$red
//       ? "rgba(255,100,100,.13)"
//       : p.$green
//       ? "rgba(70,210,145,.13)"
//       : "rgba(120,105,255,.15)"};

//   color: ${(p) =>
//     p.$red
//       ? "#ff9999"
//       : p.$green
//       ? "#70dcb5"
//       : "#b5a7ff"};

//   padding: 5px 8px;
//   border-radius: 7px;
//   font-size: 8px;
//   font-weight: 850;
// `;

// const PriorityTag = styled.span`
//   display: inline-flex;
//   align-items: center;
//   gap: 4px;
//   padding: 5px 8px;
//   border-radius: 7px;
//   font-size: 8px;
//   font-weight: 900;
//   text-transform: uppercase;

//   background: ${(p) =>
//     p.$priority === "critical"
//       ? "rgba(255, 65, 65, 0.16)"
//       : p.$priority === "high"
//       ? "rgba(255, 155, 65, 0.16)"
//       : p.$priority === "low"
//       ? "rgba(70, 210, 145, 0.13)"
//       : "rgba(75, 145, 255, 0.15)"};

//   color: ${(p) =>
//     p.$priority === "critical"
//       ? "#ff7777"
//       : p.$priority === "high"
//       ? "#ffb36b"
//       : p.$priority === "low"
//       ? "#70dcb5"
//       : "#82b5ff"};
// `;

// const Actions = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 7px;
//   margin-top: 12px;
//   padding-top: 11px;
//   border-top: 1px solid #293750;
// `;

// const Action = styled.button`
//   border: 1px solid #35425a;
//   background: #192640;
//   color: ${(p) =>
//     p.$danger ? "#ff9999" : "#c2cde0"};
//   border-radius: 9px;
//   padding: 8px 10px;
//   font-size: 9px;
//   font-weight: 800;
//   cursor: pointer;
// `;

// const Section = styled.div`
//   margin-top: 14px;
//   padding-top: 12px;
//   border-top: 1px solid #293750;
// `;

// const SectionHead = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 8px;
//   margin-bottom: 9px;
// `;

// const SectionTitle = styled.div`
//   font-size: 10px;
//   color: #c2cde0;
//   font-weight: 850;
// `;

// const TaskCard = styled.div`
//   background: #0c1425;
//   border: 1px solid
//     ${(p) =>
//       p.$overdue
//         ? "rgba(255,80,80,.6)"
//         : "#293750"};
//   border-radius: 12px;
//   padding: 11px;
//   margin-top: 8px;
// `;

// const TaskRow = styled.div`
//   display: flex;
//   gap: 9px;
//   align-items: flex-start;
// `;

// const TaskText = styled.div`
//   flex: 1;
//   min-width: 0;
//   font-size: 11px;
//   font-weight: 800;

//   color: ${(p) =>
//     p.$overdue
//       ? "#ff7777"
//       : p.$done
//       ? "#77849b"
//       : "#e4eaf6"};

//   text-decoration: ${(p) =>
//     p.$done ? "line-through" : "none"};

//   overflow-wrap: anywhere;
// `;

// const Small = styled.button`
//   border: 0;
//   background: transparent;
//   color: ${(p) =>
//     p.$danger ? "#ff9999" : "#a99aff"};
//   font-size: 9px;
//   padding: 4px;
//   cursor: pointer;
// `;

// const Subtask = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 7px;
//   padding: 7px 0;
//   border-bottom: 1px solid rgba(41, 55, 80, 0.55);
//   font-size: 9px;

//   color: ${(p) =>
//     p.$done ? "#77849b" : "#dce5f5"};

//   text-decoration: ${(p) =>
//     p.$done ? "line-through" : "none"};
// `;

// const Check = styled.button`
//   width: 17px;
//   height: 17px;
//   flex-shrink: 0;
//   border-radius: 5px;

//   border: 1px solid
//     ${(p) =>
//       p.$done ? "#7965f4" : "#53617a"};

//   background: ${(p) =>
//     p.$done ? "#6b61ee" : "#17243a"};

//   color: white;
//   font-size: 10px;
//   cursor: pointer;
// `;

// const InlineForm = styled.form`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 7px;
//   margin-top: 9px;
// `;

// const Field = styled.input`
//   min-width: 0;
//   flex: 1;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   color-scheme: dark;
//   border-radius: 9px;
//   padding: 9px;
//   outline: none;
//   font-size: 10px;
// `;

// const Select = styled.select`
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   color-scheme: dark;
//   border-radius: 9px;
//   padding: 9px;
//   outline: none;
//   font-size: 10px;
// `;

// const Empty = styled.div`
//   padding: 35px 15px;
//   text-align: center;
//   background: #131e33;
//   border: 1px dashed #35425a;
//   border-radius: 16px;
//   color: #8997b0;
//   font-size: 11px;
// `;


// const FilterButtons = styled.div`
//   display: flex;
//   gap: 9px;
//   margin-bottom: 15px;
// `;

// const FilterButton = styled.button`
//   flex: 1;
//   border: 1px solid
//     ${(p) => (p.$active ? "#7965f4" : "#293750")};

//   background: ${(p) =>
//     p.$active
//       ? "rgba(121, 101, 244, 0.16)"
//       : "#131e33"};

//   color: ${(p) =>
//     p.$active ? "#b5a7ff" : "#8997b0"};

//   border-radius: 11px;
//   padding: 11px 12px;
//   font-size: 10px;
//   font-weight: 850;
//   cursor: pointer;
//   transition: 0.2s;

//   &:hover {
//     border-color: #7965f4;
//   }
// `;

// /* =========================
//    MAIN COMPONENT
// ========================= */

// export default function ProjectsTab() {
//   const [user, setUser] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [projectFilter, setProjectFilter] = useState("active");

//   const [showProjectModal, setShowProjectModal] =
//     useState(false);

//   const [editingProject, setEditingProject] =
//     useState(null);

//   const [expanded, setExpanded] = useState({});
//   const [taskForms, setTaskForms] = useState({});
//   const [subtaskForms, setSubtaskForms] = useState({});

//   const today = getToday();

//   /* AUTH */

//   useEffect(() => {
//     return onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//   }, []);

//   /* FIRESTORE PROJECTS LISTENER */

//   useEffect(() => {
//     if (!user) {
//       setProjects([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const projectsRef = collection(
//       db,
//       "users",
//       user.uid,
//       "projects"
//     );

//     return onSnapshot(
//       projectsRef,
//       (snapshot) => {
//         const data = snapshot.docs.map((document) => ({
//           id: document.id,
//           ...document.data(),
//         }));

//         data.sort(
//           (a, b) =>
//             (b.createdAt?.toMillis?.() || 0) -
//             (a.createdAt?.toMillis?.() || 0)
//         );

//         setProjects(data);
//         setLoading(false);
//       },
//       (err) => {
//         console.error("Projects listener error:", err);

//         setError(
//           "Unable to load projects. Check your connection and Firestore permissions."
//         );

//         setLoading(false);
//       }
//     );
//   }, [user]);

//   /* SEARCH */

// //   const visibleProjects = useMemo(() => {
// //     const query = search.trim().toLowerCase();

// //     if (!query) return projects;

// //     return projects.filter((project) => {
// //       const projectMatches = [
// //         project.title,
// //         project.description,
// //       ]
// //         .filter(Boolean)
// //         .some((value) =>
// //           String(value).toLowerCase().includes(query)
// //         );

// //       const taskMatches = (project.tasks || []).some(
// //         (task) =>
// //           [task.title, task.details]
// //             .filter(Boolean)
// //             .some((value) =>
// //               String(value).toLowerCase().includes(query)
// //             )
// //       );

// //       return projectMatches || taskMatches;
// //     });
// //   }, [projects, search]);


// const visibleProjects = useMemo(() => {
//   const query = search.trim().toLowerCase();

//   return projects.filter((project) => {
//     // Apply active/completed filter
//     const statusMatches =
//       projectFilter === "active"
//         ? !project.done
//         : !!project.done;

//     if (!statusMatches) return false;

//     // Apply search filter
//     if (!query) return true;

//     const projectMatches = [
//       project.title,
//       project.description,
//     ]
//       .filter(Boolean)
//       .some((value) =>
//         String(value).toLowerCase().includes(query)
//       );

//     const taskMatches = (project.tasks || []).some(
//       (task) =>
//         [task.title, task.details]
//           .filter(Boolean)
//           .some((value) =>
//             String(value).toLowerCase().includes(query)
//           )
//     );

//     return projectMatches || taskMatches;
//   });
// }, [projects, search, projectFilter]);


//   /* OVERDUE PROJECT CHECK */

//   function overdueProject(project) {
//     const projectType = project.type || "oneOff";

//     const projectLate =
//       projectType === "oneOff" &&
//       project.deadlineDate &&
//       project.deadlineDate < today &&
//       !project.done;

//     const taskLate = (project.tasks || []).some(
//       (task) =>
//         task.type === "oneOff" &&
//         !task.done &&
//         task.deadlineDate &&
//         task.deadlineDate < today
//     );

//     return Boolean(projectLate || taskLate);
//   }

//   /* DELETE PROJECT */

//   async function deleteProject(project) {
//     if (!user) return;

//     const confirmed = window.confirm(
//       `Delete project "${project.title}" and all its tasks?`
//     );

//     if (!confirmed) return;

//     try {
//       await deleteDoc(
//         doc(
//           db,
//           "users",
//           user.uid,
//           "projects",
//           project.id
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       setError("Could not delete project.");
//     }
//   }

//   /* SAVE NEW TASK */

//   async function saveTask(project, e) {
//     e.preventDefault();

//     if (!user) return;

//     const form = taskForms[project.id] || {};

//     const type = form.type || "oneOff";

//     if (!form.title?.trim()) {
//       setError("Enter a task title.");
//       return;
//     }

//     if (
//       type === "oneOff" &&
//       !form.deadlineDate
//     ) {
//       setError(
//         "A deadline date is required for a one-off task."
//       );
//       return;
//     }

//     setError("");

//     // const newTask = {
//     //   id: crypto.randomUUID(),
//     //   title: form.title.trim(),
//     //   details: (form.details || "").trim(),
//     //   type,
//     //   deadlineDate:
//     //     type === "oneOff"
//     //       ? form.deadlineDate
//     //       : "",
//     //   done: false,
//     //   subtasks: [],
//     //   createdAt: new Date().toISOString(),
//     //   updatedAt: new Date().toISOString(),
//     // };

// const newTask = {
//   id: crypto.randomUUID(),
//   title: form.title.trim(),
//   details: (form.details || "").trim(),
//   type,
//   priority: form.priority || "medium",
//   deadlineDate:
//     type === "oneOff"
//       ? form.deadlineDate
//       : "",
//   done: false,
//   subtasks: [],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

//     const tasks = [
//       ...(project.tasks || []),
//       newTask,
//     ];

//     try {
//       await updateDoc(
//         doc(
//           db,
//           "users",
//           user.uid,
//           "projects",
//           project.id
//         ),
//         {
//           tasks,
//           updatedAt: serverTimestamp(),
//         }
//       );

//     setTaskForms((prev) => ({
//   ...prev,
//   [project.id]: {
//     title: "",
//     details: "",
//     type: "oneOff",
//     priority: "medium",
//     deadlineDate: "",
//   },
// }));

//     } catch (err) {
//       console.error(err);
//       setError("Unable to save task.");
//     }
//   }

//   /* UPDATE TASK */

//   async function updateTask(
//     project,
//     taskId,
//     changes
//   ) {
//     if (!user) return;

//     const tasks = (project.tasks || []).map((task) =>
//       task.id === taskId
//         ? {
//             ...task,
//             ...changes,
//             updatedAt: new Date().toISOString(),
//           }
//         : task
//     );

//     try {
//       await updateDoc(
//         doc(
//           db,
//           "users",
//           user.uid,
//           "projects",
//           project.id
//         ),
//         {
//           tasks,
//           updatedAt: serverTimestamp(),
//         }
//       );
//     } catch (err) {
//       console.error(err);
//       setError("Unable to update task.");
//     }
//   }

//   /* EDIT TASK */

//   async function editTask(project, task) {
//     const title = window.prompt(
//       "Task title:",
//       task.title
//     );

//     if (title === null || !title.trim()) return;

//     const details = window.prompt(
//       "Task details (optional):",
//       task.details || ""
//     );

//     if (details === null) return;

//     let deadlineDate = task.deadlineDate || "";

//     if (task.type === "oneOff") {
//       const enteredDate = window.prompt(
//         "Deadline date (YYYY-MM-DD):",
//         deadlineDate
//       );

//       if (enteredDate === null) return;

//       if (!enteredDate.trim()) {
//         setError(
//           "One-off tasks must have a deadline date."
//         );
//         return;
//       }

//       deadlineDate = enteredDate.trim();
//     }

//     await updateTask(project, task.id, {
//       title: title.trim(),
//       details: details.trim(),
//       deadlineDate:
//         task.type === "oneOff"
//           ? deadlineDate
//           : "",
//     });
//   }

//   /* DELETE TASK */

//   async function deleteTask(project, task) {
//     if (!user) return;

//     const confirmed = window.confirm(
//       `Delete task "${task.title}" and its subtasks?`
//     );

//     if (!confirmed) return;

//     const tasks = (project.tasks || []).filter(
//       (item) => item.id !== task.id
//     );

//     try {
//       await updateDoc(
//         doc(
//           db,
//           "users",
//           user.uid,
//           "projects",
//           project.id
//         ),
//         {
//           tasks,
//           updatedAt: serverTimestamp(),
//         }
//       );
//     } catch (err) {
//       console.error(err);
//       setError("Unable to delete task.");
//     }
//   }

//   /* ADD SUBTASK */

//   async function addSubtask(project, task, e) {
//     e.preventDefault();

//     const key = `${project.id}_${task.id}`;

//     const title = subtaskForms[key] || "";

//     if (!title.trim()) return;

//     const subtasks = [
//       ...(task.subtasks || []),
//       {
//         id: crypto.randomUUID(),
//         title: title.trim(),
//         done: false,
//         createdAt: new Date().toISOString(),
//       },
//     ];

//     await updateTask(project, task.id, {
//       subtasks,
//     });

//     setSubtaskForms((prev) => ({
//       ...prev,
//       [key]: "",
//     }));
//   }

//   /* EDIT SUBTASK */

//   async function editSubtask(
//     project,
//     task,
//     subtask
//   ) {
//     const title = window.prompt(
//       "Subtask title:",
//       subtask.title
//     );

//     if (title === null || !title.trim()) return;

//     const subtasks = (task.subtasks || []).map(
//       (item) =>
//         item.id === subtask.id
//           ? {
//               ...item,
//               title: title.trim(),
//             }
//           : item
//     );

//     await updateTask(project, task.id, {
//       subtasks,
//     });
//   }

//   /* DELETE SUBTASK */

//   async function removeSubtask(
//     project,
//     task,
//     subtask
//   ) {
//     const confirmed = window.confirm(
//       `Delete subtask "${subtask.title}"?`
//     );

//     if (!confirmed) return;

//     const subtasks = (task.subtasks || []).filter(
//       (item) => item.id !== subtask.id
//     );

//     await updateTask(project, task.id, {
//       subtasks,
//     });
//   }

//   /* PROJECT COMPLETION */

//   async function toggleProjectDone(project) {
//     if (!user) return;

//     try {
//       await updateDoc(
//         doc(
//           db,
//           "users",
//           user.uid,
//           "projects",
//           project.id
//         ),
//         {
//           done: !project.done,
//           updatedAt: serverTimestamp(),
//         }
//       );
//     } catch (err) {
//       console.error(err);
//       setError("Unable to update project status.");
//     }
//   }

//   /* =========================
//      RENDER
//   ========================= */

//   return (
//     <Page>
//       <Heading>
//         <div>
//           <Title>My Projects</Title>

//           <Subtitle>
//             Plan projects, manage tasks, and track deadlines.
//           </Subtitle>
//         </div>

//         <Primary
//           onClick={() => {
//             setEditingProject(null);
//             setShowProjectModal(true);
//           }}
//         >
//           ＋ Add project
//         </Primary>
//       </Heading>

//       <Stats>
//         <Stat>
//           <StatNum>{projects.length}</StatNum>
//           <StatLabel>Total projects</StatLabel>
//         </Stat>

//         <Stat>
//           <StatNum>
//             {
//               projects.filter(
//                 (project) => !project.done
//               ).length
//             }
//           </StatNum>

//           <StatLabel>Active projects</StatLabel>
//         </Stat>

//         <Stat>
//           <StatNum $red>
//             {
//               projects.filter(overdueProject).length
//             }
//           </StatNum>

//           <StatLabel>Overdue projects</StatLabel>
//         </Stat>
//       </Stats>

//       <Search
//         type="search"
//         placeholder="⌕ Search projects and tasks..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
// <FilterButtons>
//   <FilterButton
//     $active={projectFilter === "active"}
//     onClick={() => setProjectFilter("active")}
//   >
//     Active ({projects.filter((p) => !p.done).length})
//   </FilterButton>

//   <FilterButton
//     $active={projectFilter === "completed"}
//     onClick={() => setProjectFilter("completed")}
//   >
//     Completed ({projects.filter((p) => p.done).length})
//   </FilterButton>
// </FilterButtons>

//       {error && (
//         <div
//           style={{
//             color: "#ff9999",
//             fontSize: 11,
//             marginBottom: 12,
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <Empty>Loading projects...</Empty>
//       ) : !user ? (
//         <Empty>
//           Please sign in to access your projects.
//         </Empty>
//     ) : visibleProjects.length === 0 ? (
//   <Empty>
//     {projectFilter === "active"
//       ? "No active projects. Add a new project or check your completed projects."
//       : "No completed projects yet."}
//   </Empty>
//       ) : (
//         visibleProjects.map((project) => {
//           const tasks = project.tasks || [];

//           const late = overdueProject(project);

//           const isExpanded = !!expanded[project.id];

//           const projectType =
//             project.type || "oneOff";

//           const completedTasks = tasks.filter(
//             (task) =>
//               task.type === "oneOff" && task.done
//           ).length;

//           const continuousTasks = tasks.filter(
//             (task) => task.type === "continuous"
//           ).length;

//           return (
//             <ProjectCard
//               key={project.id}
//               $overdue={late}
//             >
//               <ProjectHeader>
//                 <ProjectMain>
//                   <ProjectTitle>
//                     {project.title}
//                   </ProjectTitle>

//                   {project.description && (
//                     <Details>
//                       {project.description}
//                     </Details>
//                   )}

//                   <Tags>
//                     <Tag>
//                       {projectType === "continuous"
//                         ? "∞ CONTINUOUS PROJECT"
//                         : "ONE-OFF PROJECT"}
//                     </Tag>
                    

//                     {projectType === "oneOff" && (
//                       <Tag $red={late}>
//                         {`DEADLINE: ${formatDate(
//                           project.deadlineDate
//                         )}`}
//                       </Tag>
//                     )}

//                     {projectType === "continuous" && (
//                       <Tag>NO DEADLINE</Tag>
//                     )}

//                     {late && (
//                       <Tag $red>
//                         ⚑ OVERDUE
//                       </Tag>
//                     )}

//                     {project.done && (
//                       <Tag $green>
//                         COMPLETED
//                       </Tag>
//                     )}

//                     <Tag>
//                       {tasks.length} TASK(S)
//                     </Tag>
//                   </Tags>
//                 </ProjectMain>
//               </ProjectHeader>

//               <Actions>
//                 <Action
//                   onClick={() =>
//                     setExpanded((prev) => ({
//                       ...prev,
//                       [project.id]: !prev[project.id],
//                     }))
//                   }
//                 >
//                   {isExpanded
//                     ? "Hide tasks ▲"
//                     : "Manage tasks ▼"}
//                 </Action>

//                 <Action
//                   onClick={() => {
//                     setEditingProject(project);
//                     setShowProjectModal(true);
//                   }}
//                 >
//                   Edit project
//                 </Action>

//                 <Action
//                   $danger
//                   onClick={() => deleteProject(project)}
//                 >
//                   Delete
//                 </Action>

//                 {!project.done && (
//                   <Action
//                     onClick={() =>
//                       toggleProjectDone(project)
//                     }
//                   >
//                     ✓ Complete project
//                   </Action>
//                 )}

//                 {project.done && (
//                   <Action
//                     onClick={() =>
//                       toggleProjectDone(project)
//                     }
//                   >
//                     ↶ Reopen
//                   </Action>
//                 )}
//               </Actions>

//               {isExpanded && (
//                 <Section>
//                   <SectionHead>
//                     <SectionTitle>
//                       Tasks ({completedTasks} completed ·{" "}
//                       {continuousTasks} continuous)
//                     </SectionTitle>
//                   </SectionHead>

//                   {tasks.map((task) => {
//                     const taskType =
//                       task.type || "oneOff";

//                     const taskLate =
//                       taskType === "oneOff" &&
//                       !task.done &&
//                       task.deadlineDate &&
//                       task.deadlineDate < today;

//                     return (
//                       <TaskCard
//                         key={task.id}
//                         $overdue={taskLate}
//                       >
//                         <TaskRow>
//                           {taskType === "oneOff" && (
//                             <Check
//                               $done={task.done}
//                               onClick={() =>
//                                 updateTask(
//                                   project,
//                                   task.id,
//                                   {
//                                     done: !task.done,
//                                   }
//                                 )
//                               }
//                             >
//                               {task.done ? "✓" : ""}
//                             </Check>
//                           )}

//                           {taskType === "continuous" && (
//                             <span
//                               style={{
//                                 color: "#39b5f2",
//                                 fontSize: 14,
//                               }}
//                             >
//                               ∞
//                             </span>
//                           )}

//                           <TaskText
//                             $overdue={taskLate}
//                             $done={task.done}
//                           >
//                             {task.title}
//                           </TaskText>

//                           <Small
//                             onClick={() =>
//                               editTask(project, task)
//                             }
//                           >
//                             Edit
//                           </Small>

//                           <Small
//                             $danger
//                             onClick={() =>
//                               deleteTask(project, task)
//                             }
//                           >
//                             Delete
//                           </Small>
//                         </TaskRow>

//                         {task.details && (
//                           <Details>
//                             {task.details}
//                           </Details>
//                         )}

//                         <Tags>
//                           <Tag>
//                             {taskType === "continuous"
//                               ? "∞ CONTINUOUS TASK"
//                               : "ONE-OFF TASK"}
//                           </Tag>

//                           <PriorityTag
//   $priority={task.priority || "medium"}
// >
//   ● {(task.priority || "medium").toUpperCase()} PRIORITY
// </PriorityTag>

//                           {taskType === "oneOff" && (
//                             <Tag $red={taskLate}>
//                               {taskLate
//                                 ? "⚑ OVERDUE"
//                                 : `DUE ${formatDate(
//                                     task.deadlineDate
//                                   )}`}
//                             </Tag>
//                           )}

//                           {taskType === "oneOff" &&
//                             task.done && (
//                               <Tag $green>
//                                 COMPLETED
//                               </Tag>
//                             )}
//                         </Tags>

//                         <Section>
//                           <SectionHead>
//                             <SectionTitle>
//                               Subtasks (
//                               {
//                                 (task.subtasks || []).filter(
//                                   (subtask) =>
//                                     subtask.done
//                                 ).length
//                               }
//                               /
//                               {
//                                 (task.subtasks || []).length
//                               }
//                               )
//                             </SectionTitle>
//                           </SectionHead>

//                           {(task.subtasks || []).map(
//                             (subtask) => (
//                               <Subtask
//                                 key={subtask.id}
//                                 $done={subtask.done}
//                               >
//                                 <Check
//                                   $done={subtask.done}
//                                   onClick={() =>
//                                     updateTask(
//                                       project,
//                                       task.id,
//                                       {
//                                         subtasks: (
//                                           task.subtasks || []
//                                         ).map((item) =>
//                                           item.id ===
//                                           subtask.id
//                                             ? {
//                                                 ...item,
//                                                 done: !item.done,
//                                               }
//                                             : item
//                                         ),
//                                       }
//                                     )
//                                   }
//                                 >
//                                   {subtask.done
//                                     ? "✓"
//                                     : ""}
//                                 </Check>

//                                 <span
//                                   style={{
//                                     flex: 1,
//                                     overflowWrap:
//                                       "anywhere",
//                                   }}
//                                 >
//                                   {subtask.title}
//                                 </span>

//                                 <Small
//                                   onClick={() =>
//                                     editSubtask(
//                                       project,
//                                       task,
//                                       subtask
//                                     )
//                                   }
//                                 >
//                                   Edit
//                                 </Small>

//                                 <Small
//                                   $danger
//                                   onClick={() =>
//                                     removeSubtask(
//                                       project,
//                                       task,
//                                       subtask
//                                     )
//                                   }
//                                 >
//                                   ×
//                                 </Small>
//                               </Subtask>
//                             )
//                           )}

//                           <InlineForm
//                             onSubmit={(e) =>
//                               addSubtask(
//                                 project,
//                                 task,
//                                 e
//                               )
//                             }
//                           >
//                             <Field
//                               placeholder="Add a subtask..."
//                               value={
//                                 subtaskForms[
//                                   `${project.id}_${task.id}`
//                                 ] || ""
//                               }
//                               onChange={(e) =>
//                                 setSubtaskForms(
//                                   (prev) => ({
//                                     ...prev,
//                                     [`${project.id}_${task.id}`]:
//                                       e.target.value,
//                                   })
//                                 )
//                               }
//                             />

//                             <Primary type="submit">
//                               ＋ Add
//                             </Primary>
//                           </InlineForm>
//                         </Section>
//                       </TaskCard>
//                     );
//                   })}

//                   <InlineForm
//                     onSubmit={(e) =>
//                       saveTask(project, e)
//                     }
//                   >
//                     <Field
//                       placeholder="New task title"
//                       value={
//                         taskForms[project.id]?.title ||
//                         ""
//                       }
//                       onChange={(e) =>
//                         setTaskForms((prev) => ({
//                           ...prev,
//                           [project.id]: {
//                             ...prev[project.id],
//                             title: e.target.value,
//                             type:
//                               prev[project.id]?.type ||
//                               "oneOff",
//                           },
//                         }))
//                       }
//                     />

//                     <Select
//                       value={
//                         taskForms[project.id]?.type ||
//                         "oneOff"
//                       }
//                       onChange={(e) => {
//                         const type = e.target.value;

//                         setTaskForms((prev) => ({
//                           ...prev,
//                           [project.id]: {
//                             ...prev[project.id],
//                             type,
//                             deadlineDate:
//                               type === "continuous"
//                                 ? ""
//                                 : prev[project.id]
//                                     ?.deadlineDate || "",
//                           },
//                         }));
//                       }}
//                     >
//                       <option value="oneOff">
//                         One-off
//                       </option>

//                       <option value="continuous">
//                         Continuous
//                       </option>
//                     </Select>

//                     {(taskForms[project.id]?.type ||
//                       "oneOff") === "oneOff" && (
//                       <Field
//                         type="date"
//                         required
//                         value={
//                           taskForms[project.id]
//                             ?.deadlineDate || ""
//                         }
//                         onChange={(e) =>
//                           setTaskForms((prev) => ({
//                             ...prev,
//                             [project.id]: {
//                               ...prev[project.id],
//                               deadlineDate:
//                                 e.target.value,
//                             },
//                           }))
//                         }
//                       />
//                     )}

//                     <Primary type="submit">
//                       ＋ Add task
//                     </Primary>
//                   </InlineForm>
//                 </Section>
//               )}
//             </ProjectCard>
//           );
//         })
//       )}

//       {showProjectModal && (
//         <ProjectModal
//           isOpen={showProjectModal}
//           onClose={() =>
//             setShowProjectModal(false)
//           }
//           user={user}
//           project={editingProject}
//           onSaved={() =>
//             setShowProjectModal(false)
//           }
//         />
//       )}
//     </Page>
//   );
// }






"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import ProjectModal from "@/components/ProjectModal";
import Swal from 'sweetalert2'

/* =========================
   CONSTANTS
========================= */

const PRIORITIES = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function getPriority(priority) {
  const valid = PRIORITIES.some(
    (item) => item.value === priority
  );

  return valid ? priority : "medium";
}

/* =========================
   HELPERS
========================= */

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "No deadline";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================
   STYLES
========================= */

const Page = styled.div`
  width: 100%;
  color: #f8faff;
  padding-bottom: 25px;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 420px) {
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 21px;
  font-weight: 900;
  letter-spacing: -0.8px;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #8997b0;
  font-size: 10px;
  margin: 5px 0 0;
`;

const Primary = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  color: white;
  font-size: 11px;
  font-weight: 850;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Search = styled.input`
  width: 100%;
  border: 1px solid #293750;
  background: #131e33 !important;
  color: white !important;
  border-radius: 12px;
  padding: 13px;
  outline: none;
  font-size: 11px;
  margin-bottom: 15px;

  &::placeholder {
    color: #68758d;
  }

  &:focus {
    border-color: #8878ff;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 18px;
`;

const Stat = styled.div`
  background: #131e33;
  border: 1px solid #293750;
  border-radius: 15px;
  padding: 13px 10px;
  min-width: 0;
`;

const StatNum = styled.div`
  font-size: 21px;
  font-weight: 900;
  color: ${(p) => (p.$red ? "#ff7777" : "#f8faff")};
`;

const StatLabel = styled.div`
  color: #8997b0;
  font-size: 9px;
  margin-top: 4px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 9px;
  margin-bottom: 15px;
`;

const FilterButton = styled.button`
  flex: 1;
  border: 1px solid
    ${(p) => (p.$active ? "#7965f4" : "#293750")};

  background: ${(p) =>
    p.$active
      ? "rgba(121, 101, 244, 0.16)"
      : "#131e33"};

  color: ${(p) =>
    p.$active ? "#b5a7ff" : "#8997b0"};

  border-radius: 11px;
  padding: 11px 12px;
  font-size: 10px;
  font-weight: 850;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #7965f4;
  }
`;

const ProjectCard = styled.div`
  background: #131e33;
  border: 1px solid
    ${(p) =>
      p.$overdue
        ? "rgba(255,80,80,.65)"
        : "#293750"};
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 11px;

  box-shadow: ${(p) =>
    p.$overdue
      ? "0 0 0 1px rgba(255,80,80,.12)"
      : "none"};
`;

const ProjectHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const ProjectMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #e4eaf6;
  overflow-wrap: anywhere;
`;

const Details = styled.div`
  font-size: 10px;
  color: #8997b0;
  line-height: 1.5;
  margin-top: 5px;
  overflow-wrap: anywhere;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 11px;
`;

const Tag = styled.span`
  background: ${(p) =>
    p.$red
      ? "rgba(255,100,100,.13)"
      : p.$green
      ? "rgba(70,210,145,.13)"
      : "rgba(120,105,255,.15)"};

  color: ${(p) =>
    p.$red
      ? "#ff9999"
      : p.$green
      ? "#70dcb5"
      : "#b5a7ff"};

  padding: 5px 8px;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 850;
`;

const PriorityTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 7px;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;

  background: ${(p) =>
    p.$priority === "critical"
      ? "rgba(255, 65, 65, 0.16)"
      : p.$priority === "high"
      ? "rgba(255, 155, 65, 0.16)"
      : p.$priority === "low"
      ? "rgba(70, 210, 145, 0.13)"
      : "rgba(75, 145, 255, 0.15)"};

  color: ${(p) =>
    p.$priority === "critical"
      ? "#ff7777"
      : p.$priority === "high"
      ? "#ffb36b"
      : p.$priority === "low"
      ? "#70dcb5"
      : "#82b5ff"};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
  padding-top: 11px;
  border-top: 1px solid #293750;
`;

const Action = styled.button`
  border: 1px solid #35425a;
  background: #192640;
  color: ${(p) =>
    p.$danger ? "#ff9999" : "#c2cde0"};
  border-radius: 9px;
  padding: 8px 10px;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Section = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #293750;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 9px;
`;

const SectionTitle = styled.div`
  font-size: 10px;
  color: #c2cde0;
  font-weight: 850;
`;

const TaskCard = styled.div`
  background: #0c1425;
  border: 1px solid
    ${(p) =>
      p.$overdue
        ? "rgba(255,80,80,.6)"
        : "#293750"};
  border-radius: 12px;
  padding: 11px;
  margin-top: 8px;
`;

const TaskRow = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
  min-width: 0;
`;

const TaskText = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 11px;
  font-weight: 800;

  color: ${(p) =>
    p.$overdue
      ? "#ff7777"
      : p.$done
      ? "#77849b"
      : "#e4eaf6"};

  text-decoration: ${(p) =>
    p.$done ? "line-through" : "none"};

  overflow-wrap: anywhere;
`;

const Small = styled.button`
  border: 0;
  background: transparent;
  color: ${(p) =>
    p.$danger ? "#ff9999" : "#a99aff"};
  font-size: 9px;
  padding: 4px;
  cursor: pointer;
  flex-shrink: 0;
`;

const Subtask = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(41, 55, 80, 0.55);
  font-size: 9px;

  color: ${(p) =>
    p.$done ? "#77849b" : "#dce5f5"};

  text-decoration: ${(p) =>
    p.$done ? "line-through" : "none"};
`;

const Check = styled.button`
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  border-radius: 5px;

  border: 1px solid
    ${(p) =>
      p.$done ? "#7965f4" : "#53617a"};

  background: ${(p) =>
    p.$done ? "#6b61ee" : "#17243a"};

  color: white;
  font-size: 10px;
  cursor: pointer;
`;

const InlineForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 9px;
  width: 100%;
`;

const Field = styled.input`
  min-width: 0;
  flex: 1;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  color-scheme: dark;
  border-radius: 9px;
  padding: 9px;
  outline: none;
  font-size: 10px;

  &::placeholder {
    color: #68758d;
  }

  &:focus {
    border-color: #8878ff;
  }
`;

const Select = styled.select`
  min-width: 0;
  max-width: 100%;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  color-scheme: dark;
  border-radius: 9px;
  padding: 9px;
  outline: none;
  font-size: 10px;

  &:focus {
    border-color: #8878ff;
  }
`;

const Empty = styled.div`
  padding: 35px 15px;
  text-align: center;
  background: #131e33;
  border: 1px dashed #35425a;
  border-radius: 16px;
  color: #8997b0;
  font-size: 11px;
`;

const ErrorMessage = styled.div`
  color: #ff9999;
  font-size: 11px;
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(255, 100, 100, 0.08);
  border: 1px solid rgba(255, 100, 100, 0.2);
  border-radius: 9px;
`;

/* =========================
   MAIN COMPONENT
========================= */

export default function ProjectsTab() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Active projects display by default.
  const [projectFilter, setProjectFilter] = useState("active");

  const [showProjectModal, setShowProjectModal] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  const [expanded, setExpanded] = useState({});
  const [taskForms, setTaskForms] = useState({});
  const [subtaskForms, setSubtaskForms] = useState({});

  const today = getToday();

  /* =========================
     AUTH
  ========================= */

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  /* =========================
     FIRESTORE PROJECTS LISTENER
  ========================= */

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const projectsRef = collection(
      db,
      "users",
      user.uid,
      "projects"
    );

    return onSnapshot(
      projectsRef,
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        data.sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() || 0) -
            (a.createdAt?.toMillis?.() || 0)
        );

        setProjects(data);
        setLoading(false);
      },
      (err) => {
        console.error("Projects listener error:", err);

        setError(
          "Unable to load projects. Check your connection and Firestore permissions."
        );

        setLoading(false);
      }
    );
  }, [user]);

  /* =========================
     PROJECT COUNTS
  ========================= */

  const activeCount = useMemo(
    () => projects.filter((project) => !project.done).length,
    [projects]
  );

  const completedCount = useMemo(
    () => projects.filter((project) => !!project.done).length,
    [projects]
  );

  /* =========================
     OVERDUE PROJECT CHECK
  ========================= */

  function overdueProject(project) {
    const projectType = project.type || "oneOff";

    const projectLate =
      projectType === "oneOff" &&
      project.deadlineDate &&
      project.deadlineDate < today &&
      !project.done;

    const taskLate = (project.tasks || []).some(
      (task) =>
        (task.type || "oneOff") === "oneOff" &&
        !task.done &&
        task.deadlineDate &&
        task.deadlineDate < today
    );

    return Boolean(projectLate || taskLate);
  }

  /* =========================
     SEARCH AND FILTER
  ========================= */

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const statusMatches =
        projectFilter === "active"
          ? !project.done
          : !!project.done;

      if (!statusMatches) return false;

      if (!query) return true;

      const projectMatches = [
        project.title,
        project.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const taskMatches = (project.tasks || []).some(
        (task) =>
          [task.title, task.details]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(query)
            )
      );

      return projectMatches || taskMatches;
    });
  }, [projects, search, projectFilter]);

  /* =========================
     PROJECT DOCUMENT REFERENCE
  ========================= */

  function getProjectRef(project) {
    return doc(
      db,
      "users",
      user.uid,
      "projects",
      project.id
    );
  }

  /* =========================
     DELETE PROJECT
  ========================= */

  async function deleteProject(project) {
    if (!user) return;

    const confirmed = window.confirm(
      `Delete project "${project.title}" and all its tasks?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteDoc(getProjectRef(project));
    } catch (err) {
      console.error(err);
      setError("Could not delete project.");
    }
  }

  /* =========================
     SAVE NEW TASK
  ========================= */

  async function saveTask(project, e) {
    e.preventDefault();

    if (!user) return;

    const form = taskForms[project.id] || {};

    const type = form.type || "oneOff";
    const priority = getPriority(form.priority);

    if (!form.title?.trim()) {
      setError("Enter a task title.");
      return;
    }

    if (
      type === "oneOff" &&
      !form.deadlineDate
    ) {
      setError(
        "A deadline date is required for a one-off task."
      );
      return;
    }

    setError("");

    const newTask = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      details: (form.details || "").trim(),
      type,
      priority,
      deadlineDate:
        type === "oneOff"
          ? form.deadlineDate
          : "",
      done: false,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tasks = [
      ...(project.tasks || []),
      newTask,
    ];

    try {
      await updateDoc(getProjectRef(project), {
        tasks,
        updatedAt: serverTimestamp(),
      });

      setTaskForms((prev) => ({
        ...prev,
        [project.id]: {
          title: "",
          details: "",
          type: "oneOff",
          priority: "medium",
          deadlineDate: "",
        },
      }));
    } catch (err) {
      console.error(err);
      setError("Unable to save task.");
    }
  }

  /* =========================
     UPDATE TASK
  ========================= */

  async function updateTask(project, taskId, changes) {
    if (!user) return;

    const tasks = (project.tasks || []).map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...changes,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    try {
      await updateDoc(getProjectRef(project), {
        tasks,
        updatedAt: serverTimestamp(),
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to update task.");
    }
  }

  /* =========================
     UPDATE TASK PRIORITY
  ========================= */

  async function updateTaskPriority(
    project,
    task,
    priority
  ) {
    const validPriority = getPriority(priority);

    await updateTask(project, task.id, {
      priority: validPriority,
    });
  }

  /* =========================
     EDIT TASK
  ========================= */

/* =========================
   EDIT TASK
========================= */
async function editTask(project, task) {
  const isOneOff = (task.type || "oneOff") === "oneOff";

  const { value: formValues, isConfirmed } = await Swal.fire({
    title: "Edit Task",
    html: `
      <div style="text-align:left;">
        <label style="display:block;margin-bottom:6px;font-size:13px;">
          Task Title
        </label>
        <input
          id="swal-task-title"
          class="swal2-input"
          placeholder="Task title"
          value="${(task.title || "").replace(/"/g, "&quot;")}"
          style="width:100%;margin:0 0 15px;"
        />

        <label style="display:block;margin-bottom:6px;font-size:13px;">
          Task Details
        </label>
        <textarea
          id="swal-task-details"
          class="swal2-textarea"
          placeholder="Task details (optional)"
          style="width:100%;margin:0 0 15px;"
        >${task.details || ""}</textarea>

        ${
          isOneOff
            ? `
              <label style="display:block;margin-bottom:6px;font-size:13px;">
                Deadline Date
              </label>
              <input
                id="swal-task-deadline"
                type="date"
                class="swal2-input"
                value="${task.deadlineDate || ""}"
                style="width:100%;margin:0;"
              />
            `
            : ""
        }
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    preConfirm: () => {
      const title = document
        .getElementById("swal-task-title")
        .value.trim();

      const details = document
        .getElementById("swal-task-details")
        .value.trim();

      const deadlineDate = isOneOff
        ? document.getElementById("swal-task-deadline").value
        : "";

      if (!title) {
        Swal.showValidationMessage("Please enter a task title.");
        return false;
      }

      if (isOneOff && !deadlineDate) {
        Swal.showValidationMessage(
          "One-off tasks must have a deadline date."
        );
        return false;
      }

      return {
        title,
        details,
        deadlineDate,
      };
    },
  });

  if (!isConfirmed || !formValues) return;

  await updateTask(project, task.id, {
    title: formValues.title,
    details: formValues.details,
    deadlineDate: formValues.deadlineDate,
  });
}

  /* =========================
     DELETE TASK
  ========================= */

 /* =========================
   DELETE TASK
========================= */
async function deleteTask(project, task) {
  if (!user) return;

  const result = await Swal.fire({
    title: "Delete Task?",
    text: `Delete "${task.title}" and all its subtasks? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  const tasks = (project.tasks || []).filter(
    (item) => item.id !== task.id
  );

  try {
    await updateDoc(getProjectRef(project), {
      tasks,
      updatedAt: serverTimestamp(),
    });

    setError("");

    Swal.fire({
      title: "Deleted!",
      text: "The task has been deleted.",
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  } catch (err) {
    console.error(err);
    setError("Unable to delete task.");

    Swal.fire({
      title: "Error",
      text: "Unable to delete task. Please try again.",
      icon: "error",
      confirmButtonColor: "#2563eb",
    });
  }
}

  /* =========================
     ADD SUBTASK
  ========================= */

  async function addSubtask(project, task, e) {
    e.preventDefault();

    if (!user) return;

    const key = `${project.id}_${task.id}`;
    const title = subtaskForms[key] || "";

    if (!title.trim()) return;

    const subtasks = [
      ...(task.subtasks || []),
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      },
    ];

    await updateTask(project, task.id, {
      subtasks,
    });

    setSubtaskForms((prev) => ({
      ...prev,
      [key]: "",
    }));
  }

  /* =========================
     EDIT SUBTASK
  ========================= */

 /* =========================
   EDIT SUBTASK
========================= */

async function editSubtask(project, task, subtask) {
  const { value: title, isConfirmed } = await Swal.fire({
    title: "Edit Subtask",
    input: "text",
    inputLabel: "Subtask Title",
    inputValue: subtask.title || "",
    inputPlaceholder: "Enter subtask title",
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Please enter a subtask title.";
      }
    },
  });

  if (!isConfirmed || !title?.trim()) return;

  const subtasks = (task.subtasks || []).map((item) =>
    item.id === subtask.id
      ? {
          ...item,
          title: title.trim(),
        }
      : item
  );

  try {
    await updateTask(project, task.id, {
      subtasks,
    });

    setError("");
  } catch (err) {
    console.error(err);
    setError("Unable to update subtask.");

    Swal.fire({
      title: "Error",
      text: "Unable to update subtask. Please try again.",
      icon: "error",
      confirmButtonColor: "#2563eb",
    });
  }
}

  /* =========================
     DELETE SUBTASK
  ========================= */

/* =========================
   DELETE SUBTASK
========================= */

async function removeSubtask(project, task, subtask) {
  const result = await Swal.fire({
    title: "Delete Subtask?",
    text: `Are you sure you want to delete "${subtask.title}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  const subtasks = (task.subtasks || []).filter(
    (item) => item.id !== subtask.id
  );

  try {
    await updateTask(project, task.id, {
      subtasks,
    });

    setError("");

    Swal.fire({
      title: "Deleted!",
      text: "The subtask has been deleted.",
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  } catch (err) {
    console.error(err);
    setError("Unable to delete subtask.");

    Swal.fire({
      title: "Error",
      text: "Unable to delete subtask. Please try again.",
      icon: "error",
      confirmButtonColor: "#2563eb",
    });
  }
}

  /* =========================
     PROJECT COMPLETION
  ========================= */

  async function toggleProjectDone(project) {
    if (!user) return;

    try {
      await updateDoc(getProjectRef(project), {
        done: !project.done,
        updatedAt: serverTimestamp(),
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to update project status.");
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <Page>
      {/* PAGE HEADING */}

      <Heading>
        <div>
          <Title>My Projects</Title>

          <Subtitle>
            Plan projects, manage tasks, and track deadlines.
          </Subtitle>
        </div>

        <Primary
          onClick={() => {
            setEditingProject(null);
            setShowProjectModal(true);
          }}
        >
          ＋ Add project
        </Primary>
      </Heading>

      {/* PROJECT STATISTICS */}

      <Stats>
        <Stat>
          <StatNum>{projects.length}</StatNum>
          <StatLabel>Total projects</StatLabel>
        </Stat>

        <Stat>
          <StatNum>{activeCount}</StatNum>
          <StatLabel>Active projects</StatLabel>
        </Stat>

        <Stat>
          <StatNum $red>
            {projects.filter(overdueProject).length}
          </StatNum>

          <StatLabel>Overdue projects</StatLabel>
        </Stat>
      </Stats>

      {/* SEARCH */}

      <Search
        type="search"
        placeholder="⌕ Search projects and tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROJECT FILTERS */}

      <FilterButtons>
        <FilterButton
          $active={projectFilter === "active"}
          onClick={() => setProjectFilter("active")}
        >
          Active ({activeCount})
        </FilterButton>

        <FilterButton
          $active={projectFilter === "completed"}
          onClick={() => setProjectFilter("completed")}
        >
          Completed ({completedCount})
        </FilterButton>
      </FilterButtons>

      {/* ERROR */}

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {/* LOADING / EMPTY / PROJECTS */}

      {loading ? (
        <Empty>Loading projects...</Empty>
      ) : !user ? (
        <Empty>
          Please sign in to access your projects.
        </Empty>
      ) : visibleProjects.length === 0 ? (
        <Empty>
          {search.trim()
            ? "No projects or tasks match your search."
            : projectFilter === "active"
            ? "No active projects. Add a new project or check your completed projects."
            : "No completed projects yet."}
        </Empty>
      ) : (
        visibleProjects.map((project) => {
          const tasks = project.tasks || [];

          const late = overdueProject(project);

          const isExpanded = !!expanded[project.id];

          const projectType =
            project.type || "oneOff";

          const completedTasks = tasks.filter(
            (task) => task.done
          ).length;

          const continuousTasks = tasks.filter(
            (task) => task.type === "continuous"
          ).length;

          return (
            <ProjectCard
              key={project.id}
              $overdue={late}
            >
              {/* PROJECT INFORMATION */}

              <ProjectHeader>
                <ProjectMain>
                  <ProjectTitle>
                    {project.title}
                  </ProjectTitle>

                  {project.description && (
                    <Details>
                      {project.description}
                    </Details>
                  )}

                  <Tags>
                    <Tag>
                      {projectType === "continuous"
                        ? "∞ CONTINUOUS PROJECT"
                        : "ONE-OFF PROJECT"}
                    </Tag>

                    {projectType === "oneOff" && (
                      <Tag $red={late}>
                        DEADLINE:{" "}
                        {formatDate(project.deadlineDate)}
                      </Tag>
                    )}

                    {projectType === "continuous" && (
                      <Tag>NO DEADLINE</Tag>
                    )}

                    {late && (
                      <Tag $red>
                        ⚑ OVERDUE
                      </Tag>
                    )}

                    {project.done && (
                      <Tag $green>
                        COMPLETED
                      </Tag>
                    )}

                    <Tag>
                      {tasks.length} TASK(S)
                    </Tag>
                  </Tags>
                </ProjectMain>
              </ProjectHeader>

              {/* PROJECT ACTIONS */}

              <Actions>
                <Action
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [project.id]: !prev[project.id],
                    }))
                  }
                >
                  {isExpanded
                    ? "Hide tasks ▲"
                    : "Manage tasks ▼"}
                </Action>

                <Action
                  onClick={() => {
                    setEditingProject(project);
                    setShowProjectModal(true);
                  }}
                >
                  Edit project
                </Action>

                <Action
                  $danger
                  onClick={() => deleteProject(project)}
                >
                  Delete
                </Action>

                {!project.done && (
                  <Action
                    onClick={() =>
                      toggleProjectDone(project)
                    }
                  >
                    ✓ Complete project
                  </Action>
                )}

                {project.done && (
                  <Action
                    onClick={() =>
                      toggleProjectDone(project)
                    }
                  >
                    ↶ Reopen
                  </Action>
                )}
              </Actions>

              {/* TASKS SECTION */}

              {isExpanded && (
                <Section>
                  <SectionHead>
                    <SectionTitle>
                      Tasks ({completedTasks}/{tasks.length} completed ·{" "}
                      {continuousTasks} continuous)
                    </SectionTitle>
                  </SectionHead>

                  {/* EXISTING TASKS */}

                  {tasks.map((task) => {
                    const taskType =
                      task.type || "oneOff";

                    const taskPriority = getPriority(
                      task.priority
                    );

                    const taskLate =
                      taskType === "oneOff" &&
                      !task.done &&
                      task.deadlineDate &&
                      task.deadlineDate < today;

                    const subtasks = task.subtasks || [];

                    const completedSubtasks =
                      subtasks.filter(
                        (subtask) => subtask.done
                      ).length;

                    return (
                      <TaskCard
                        key={task.id}
                        $overdue={taskLate}
                      >
                        {/* TASK TITLE ROW */}

                        <TaskRow>
                          {taskType === "oneOff" && (
                            <Check
                              type="button"
                              $done={task.done}
                              aria-label={
                                task.done
                                  ? "Mark task incomplete"
                                  : "Mark task complete"
                              }
                              onClick={() =>
                                updateTask(
                                  project,
                                  task.id,
                                  {
                                    done: !task.done,
                                  }
                                )
                              }
                            >
                              {task.done ? "✓" : ""}
                            </Check>
                          )}

                          {taskType === "continuous" && (
                            <span
                              style={{
                                color: "#39b5f2",
                                fontSize: 14,
                                flexShrink: 0,
                              }}
                            >
                              ∞
                            </span>
                          )}

                          <TaskText
                            $overdue={taskLate}
                            $done={task.done}
                          >
                            {task.title}
                          </TaskText>

                          <Small
                            type="button"
                            onClick={() =>
                              editTask(project, task)
                            }
                          >
                            Edit
                          </Small>

                          <Small
                            type="button"
                            $danger
                            onClick={() =>
                              deleteTask(project, task)
                            }
                          >
                            Delete
                          </Small>
                        </TaskRow>

                        {/* TASK DETAILS */}

                        {task.details && (
                          <Details>
                            {task.details}
                          </Details>
                        )}

                        {/* TASK TYPE, PRIORITY AND DEADLINE */}

                        <Tags>
                          <Tag>
                            {taskType === "continuous"
                              ? "∞ CONTINUOUS TASK"
                              : "ONE-OFF TASK"}
                          </Tag>

                          <PriorityTag
                            $priority={taskPriority}
                          >
                            ● {taskPriority.toUpperCase()} PRIORITY
                          </PriorityTag>

                          {/* CHANGE PRIORITY */}

                          <Select
                            aria-label={`Change priority for ${task.title}`}
                            value={taskPriority}
                            onChange={(e) =>
                              updateTaskPriority(
                                project,
                                task,
                                e.target.value
                              )
                            }
                            style={{
                              padding: "5px 7px",
                              fontSize: "8px",
                              borderRadius: "7px",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {PRIORITIES.map((priority) => (
                              <option
                                key={priority.value}
                                value={priority.value}
                              >
                                {priority.label}
                              </option>
                            ))}
                          </Select>

                          {taskType === "oneOff" && (
                            <Tag $red={taskLate}>
                              {taskLate
                                ? "⚑ OVERDUE"
                                : `DUE ${formatDate(
                                    task.deadlineDate
                                  )}`}
                            </Tag>
                          )}

                          {task.done && (
                            <Tag $green>
                              COMPLETED
                            </Tag>
                          )}
                        </Tags>

                        {/* SUBTASKS */}

                        <Section>
                          <SectionHead>
                            <SectionTitle>
                              Subtasks ({completedSubtasks}/{subtasks.length})
                            </SectionTitle>
                          </SectionHead>

                          {subtasks.map((subtask) => (
                            <Subtask
                              key={subtask.id}
                              $done={subtask.done}
                            >
                              <Check
                                type="button"
                                $done={subtask.done}
                                aria-label={
                                  subtask.done
                                    ? "Mark subtask incomplete"
                                    : "Mark subtask complete"
                                }
                                onClick={() =>
                                  updateTask(
                                    project,
                                    task.id,
                                    {
                                      subtasks: subtasks.map(
                                        (item) =>
                                          item.id === subtask.id
                                            ? {
                                                ...item,
                                                done: !item.done,
                                              }
                                            : item
                                      ),
                                    }
                                  )
                                }
                              >
                                {subtask.done ? "✓" : ""}
                              </Check>

                              <span
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {subtask.title}
                              </span>

                              <Small
                                type="button"
                                onClick={() =>
                                  editSubtask(
                                    project,
                                    task,
                                    subtask
                                  )
                                }
                              >
                                Edit
                              </Small>

                              <Small
                                type="button"
                                $danger
                                onClick={() =>
                                  removeSubtask(
                                    project,
                                    task,
                                    subtask
                                  )
                                }
                              >
                                ×
                              </Small>
                            </Subtask>
                          ))}

                          {/* ADD SUBTASK FORM */}

                          <InlineForm
                            onSubmit={(e) =>
                              addSubtask(
                                project,
                                task,
                                e
                              )
                            }
                          >
                            <Field
                              placeholder="Add a subtask..."
                              value={
                                subtaskForms[
                                  `${project.id}_${task.id}`
                                ] || ""
                              }
                              onChange={(e) =>
                                setSubtaskForms((prev) => ({
                                  ...prev,
                                  [`${project.id}_${task.id}`]:
                                    e.target.value,
                                }))
                              }
                            />

                            <Primary type="submit">
                              ＋ Add
                            </Primary>
                          </InlineForm>
                        </Section>
                      </TaskCard>
                    );
                  })}

                  {/* ADD NEW TASK FORM */}

                  <Section>
                    <SectionHead>
                      <SectionTitle>
                        Add a new task
                      </SectionTitle>
                    </SectionHead>

                    <InlineForm
                      onSubmit={(e) =>
                        saveTask(project, e)
                      }
                    >
                      <Field
                        placeholder="New task title"
                        value={
                          taskForms[project.id]?.title || ""
                        }
                        onChange={(e) =>
                          setTaskForms((prev) => ({
                            ...prev,
                            [project.id]: {
                              ...prev[project.id],
                              title: e.target.value,
                              type:
                                prev[project.id]?.type ||
                                "oneOff",
                              priority:
                                prev[project.id]?.priority ||
                                "medium",
                            },
                          }))
                        }
                      />

                      {/* TASK TYPE */}

                      <Select
                        aria-label="Task type"
                        value={
                          taskForms[project.id]?.type ||
                          "oneOff"
                        }
                        onChange={(e) => {
                          const type = e.target.value;

                          setTaskForms((prev) => ({
                            ...prev,
                            [project.id]: {
                              ...prev[project.id],
                              type,
                              priority:
                                prev[project.id]?.priority ||
                                "medium",
                              deadlineDate:
                                type === "continuous"
                                  ? ""
                                  : prev[project.id]
                                      ?.deadlineDate || "",
                            },
                          }));
                        }}
                      >
                        <option value="oneOff">
                          One-off
                        </option>

                        <option value="continuous">
                          Continuous
                        </option>
                      </Select>

                      {/* TASK PRIORITY */}

                      <Select
                        aria-label="New task priority"
                        value={
                          taskForms[project.id]?.priority ||
                          "medium"
                        }
                        onChange={(e) =>
                          setTaskForms((prev) => ({
                            ...prev,
                            [project.id]: {
                              ...prev[project.id],
                              priority: e.target.value,
                            },
                          }))
                        }
                      >
                        {PRIORITIES.map((priority) => (
                          <option
                            key={priority.value}
                            value={priority.value}
                          >
                            {priority.label} priority
                          </option>
                        ))}
                      </Select>

                      {/* TASK DEADLINE */}

                      {(taskForms[project.id]?.type ||
                        "oneOff") === "oneOff" && (
                        <Field
                          type="date"
                          required
                          aria-label="Task deadline"
                          value={
                            taskForms[project.id]
                              ?.deadlineDate || ""
                          }
                          onChange={(e) =>
                            setTaskForms((prev) => ({
                              ...prev,
                              [project.id]: {
                                ...prev[project.id],
                                deadlineDate:
                                  e.target.value,
                              },
                            }))
                          }
                        />
                      )}

                      <Primary type="submit">
                        ＋ Add task
                      </Primary>
                    </InlineForm>
                  </Section>
                </Section>
              )}
            </ProjectCard>
          );
        })
      )}

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() =>
            setShowProjectModal(false)
          }
          user={user}
          project={editingProject}
          onSaved={() =>
            setShowProjectModal(false)
          }
        />
      )}
    </Page>
  );
}
