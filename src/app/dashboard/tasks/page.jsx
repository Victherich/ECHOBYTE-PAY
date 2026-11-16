



// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import styled from "styled-components";
// import {
//   collection,
//   updateDoc,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   serverTimestamp,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "@/firebaseConfig";
// import Swal from "sweetalert2";

// import TaskModal from "@/components/TaskModal";

// /* -------------------- DATE HELPERS -------------------- */

// function localDateString(date = new Date()) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function getTomorrow() {
//   const date = new Date();
//   date.setDate(date.getDate() + 1);
//   return localDateString(date);
// }

// function formatDate(dateString) {
//   if (!dateString) return "No date scheduled";

//   return new Date(`${dateString}T00:00:00`).toLocaleDateString(
//     "en-US",
//     {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     }
//   );
// }

// function formatTime(time) {
//   if (!time || time === "Unscheduled") return "Unscheduled";

//   const [hours, minutes] = time.split(":");
//   const date = new Date();
//   date.setHours(Number(hours), Number(minutes), 0, 0);

//   return date.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

// const RECURRENCE_OPTIONS = [
//   { value: "daily", label: "Every day" },
//   { value: "weekly", label: "Every week" },
//   { value: "biweekly", label: "Every 2 weeks" },
//   { value: "monthly", label: "Every month" },
//   { value: "quarterly", label: "Every 3 months" },
//   { value: "halfYearly", label: "Every 6 months" },
//   { value: "yearly", label: "Every year" },
//   { value: "custom", label: "Custom interval" },
// ];

// // Calculate the next occurrence of a recurring task.
// function calculateNextDate(startDate, frequency, customDays = 1) {
//   const date = new Date(`${startDate}T12:00:00`);

//   switch (frequency) {
//     case "daily":
//       date.setDate(date.getDate() + 1);
//       break;

//     case "weekly":
//       date.setDate(date.getDate() + 7);
//       break;

//     case "biweekly":
//       date.setDate(date.getDate() + 14);
//       break;

//     case "monthly":
//       date.setDate(1);
//       date.setMonth(date.getMonth() + 1);
//       break;

//     case "quarterly":
//       date.setDate(1);
//       date.setMonth(date.getMonth() + 3);
//       break;

//     case "halfYearly":
//       date.setDate(1);
//       date.setMonth(date.getMonth() + 6);
//       break;

//     case "yearly":
//       date.setDate(1);
//       date.setFullYear(date.getFullYear() + 1);
//       break;

//     case "custom":
//       date.setDate(
//         date.getDate() + Math.max(1, Number(customDays) || 1)
//       );
//       break;

//     default:
//       return "";
//   }

//   // Keep the original day where possible for monthly/yearly schedules.
//   if (
//     ["monthly", "quarterly", "halfYearly", "yearly"].includes(
//       frequency
//     )
//   ) {
//     const original = new Date(`${startDate}T12:00:00`);
//     const desiredDay = original.getDate();

//     date.setDate(desiredDay);

//     // Clamp dates such as January 31 to the last day of the target month.
//     if (date.getDate() !== desiredDay) {
//       date.setDate(0);
//     }
//   }

//   return localDateString(date);
// }

// /* -------------------- STYLES -------------------- */

// const Page = styled.div`
//   width: 100%;
//   color: #f8faff;
//   padding-bottom: 25px;
// `;

// const PageHeading = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 12px;
//   margin-bottom: 18px;
// `;

// const HeadingTitle = styled.h1`
//   font-size: 21px;
//   font-weight: 900;
//   letter-spacing: -.8px;
//   margin: 0;
// `;

// const HeadingSubtitle = styled.p`
//   color: #8997b0;
//   font-size: 10px;
//   margin: 5px 0 0;
// `;

// const AddButton = styled.button`
//   border: 0;
//   border-radius: 12px;
//   padding: 12px 14px;
//   background: linear-gradient(110deg, #7059f5, #477eea);
//   color: white;
//   font-size: 11px;
//   font-weight: 850;
//   white-space: nowrap;
//   cursor: pointer;
// `;

// const StatsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 9px;
//   margin-bottom: 19px;
// `;

// const StatCard = styled.div`
//   background: #131e33;
//   border: 1px solid #293750;
//   border-radius: 15px;
//   padding: 13px 10px;
// `;

// const StatNumber = styled.div`
//   font-size: 21px;
//   font-weight: 900;
//   color: #f8faff;
// `;

// const StatLabel = styled.div`
//   color: #8997b0;
//   font-size: 9px;
//   margin-top: 4px;
// `;

// const FilterSection = styled.div`
//   margin-bottom: 16px;
// `;

// const FilterHeading = styled.div`
//   font-size: 11px;
//   color: #aab6cc;
//   font-weight: 800;
//   margin-bottom: 10px;
// `;

// const FilterScroll = styled.div`
//   display: flex;
//   gap: 7px;
//   overflow-x: auto;
//   padding-bottom: 7px;

//   &::-webkit-scrollbar {
//     height: 3px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #35425a;
//     border-radius: 10px;
//   }
// `;

// const FilterButton = styled.button`
//   flex-shrink: 0;
//   border: 1px solid ${({ $active }) =>
//     $active ? "#8878ff" : "#293750"};
//   background: ${({ $active }) =>
//     $active ? "rgba(117,94,255,.18)" : "#131e33"};
//   color: ${({ $active }) =>
//     $active ? "#c0b5ff" : "#9ba9c0"};
//   padding: 10px 13px;
//   border-radius: 11px;
//   font-size: 10px;
//   font-weight: 800;
//   cursor: pointer;
// `;

// const DateFilter = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 9px;
//   margin-top: 10px;
// `;

// const DateInput = styled.input`
//   min-width: 0;
//   flex: 1;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   color-scheme: dark;
//   border-radius: 11px;
//   padding: 11px;
//   outline: none;
//   font-size: 11px;

//   &:focus {
//     border-color: #8878ff;
//   }
// `;

// const ClearDate = styled.button`
//   border: 1px solid #35425a;
//   background: #192640;
//   color: #c2cde0;
//   border-radius: 10px;
//   padding: 11px;
//   font-size: 10px;
//   cursor: pointer;
// `;

// const SearchInput = styled.input`
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

// const ListHeading = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin: 17px 1px 11px;
// `;

// const ListTitle = styled.h2`
//   font-size: 13px;
//   color: #edf2ff;
//   margin: 0;
//   font-weight: 850;
// `;

// const ResultCount = styled.span`
//   font-size: 9px;
//   color: #8997b0;
// `;

// const TaskCard = styled.div`
//   background: #131e33;
//   border: 1px solid #293750;
//   border-radius: 16px;
//   padding: 14px;
//   margin-bottom: 10px;
// `;

// const TaskTop = styled.div`
//   display: flex;
//   align-items: flex-start;
//   gap: 10px;
// `;

// const CheckButton = styled.button`
//   width: 22px;
//   height: 22px;
//   flex-shrink: 0;
//   border: 1.5px solid ${({ $done }) =>
//     $done ? "#7965f4" : "#53617a"};
//   background: ${({ $done }) =>
//     $done ? "#6b61ee" : "#17243a"};
//   color: white;
//   border-radius: 7px;
//   font-size: 13px;
//   cursor: pointer;
// `;

// const TaskMain = styled.div`
//   flex: 1;
//   min-width: 0;
// `;

// const TaskTitle = styled.div`
//   color: ${({ $done }) => $done ? "#77849b" : "#e4eaf6"};
//   font-size: 12px;
//   font-weight: 850;
//   line-height: 1.5;
//   text-decoration: ${({ $done }) =>
//     $done ? "line-through" : "none"};
//   overflow-wrap: anywhere;
// `;

// const TaskDetails = styled.div`
//   color: #8997b0;
//   font-size: 10px;
//   line-height: 1.5;
//   margin-top: 5px;
//   overflow-wrap: anywhere;
// `;

// const TaskMeta = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 6px;
//   margin-top: 12px;
// `;

// const MetaTag = styled.span`
//   background: ${({ $tone }) =>
//     $tone === "red" ? "rgba(255,100,100,.13)" :
//     $tone === "green" ? "rgba(70,210,145,.13)" :
//     $tone === "blue" ? "rgba(57,181,242,.13)" :
//     "rgba(120,105,255,.15)"};
//   color: ${({ $tone }) =>
//     $tone === "red" ? "#ff9999" :
//     $tone === "green" ? "#70dcb5" :
//     $tone === "blue" ? "#80cfff" :
//     "#b5a7ff"};
//   padding: 5px 8px;
//   border-radius: 7px;
//   font-size: 8px;
//   font-weight: 850;
// `;

// const TaskActions = styled.div`
//   display: flex;
//   gap: 8px;
//   margin-top: 13px;
//   padding-top: 11px;
//   border-top: 1px solid #293750;
// `;

// const ActionButton = styled.button`
//   border: 1px solid #35425a;
//   background: #192640;
//   color: #c2cde0;
//   border-radius: 9px;
//   padding: 8px 12px;
//   font-size: 9px;
//   font-weight: 800;
//   cursor: pointer;

//   &:hover {
//     border-color: #8878ff;
//     color: white;
//   }
// `;

// const Empty = styled.div`
//   padding: 35px 15px;
//   text-align: center;
//   background: #131e33;
//   border: 1px dashed #35425a;
//   border-radius: 16px;
// `;

// const EmptyIcon = styled.div`
//   font-size: 27px;
//   margin-bottom: 10px;
// `;

// const EmptyTitle = styled.div`
//   font-size: 12px;
//   color: #e4eaf6;
//   font-weight: 850;
// `;

// const EmptyText = styled.div`
//   font-size: 10px;
//   color: #8997b0;
//   margin-top: 6px;
//   line-height: 1.6;
// `;

// const Loading = styled.div`
//   padding: 35px 10px;
//   text-align: center;
//   font-size: 11px;
//   color: #8997b0;
// `;

// const ErrorMessage = styled.div`
//   background: rgba(255,100,100,.1);
//   border: 1px solid rgba(255,100,100,.25);
//   color: #ff9999;
//   padding: 12px;
//   border-radius: 12px;
//   font-size: 10px;
//   margin-bottom: 15px;
//   line-height: 1.5;
// `;

// /* -------------------- SUBTASK STYLES -------------------- */

// const SubtasksSection = styled.div`
//   margin-top: 14px;
//   padding-top: 12px;
//   border-top: 1px solid #293750;
// `;

// const SubtasksHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 8px;
//   margin-bottom: 11px;
// `;

// const SubtasksTitle = styled.div`
//   font-size: 10px;
//   color: #c2cde0;
//   font-weight: 850;
// `;

// const SubtaskProgress = styled.div`
//   height: 5px;
//   background: #293750;
//   border-radius: 10px;
//   overflow: hidden;
//   margin-bottom: 12px;
// `;

// const SubtaskProgressFill = styled.div`
//   height: 100%;
//   width: ${({ $width }) => $width}%;
//   background: linear-gradient(90deg, #7059f5, #39b5f2);
//   border-radius: inherit;
//   transition: width .2s ease;
// `;

// const SubtaskRow = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 9px;
//   padding: 9px 0;
//   border-bottom: 1px solid rgba(41,55,80,.6);

//   &:last-child {
//     border-bottom: 0;
//   }
// `;

// const SubtaskCheck = styled.button`
//   width: 18px;
//   height: 18px;
//   flex-shrink: 0;
//   border-radius: 6px;
//   border: 1px solid ${({ $done }) =>
//     $done ? "#7965f4" : "#53617a"};
//   background: ${({ $done }) =>
//     $done ? "#6b61ee" : "#17243a"};
//   color: white;
//   font-size: 10px;
//   cursor: pointer;
// `;

// const SubtaskName = styled.div`
//   flex: 1;
//   min-width: 0;
//   font-size: 10px;
//   color: ${({ $done }) => $done ? "#77849b" : "#dce5f5"};
//   text-decoration: ${({ $done }) =>
//     $done ? "line-through" : "none"};
//   overflow-wrap: anywhere;
// `;

// const SubtaskActions = styled.div`
//   display: flex;
//   gap: 5px;
// `;

// const SmallAction = styled.button`
//   border: 0;
//   background: transparent;
//   color: ${({ $danger }) => $danger ? "#ff9999" : "#a99aff"};
//   font-size: 10px;
//   padding: 5px;
//   cursor: pointer;
// `;

// const AddSubtaskButton = styled.button`
//   width: 100%;
//   border: 1px dashed #43516c;
//   background: rgba(117,94,255,.06);
//   color: #b5a7ff;
//   border-radius: 9px;
//   padding: 9px;
//   font-size: 10px;
//   font-weight: 800;
//   margin-top: 9px;
//   cursor: pointer;

//   &:hover {
//     border-color: #8878ff;
//   }
// `;

// const SubtaskInputArea = styled.form`
//   display: flex;
//   gap: 7px;
//   margin-top: 10px;
// `;

// const SubtaskInput = styled.input`
//   min-width: 0;
//   flex: 1;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   border-radius: 9px;
//   padding: 10px;
//   outline: none;
//   font-size: 10px;

//   &:focus {
//     border-color: #8878ff;
//   }
// `;

// const SubtaskSaveButton = styled.button`
//   border: 0;
//   border-radius: 9px;
//   padding: 0 12px;
//   background: #7059f5;
//   color: white;
//   font-size: 10px;
//   font-weight: 800;
//   cursor: pointer;
// `;

// /* -------------------- MAIN COMPONENT -------------------- */

// export default function TasksTab() {
//   const [user, setUser] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [activeFilter, setActiveFilter] = useState("today");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [search, setSearch] = useState("");

//   /* TASK MODAL STATE */

//   const [showModal, setShowModal] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [newTaskInitialData, setNewTaskInitialData] = useState({});

//   /* SUBTASK STATE */

//   const [expandedTasks, setExpandedTasks] = useState({});

//   const [subtaskEditor, setSubtaskEditor] = useState({
//     taskId: null,
//     subtaskId: null,
//     title: "",
//   });

//   const [subtaskSaving, setSubtaskSaving] = useState(false);

//   const processingRecurrences = useRef(new Set());

//   const today = localDateString();
//   const tomorrow = getTomorrow();

//   /* -------------------- AUTH -------------------- */

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* -------------------- REAL-TIME FIRESTORE LISTENER -------------------- */

//   useEffect(() => {
//     if (!user) {
//       setTasks([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const tasksRef = collection(db, "users", user.uid, "tasks");

//     const unsubscribe = onSnapshot(
//       tasksRef,
//       (snapshot) => {
//         const records = snapshot.docs.map((item) => ({
//           id: item.id,
//           ...item.data(),
//         }));

//         records.sort((a, b) => {
//           const dateA = a.createdAt?.toMillis?.() || 0;
//           const dateB = b.createdAt?.toMillis?.() || 0;

//           return dateB - dateA;
//         });

//         setTasks(records);
//         setLoading(false);
//       },
//       (err) => {
//         console.error("Tasks Firestore error:", err);

//         setError(
//           "Unable to load your tasks. Please check your connection and Firestore permissions."
//         );

//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [user]);

//   /* -------------------- AUTOMATIC REACTIVATION OF RECURRING TASKS -------------------- */

//   useEffect(() => {
//     if (!user) {
//       processingRecurrences.current.clear();
//       return;
//     }

//     function checkRecurringTasks() {
//       const currentDate = localDateString();

//       tasks.forEach((task) => {
//         const isDue =
//           task.done === true &&
//           task.recurrenceType === "recurring" &&
//           task.nextOccurrenceDate &&
//           task.nextOccurrenceDate <= currentDate;

//         // Allow this task to be processed again in a future cycle.
//         if (!isDue) {
//           processingRecurrences.current.delete(task.id);
//           return;
//         }

//         // Avoid processing the same task more than once.
//         if (processingRecurrences.current.has(task.id)) {
//           return;
//         }

//         processingRecurrences.current.add(task.id);

//         updateDoc(
//           doc(db, "users", user.uid, "tasks", task.id),
//           {
//             done: false,
//             scheduledDate: task.nextOccurrenceDate,
//             nextOccurrenceDate: "",
//             overdue: task.nextOccurrenceDate < currentDate,
//             updatedAt: serverTimestamp(),
//           }
//         ).catch((err) => {
//           console.error("Recurring task reactivation error:", err);

//           processingRecurrences.current.delete(task.id);

//           setError("Unable to reactivate a recurring task.");
//         });
//       });
//     }

//     // Check immediately when tasks load or change.
//     checkRecurringTasks();

//     // Continue checking every minute while LIFEOS is open.
//     const interval = setInterval(checkRecurringTasks, 60000);

//     return () => clearInterval(interval);
//   }, [tasks, user]);

//   /* -------------------- TASK MODAL FUNCTIONS -------------------- */

//   function openNewTask(initialData = {}) {
//     setEditingTask(null);
//     setNewTaskInitialData(initialData);
//     setShowModal(true);
//   }

//   function openEditTask(task) {
//     setEditingTask(task);
//     setNewTaskInitialData({});
//     setShowModal(true);
//   }

//   function closeTaskModal() {
//     setShowModal(false);
//     setEditingTask(null);
//     setNewTaskInitialData({});
//   }

//   /* -------------------- FILTERS -------------------- */

//   const filteredTasks = useMemo(() => {
//     let result = [...tasks];

//     if (activeFilter === "unscheduled") {
//       result = result.filter(
//         (task) =>
//           !task.done &&
//           (!task.scheduledDate ||
//             !task.time ||
//             task.time === "Unscheduled")
//       );
//     }

//     if (activeFilter === "today") {
//       result = result.filter(
//         (task) => !task.done && task.scheduledDate === today
//       );
//     }

//     if (activeFilter === "tomorrow") {
//       result = result.filter(
//         (task) => !task.done && task.scheduledDate === tomorrow
//       );
//     }

//     if (activeFilter === "completed") {
//       result = result.filter((task) => task.done);
//     }

//     if (activeFilter === "all") {
//       result = result.filter((task) => !task.done);
//     }

//     if (activeFilter === "date" && selectedDate) {
//       result = result.filter(
//         (task) => task.scheduledDate === selectedDate
//       );
//     }

//     if (search.trim()) {
//       const searchText = search.toLowerCase();

//       result = result.filter((task) =>
//         [
//           task.title,
//           task.area,
//           task.details,
//           task.priority,
//         ]
//           .filter(Boolean)
//           .some((value) =>
//             String(value).toLowerCase().includes(searchText)
//           )
//       );
//     }

//     return result;
//   }, [tasks, activeFilter, selectedDate, search, today, tomorrow]);

//   const counts = useMemo(
//     () => ({
//       all: tasks.filter((task) => !task.done).length,

//       unscheduled: tasks.filter(
//         (task) =>
//           !task.done &&
//           (!task.scheduledDate ||
//             !task.time ||
//             task.time === "Unscheduled")
//       ).length,

//       today: tasks.filter(
//         (task) => !task.done && task.scheduledDate === today
//       ).length,

//       tomorrow: tasks.filter(
//         (task) => !task.done && task.scheduledDate === tomorrow
//       ).length,

//       completed: tasks.filter((task) => task.done).length,
//     }),
//     [tasks, today, tomorrow]
//   );

//   /* -------------------- COMPLETE / UNCOMPLETE TASK -------------------- */

//   async function toggleTask(task) {
//     if (!user) return;

//     const currentDate = localDateString();

//     // Prevent completing a task before its scheduled date.
//     if (
//       !task.done &&
//       task.scheduledDate &&
//       task.scheduledDate > currentDate
//     ) {
//       Swal.fire({
//         text: `This task is scheduled for ${formatDate(
//           task.scheduledDate
//         )}. You cannot mark it as completed yet.`,
//       });

//       return;
//     }

//     const newDone = !task.done;

//     let scheduledDate = task.scheduledDate || "";
//     let nextOccurrenceDate = task.nextOccurrenceDate || "";

//     let overdue = false;

//     // Completing a recurring task.
//     if (
//       newDone &&
//       task.recurrenceType === "recurring"
//     ) {
//       const nextDate = calculateNextDate(
//         currentDate,
//         task.recurrenceFrequency,
//         task.customIntervalDays
//       );

//       // Move the scheduled date to the next occurrence.
//       scheduledDate = nextDate;

//       // Clear the pending recurrence date.
//       nextOccurrenceDate = "";

//       // Prepare the task for its next occurrence.
//       overdue = false;
//     }

//     // Completing a one-off task.
//     else if (newDone) {
//       overdue = false;
//       nextOccurrenceDate = "";
//     }

//     // Manually reopening a completed task.
//     else {
//       scheduledDate = currentDate;
//       nextOccurrenceDate = "";
//       overdue = false;
//     }

//     try {
//       const updateData = {
//         scheduledDate,
//         overdue,
//         nextOccurrenceDate,
//         updatedAt: serverTimestamp(),
//       };

//       // Update done only for one-off tasks.
//       if (task.recurrenceType !== "recurring") {
//         updateData.done = newDone;
//       }

//       await updateDoc(
//         doc(db, "users", user.uid, "tasks", task.id),
//         updateData
//       );
//     } catch (err) {
//       console.error("Toggle task error:", err);
//       setError("Unable to update task status.");
//     }
//   }

//   /* -------------------- DELETE TASK -------------------- */

//   async function removeTask(task) {
//     if (!user) return;

//     const confirmed = window.confirm(
//       `Delete "${task.title}"? This action cannot be undone.`
//     );

//     if (!confirmed) return;

//     try {
//       await deleteDoc(
//         doc(db, "users", user.uid, "tasks", task.id)
//       );
//     } catch (err) {
//       console.error("Delete task error:", err);
//       setError("Unable to delete this task.");
//     }
//   }

//   /* -------------------- SUBTASK FUNCTIONS -------------------- */

//   function toggleSubtasks(taskId) {
//     setExpandedTasks((current) => ({
//       ...current,
//       [taskId]: !current[taskId],
//     }));
//   }

//   function startAddSubtask(taskId) {
//     setSubtaskEditor({
//       taskId,
//       subtaskId: null,
//       title: "",
//     });

//     setExpandedTasks((current) => ({
//       ...current,
//       [taskId]: true,
//     }));
//   }

//   function startEditSubtask(taskId, subtask) {
//     setSubtaskEditor({
//       taskId,
//       subtaskId: subtask.id,
//       title: subtask.title,
//     });
//   }

//   function cancelSubtaskEditor() {
//     setSubtaskEditor({
//       taskId: null,
//       subtaskId: null,
//       title: "",
//     });
//   }

//   async function saveSubtask(e, task) {
//     e.preventDefault();

//     if (!user || !subtaskEditor.title.trim()) return;

//     setSubtaskSaving(true);
//     setError("");

//     try {
//       const existingSubtasks = Array.isArray(task.subtasks)
//         ? task.subtasks
//         : [];

//       let updatedSubtasks;

//       if (subtaskEditor.subtaskId) {
//         updatedSubtasks = existingSubtasks.map((subtask) =>
//           subtask.id === subtaskEditor.subtaskId
//             ? {
//                 ...subtask,
//                 title: subtaskEditor.title.trim(),
//                 updatedAt: new Date().toISOString(),
//               }
//             : subtask
//         );
//       } else {
//         const newSubtask = {
//           id: crypto.randomUUID(),
//           title: subtaskEditor.title.trim(),
//           done: false,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };

//         updatedSubtasks = [...existingSubtasks, newSubtask];
//       }

//       await updateDoc(
//         doc(db, "users", user.uid, "tasks", task.id),
//         {
//           subtasks: updatedSubtasks,
//           updatedAt: serverTimestamp(),
//         }
//       );

//       cancelSubtaskEditor();
//     } catch (err) {
//       console.error("Save subtask error:", err);
//       setError("Unable to save this subtask. Please try again.");
//     } finally {
//       setSubtaskSaving(false);
//     }
//   }

//   async function toggleSubtask(task, subtaskId) {
//     if (!user) return;

//     try {
//       const existingSubtasks = Array.isArray(task.subtasks)
//         ? task.subtasks
//         : [];

//       const updatedSubtasks = existingSubtasks.map((subtask) =>
//         subtask.id === subtaskId
//           ? {
//               ...subtask,
//               done: !subtask.done,
//               updatedAt: new Date().toISOString(),
//             }
//           : subtask
//       );

//       await updateDoc(
//         doc(db, "users", user.uid, "tasks", task.id),
//         {
//           subtasks: updatedSubtasks,
//           updatedAt: serverTimestamp(),
//         }
//       );
//     } catch (err) {
//       console.error("Toggle subtask error:", err);
//       setError("Unable to update subtask.");
//     }
//   }

//   async function deleteSubtask(task, subtaskId) {
//     if (!user) return;

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this subtask?"
//     );

//     if (!confirmed) return;

//     try {
//       const existingSubtasks = Array.isArray(task.subtasks)
//         ? task.subtasks
//         : [];

//       const updatedSubtasks = existingSubtasks.filter(
//         (subtask) => subtask.id !== subtaskId
//       );

//       await updateDoc(
//         doc(db, "users", user.uid, "tasks", task.id),
//         {
//           subtasks: updatedSubtasks,
//           updatedAt: serverTimestamp(),
//         }
//       );

//       if (subtaskEditor.subtaskId === subtaskId) {
//         cancelSubtaskEditor();
//       }
//     } catch (err) {
//       console.error("Delete subtask error:", err);
//       setError("Unable to delete this subtask.");
//     }
//   }

//   /* -------------------- FILTER SELECTION -------------------- */

//   function chooseFilter(filter) {
//     setActiveFilter(filter);

//     if (filter !== "date") {
//       setSelectedDate("");
//     }
//   }

//   function chooseDate(value) {
//     setSelectedDate(value);
//     setActiveFilter(value ? "date" : "all");
//   }

//   const filterTitle = {
//     all: "All active tasks",
//     unscheduled: "Unscheduled tasks",
//     today: "Today's tasks",
//     tomorrow: "Tomorrow's tasks",
//     completed: "Completed tasks",
//     date: selectedDate
//       ? `Tasks for ${formatDate(selectedDate)}`
//       : "Select a date",
//   };

//   /* -------------------- RENDER -------------------- */

//   return (
//     <Page>
//       <PageHeading>
//         <div>
//           <HeadingTitle>My Tasks</HeadingTitle>

//           <HeadingSubtitle>
//             Organise your responsibilities and get things done.
//           </HeadingSubtitle>
//         </div>

//         <AddButton onClick={() => openNewTask()}>
//           ＋ Add task
//         </AddButton>
//       </PageHeading>

//       {/* STATS */}

//       <StatsGrid>
//         <StatCard>
//           <StatNumber>{counts.all}</StatNumber>
//           <StatLabel>Active tasks</StatLabel>
//         </StatCard>

//         <StatCard>
//           <StatNumber>{counts.today}</StatNumber>
//           <StatLabel>Due today</StatLabel>
//         </StatCard>

//         <StatCard>
//           <StatNumber>{counts.completed}</StatNumber>
//           <StatLabel>Completed</StatLabel>
//         </StatCard>
//       </StatsGrid>

//       {/* FILTERS */}

//       <FilterSection>
//         <FilterHeading>FILTER TASKS</FilterHeading>

//         <FilterScroll>
//           <FilterButton
//             $active={activeFilter === "today"}
//             onClick={() => chooseFilter("today")}
//           >
//             Today ({counts.today})
//           </FilterButton>

//           <FilterButton
//             $active={activeFilter === "tomorrow"}
//             onClick={() => chooseFilter("tomorrow")}
//           >
//             Tomorrow ({counts.tomorrow})
//           </FilterButton>

//           <FilterButton
//             $active={activeFilter === "completed"}
//             onClick={() => chooseFilter("completed")}
//           >
//             Completed ({counts.completed})
//           </FilterButton>

//           <FilterButton
//             $active={activeFilter === "all"}
//             onClick={() => chooseFilter("all")}
//           >
//             All ({counts.all})
//           </FilterButton>
//         </FilterScroll>

//         <DateFilter>
//           <DateInput
//             type="date"
//             value={selectedDate}
//             onChange={(e) => chooseDate(e.target.value)}
//             aria-label="Select task date"
//           />

//           {selectedDate && (
//             <ClearDate onClick={() => chooseDate("")}>
//               Clear date
//             </ClearDate>
//           )}
//         </DateFilter>
//       </FilterSection>

//       {/* SEARCH */}

//       <SearchInput
//         type="search"
//         placeholder="⌕  Search tasks, areas, details..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {error && <ErrorMessage>{error}</ErrorMessage>}

//       {/* TASK LIST HEADER */}

//       <ListHeading>
//         <ListTitle>
//           {filterTitle[activeFilter]}
//         </ListTitle>

//         <ResultCount>
//           {filteredTasks.length} task(s)
//         </ResultCount>
//       </ListHeading>

//       {/* TASK LIST */}

//       {loading ? (
//         <Loading>Loading your tasks...</Loading>
//       ) : !user ? (
//         <Empty>
//           <EmptyIcon>🔐</EmptyIcon>

//           <EmptyTitle>Sign in required</EmptyTitle>

//           <EmptyText>
//             Please sign in to access your personal tasks.
//           </EmptyText>
//         </Empty>
//       ) : filteredTasks.length === 0 ? (
//         <Empty>
//           <EmptyIcon>
//             {activeFilter === "completed" ? "🎉" : "☑️"}
//           </EmptyIcon>

//           <EmptyTitle>
//             {activeFilter === "completed"
//               ? "No completed tasks yet"
//               : "No tasks found"}
//           </EmptyTitle>

//           <EmptyText>
//             {activeFilter === "unscheduled"
//               ? "All your tasks are scheduled. Great work!"
//               : activeFilter === "date"
//               ? "There are no tasks scheduled for this date."
//               : "Add a task or choose another filter to get started."}
//           </EmptyText>

//           <AddButton
//             style={{ marginTop: 15 }}
//             onClick={() => openNewTask()}
//           >
//             ＋ Create a task
//           </AddButton>
//         </Empty>
//       ) : (
//         filteredTasks.map((task) => {
//           const isOverdue =
//             !task.done &&
//             (
//               task.overdue ||
//               (
//                 task.scheduledDate &&
//                 task.scheduledDate < today
//               )
//             );

//           return (
//             <TaskCard key={task.id}>
//               <TaskTop>
//                 <CheckButton
//                   $done={task.done}
//                   onClick={() => toggleTask(task)}
//                   aria-label={
//                     task.done
//                       ? "Mark task as incomplete"
//                       : "Mark task as completed"
//                   }
//                 >
//                   {task.done ? "✓" : ""}
//                 </CheckButton>

//                 <TaskMain>
//                   <TaskTitle $done={task.done}>
//                     {task.title}
//                   </TaskTitle>

//                   {task.details && (
//                     <TaskDetails>
//                       {task.details}
//                     </TaskDetails>
//                   )}
//                 </TaskMain>
//               </TaskTop>

//               {/* TASK INFORMATION */}

//               <TaskMeta>
//                 <MetaTag $tone="blue">
//                   {task.area || "Personal"}
//                 </MetaTag>

//                 <MetaTag>
//                   {task.priority || "Medium"} Priority
//                 </MetaTag>

//                 <MetaTag $tone="blue">
//                   {task.recurrenceType === "recurring"
//                     ? `↻ ${
//                         RECURRENCE_OPTIONS.find(
//                           (item) =>
//                             item.value === task.recurrenceFrequency
//                         )?.label || "Recurring"
//                       }`
//                     : "One-off"}
//                 </MetaTag>

//                 <MetaTag>
//                   {task.scheduledDate
//                     ? formatDate(task.scheduledDate)
//                     : "No date"}
//                 </MetaTag>

//                 <MetaTag>
//                   {formatTime(task.time)}
//                 </MetaTag>

//                 {task.done ? (
//                   <MetaTag $tone="green">
//                     COMPLETED
//                   </MetaTag>
//                 ) : isOverdue ? (
//                   <MetaTag $tone="red">
//                     OVERDUE
//                   </MetaTag>
//                 ) : null}
//               </TaskMeta>

//               {/* TASK ACTIONS */}

//               <TaskActions>
//                 <ActionButton onClick={() => openEditTask(task)}>
//                   ✎ Edit
//                 </ActionButton>

//                 <ActionButton onClick={() => toggleTask(task)}>
//                   {task.done ? "↶ Reopen" : "✓ Complete"}
//                 </ActionButton>

//                 <ActionButton
//                   onClick={() => removeTask(task)}
//                   style={{ color: "#ff9999" }}
//                 >
//                   Delete
//                 </ActionButton>
//               </TaskActions>

//               {/* SUBTASKS */}

//               <SubtasksSection>
//                 {(() => {
//                   const subtasks = Array.isArray(task.subtasks)
//                     ? task.subtasks
//                     : [];

//                   const completedSubtasks = subtasks.filter(
//                     (subtask) => subtask.done
//                   ).length;

//                   const progress = subtasks.length
//                     ? Math.round(
//                         (completedSubtasks / subtasks.length) * 100
//                       )
//                     : 0;

//                   const isExpanded = !!expandedTasks[task.id];

//                   const isEditingThisTask =
//                     subtaskEditor.taskId === task.id;

//                   return (
//                     <>
//                       <SubtasksHeader>
//                         <SubtasksTitle>
//                           ↳ Subtasks ({completedSubtasks}/{subtasks.length})
//                         </SubtasksTitle>

//                         <SmallAction
//                           onClick={() => toggleSubtasks(task.id)}
//                         >
//                           {isExpanded ? "Hide ▲" : "Show ▼"}
//                         </SmallAction>
//                       </SubtasksHeader>

//                       {subtasks.length > 0 && (
//                         <SubtaskProgress>
//                           <SubtaskProgressFill $width={progress} />
//                         </SubtaskProgress>
//                       )}

//                       {isExpanded && (
//                         <>
//                           {subtasks.length === 0 ? (
//                             <div
//                               style={{
//                                 color: "#8997b0",
//                                 fontSize: 10,
//                                 padding: "8px 0",
//                               }}
//                             >
//                               No subtasks yet. Break this task into smaller steps.
//                             </div>
//                           ) : (
//                             subtasks.map((subtask) => (
//                               <SubtaskRow key={subtask.id}>
//                                 <SubtaskCheck
//                                   type="button"
//                                   $done={subtask.done}
//                                   onClick={() =>
//                                     toggleSubtask(task, subtask.id)
//                                   }
//                                 >
//                                   {subtask.done ? "✓" : ""}
//                                 </SubtaskCheck>

//                                 <SubtaskName $done={subtask.done}>
//                                   {subtask.title}
//                                 </SubtaskName>

//                                 <SubtaskActions>
//                                   <SmallAction
//                                     type="button"
//                                     onClick={() =>
//                                       startEditSubtask(task.id, subtask)
//                                     }
//                                   >
//                                     Edit
//                                   </SmallAction>

//                                   <SmallAction
//                                     type="button"
//                                     $danger
//                                     onClick={() =>
//                                       deleteSubtask(task, subtask.id)
//                                     }
//                                   >
//                                     Delete
//                                   </SmallAction>
//                                 </SubtaskActions>
//                               </SubtaskRow>
//                             ))
//                           )}

//                           {isEditingThisTask && (
//                             <SubtaskInputArea
//                               onSubmit={(e) => saveSubtask(e, task)}
//                             >
//                               <SubtaskInput
//                                 autoFocus
//                                 placeholder={
//                                   subtaskEditor.subtaskId
//                                     ? "Edit subtask..."
//                                     : "Enter a new subtask..."
//                                 }
//                                 value={subtaskEditor.title}
//                                 onChange={(e) =>
//                                   setSubtaskEditor((current) => ({
//                                     ...current,
//                                     title: e.target.value,
//                                   }))
//                                 }
//                               />

//                               <SubtaskSaveButton
//                                 type="submit"
//                                 disabled={
//                                   subtaskSaving ||
//                                   !subtaskEditor.title.trim()
//                                 }
//                               >
//                                 {subtaskSaving ? "..." : "Save"}
//                               </SubtaskSaveButton>

//                               <SmallAction
//                                 type="button"
//                                 onClick={cancelSubtaskEditor}
//                               >
//                                 ✕
//                               </SmallAction>
//                             </SubtaskInputArea>
//                           )}

//                           {!isEditingThisTask && !task.done && (
//                             <AddSubtaskButton
//                               type="button"
//                               onClick={() => startAddSubtask(task.id)}
//                             >
//                               ＋ Add subtask
//                             </AddSubtaskButton>
//                           )}
//                         </>
//                       )}
//                     </>
//                   );
//                 })()}
//               </SubtasksSection>
//             </TaskCard>
//           );
//         })
//       )}

//       {/* -------------------- REUSABLE TASK MODAL -------------------- */}

//       <TaskModal
//         isOpen={showModal}
//         onClose={closeTaskModal}
//         user={user}
//         task={editingTask}
//         initialData={newTaskInitialData}
//         onSaved={(savedTask) => {
//           console.log("Task saved:", savedTask);
//         }}
//       />
//     </Page>
//   );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import Swal from "sweetalert2";

/* =========================
   PRIORITY CONFIGURATION
========================= */

const PRIORITIES = {
  critical: {
    label: "Critical",
    order: 1,
    color: "#ef4444",
    background: "rgba(239,68,68,0.12)",
  },
  high: {
    label: "High",
    order: 2,
    color: "#f97316",
    background: "rgba(249,115,22,0.12)",
  },
  medium: {
    label: "Medium",
    order: 3,
    color: "#eab308",
    background: "rgba(234,179,8,0.12)",
  },
  low: {
    label: "Low",
    order: 4,
    color: "#22c55e",
    background: "rgba(34,197,94,0.12)",
  },
};

const FILTERS = ["all", "active", "completed", "overdue"];

/* =========================
   DATE HELPERS
========================= */

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(task) {
  return (
    !task.done &&
    task.deadlineDate &&
    task.deadlineDate < getToday()
  );
}

function getPriority(task) {
  const priority = String(task.priority || "medium").toLowerCase();

  return PRIORITIES[priority]
    ? priority
    : "medium";
}

/* =========================
   MAIN COMPONENT
========================= */

export default function PlanOfTheDay() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savingItems, setSavingItems] = useState({});

  /* =========================
     AUTHENTICATION
  ========================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  /* =========================
     REALTIME PROJECT LISTENER
  ========================= */

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const projectsRef = collection(
      db,
      "users",
      user.uid,
      "projects"
    );

    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        const projectList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProjects(projectList);
        setLoading(false);
      },
      (error) => {
        console.error("Projects listener error:", error);
        setLoading(false);

        Swal.fire({
          title: "Unable to load projects",
          text: "Please refresh the page and try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    );

    return () => unsubscribe();
  }, [user]);

  /* =========================
     FLATTEN ALL PROJECT TASKS
  ========================= */

  const allTasks = useMemo(() => {
    const result = [];

    projects.forEach((project) => {
      (project.tasks || []).forEach((task) => {
        result.push({
          ...task,
          projectId: project.id,
          projectTitle: project.title || "Untitled Project",
          project,
        });
      });
    });

    return result.sort((a, b) => {
      // Incomplete tasks appear before completed tasks.
      if (!!a.done !== !!b.done) {
        return a.done ? 1 : -1;
      }

      // Sort by priority.
      const priorityDifference =
        PRIORITIES[getPriority(a)].order -
        PRIORITIES[getPriority(b)].order;

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      // Within the same priority, overdue tasks appear first.
      if (isOverdue(a) !== isOverdue(b)) {
        return isOverdue(a) ? -1 : 1;
      }

      // Then sort by deadline.
      if (a.deadlineDate && b.deadlineDate) {
        return a.deadlineDate.localeCompare(b.deadlineDate);
      }

      if (a.deadlineDate) return -1;
      if (b.deadlineDate) return 1;

      return 0;
    });
  }, [projects]);

  /* =========================
     STATISTICS
  ========================= */

  const stats = useMemo(() => {
    const total = allTasks.length;

    const completed = allTasks.filter(
      (task) => task.done
    ).length;

    const active = total - completed;

    const overdue = allTasks.filter(
      (task) => isOverdue(task)
    ).length;

    const critical = allTasks.filter(
      (task) => !task.done && getPriority(task) === "critical"
    ).length;

    return {
      total,
      completed,
      active,
      overdue,
      critical,
    };
  }, [allTasks]);

  /* =========================
     FILTER TASKS
  ========================= */

  const filteredTasks = useMemo(() => {
    let result = [...allTasks];

    if (filter === "active") {
      result = result.filter((task) => !task.done);
    }

    if (filter === "completed") {
      result = result.filter((task) => task.done);
    }

    if (filter === "overdue") {
      result = result.filter((task) => isOverdue(task));
    }

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((task) => {
        const searchableText = [
          task.title,
          task.details,
          task.projectTitle,
          task.priority,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchValue);
      });
    }

    return result;
  }, [allTasks, filter, search]);

  /* =========================
     GROUP TASKS BY PRIORITY
  ========================= */

  const groupedTasks = useMemo(() => {
    const groups = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    filteredTasks.forEach((task) => {
      groups[getPriority(task)].push(task);
    });

    return groups;
  }, [filteredTasks]);

  /* =========================
     UPDATE PROJECT TASKS
     ALL CHANGES GO TO FIRESTORE
  ========================= */

  async function saveProjectTasks(project, tasks, savingKey) {
    if (!user) return;

    setSavingItems((previous) => ({
      ...previous,
      [savingKey]: true,
    }));

    try {
      const projectRef = doc(
        db,
        "users",
        user.uid,
        "projects",
        project.id
      );

      await updateDoc(projectRef, {
        tasks,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Task update error:", error);

      Swal.fire({
        title: "Update failed",
        text: "Unable to save this change. Please try again.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSavingItems((previous) => ({
        ...previous,
        [savingKey]: false,
      }));
    }
  }

  /* =========================
     TOGGLE TASK COMPLETION
  ========================= */

  async function toggleTask(project, task) {
    if (!user) return;

    const savingKey = `task-${project.id}-${task.id}`;

    if (savingItems[savingKey]) return;

    const updatedTasks = (project.tasks || []).map((item) =>
      item.id === task.id
        ? {
            ...item,
            done: !item.done,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    await saveProjectTasks(
      project,
      updatedTasks,
      savingKey
    );
  }

  /* =========================
     TOGGLE SUBTASK COMPLETION
  ========================= */

  async function toggleSubtask(project, task, subtask) {
    if (!user) return;

    const savingKey = `subtask-${project.id}-${task.id}-${subtask.id}`;

    if (savingItems[savingKey]) return;

    const updatedTasks = (project.tasks || []).map((item) => {
      if (item.id !== task.id) return item;

      const updatedSubtasks = (item.subtasks || []).map(
        (subItem) =>
          subItem.id === subtask.id
            ? {
                ...subItem,
                done: !subItem.done,
              }
            : subItem
      );

      return {
        ...item,
        subtasks: updatedSubtasks,
        updatedAt: new Date().toISOString(),
      };
    });

    await saveProjectTasks(
      project,
      updatedTasks,
      savingKey
    );
  }

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <Page>
        <LoadingContainer>
          <Spinner />
          <p>Loading your plan...</p>
        </LoadingContainer>
      </Page>
    );
  }

  /* =========================
     PAGE UI
  ========================= */

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>LIFEOS WORKSPACE</Eyebrow>
          <PageTitle>Plan of the Day</PageTitle>
          <PageDescription>
            Your tasks from every project, organized by priority.
          </PageDescription>
        </div>

        <DateBadge>
          <span>Today</span>
          <strong>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </strong>
        </DateBadge>
      </Header>

      {/* =========================
          STATISTICS
      ========================= */}

      <StatsGrid>
        <StatCard>
          <StatLabel>Total Tasks</StatLabel>
          <StatValue>{stats.total}</StatValue>
          <StatHint>Across all projects</StatHint>
        </StatCard>

        <StatCard>
          <StatLabel>Active Tasks</StatLabel>
          <StatValue>{stats.active}</StatValue>
          <StatHint>Still to complete</StatHint>
        </StatCard>

        <StatCard>
          <StatLabel>Completed</StatLabel>
          <StatValue>{stats.completed}</StatValue>
          <StatHint>Successfully completed</StatHint>
        </StatCard>

        <StatCard $danger={stats.overdue > 0}>
          <StatLabel>Overdue</StatLabel>
          <StatValue $danger={stats.overdue > 0}>
            {stats.overdue}
          </StatValue>
          <StatHint>Past their deadlines</StatHint>
        </StatCard>
      </StatsGrid>

      {/* =========================
          FILTERS AND SEARCH
      ========================= */}

      <Toolbar>
        <FilterGroup>
          {FILTERS.map((item) => {
            const count =
              item === "all"
                ? stats.total
                : item === "active"
                ? stats.active
                : item === "completed"
                ? stats.completed
                : stats.overdue;

            return (
              <FilterButton
                key={item}
                $active={filter === item}
                onClick={() => setFilter(item)}
              >
                {item === "all"
                  ? "All"
                  : item.charAt(0).toUpperCase() + item.slice(1)}

                <FilterCount $active={filter === item}>
                  {count}
                </FilterCount>
              </FilterButton>
            );
          })}
        </FilterGroup>

        <SearchBox>
          <SearchIcon>⌕</SearchIcon>
          <SearchInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks or projects..."
          />
        </SearchBox>
      </Toolbar>

      {/* =========================
          TASK GROUPS
      ========================= */}

      <TaskSections>
        {Object.entries(groupedTasks).map(([priority, tasks]) => {
          if (tasks.length === 0) return null;

          const config = PRIORITIES[priority];

          return (
            <PrioritySection key={priority}>
              <PriorityHeader>
                <PriorityHeading>
                  <PriorityDot $color={config.color} />
                  <h2>{config.label}</h2>
                  <PriorityTotal>{tasks.length}</PriorityTotal>
                </PriorityHeading>
              </PriorityHeader>

              <TaskList>
                {tasks.map((task) => {
                  const project = task.project;
                  const overdue = isOverdue(task);
                  const subtasks = task.subtasks || [];

                  const completedSubtasks = subtasks.filter(
                    (item) => item.done
                  ).length;

                  return (
                    <TaskCard
                      key={`${task.projectId}-${task.id}`}
                      $overdue={overdue}
                      $completed={task.done}
                    >
                      {/* TASK HEADER */}

                      <TaskMain>
                        <TaskCheckbox
                          type="checkbox"
                          checked={!!task.done}
                          disabled={
                            !!savingItems[
                              `task-${project.id}-${task.id}`
                            ]
                          }
                          onChange={() =>
                            toggleTask(project, task)
                          }
                        />

                        <TaskContent>
                          <TaskTitleRow>
                            <TaskTitle $completed={task.done}>
                              {task.title}
                            </TaskTitle>

                            {overdue && (
                              <OverdueBadge>
                                OVERDUE
                              </OverdueBadge>
                            )}
                          </TaskTitleRow>

                          {task.details && (
                            <TaskDetails>
                              {task.details}
                            </TaskDetails>
                          )}

                          <TaskMeta>
                            <ProjectTag>
                              <span>◈</span>
                              {task.projectTitle}
                            </ProjectTag>

                            <TypeTag>
                              {task.type === "continuous"
                                ? "Continuous"
                                : "One-off"}
                            </TypeTag>

                            {task.deadlineDate && (
                              <DeadlineTag $overdue={overdue}>
                                <span>◷</span>
                                {overdue ? "Overdue: " : "Due: "}
                                {formatDate(task.deadlineDate)}
                              </DeadlineTag>
                            )}
                          </TaskMeta>
                        </TaskContent>
                      </TaskMain>

                      {/* SUBTASKS */}

                      {subtasks.length > 0 && (
                        <SubtasksArea>
                          <SubtasksHeader>
                            <span>SUBTASKS</span>
                            <SubtaskProgress>
                              {completedSubtasks}/{subtasks.length} completed
                            </SubtaskProgress>
                          </SubtasksHeader>

                          <SubtaskList>
                            {subtasks.map((subtask) => {
                              const subtaskKey =
                                `subtask-${project.id}-${task.id}-${subtask.id}`;

                              return (
                                <SubtaskRow key={subtask.id}>
                                  <SubtaskCheckbox
                                    type="checkbox"
                                    checked={!!subtask.done}
                                    disabled={!!savingItems[subtaskKey]}
                                    onChange={() =>
                                      toggleSubtask(
                                        project,
                                        task,
                                        subtask
                                      )
                                    }
                                  />

                                  <SubtaskTitle $completed={subtask.done}>
                                    {subtask.title}
                                  </SubtaskTitle>
                                </SubtaskRow>
                              );
                            })}
                          </SubtaskList>
                        </SubtasksArea>
                      )}

                      {task.done && (
                        <CompletedLabel>
                          <span>✓</span>
                          Completed
                        </CompletedLabel>
                      )}
                    </TaskCard>
                  );
                })}
              </TaskList>
            </PrioritySection>
          );
        })}

        {/* EMPTY STATE */}

        {filteredTasks.length === 0 && (
          <EmptyState>
            <EmptyIcon>✓</EmptyIcon>

            <h3>
              {search
                ? "No matching tasks"
                : filter === "overdue"
                ? "No overdue tasks"
                : filter === "completed"
                ? "No completed tasks yet"
                : filter === "active"
                ? "All caught up!"
                : "No tasks found"}
            </h3>

            <p>
              {search
                ? "Try another search term."
                : "Tasks added to your projects will appear here automatically."}
            </p>
          </EmptyState>
        )}
      </TaskSections>

      <FooterNote>
        Changes made here automatically update the original project tasks
        and subtasks.
      </FooterNote>
    </Page>
  );
}

/* =========================
   STYLES
========================= */

const Page = styled.main`
  min-height: 100vh;
  padding: 28px;
  background: #080d1b;
  color: #f8faff;

  @media (max-width: 700px) {
    padding: 18px 13px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Eyebrow = styled.div`
  color: #8190ad;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 9px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(25px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -1px;
`;

const PageDescription = styled.p`
  color: #8491aa;
  font-size: 13px;
  margin: 9px 0 0;
`;

const DateBadge = styled.div`
  background: #111a2e;
  border: 1px solid #26334c;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;

  span {
    font-size: 10px;
    color: #8491aa;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  strong {
    font-size: 13px;
    color: #f8faff;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
  margin-bottom: 25px;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 380px) {
    gap: 8px;
  }
`;

const StatCard = styled.div`
  background: #111a2e;
  border: 1px solid
    ${({ $danger }) => ($danger ? "rgba(239,68,68,.35)" : "#24314a")};
  padding: 17px;
  border-radius: 14px;
  min-width: 0;
`;

const StatLabel = styled.div`
  color: #8794ad;
  font-size: 11px;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 27px;
  font-weight: 800;
  margin-top: 10px;
  color: ${({ $danger }) => ($danger ? "#f87171" : "#f8faff")};
`;

const StatHint = styled.div`
  color: #687791;
  font-size: 10px;
  margin-top: 5px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 25px;

  @media (max-width: 850px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ $active }) => ($active ? "#3b82f6" : "#26334c")};
  background: ${({ $active }) => ($active ? "#1d3c78" : "#111a2e")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#9aa8bf")};
  padding: 9px 12px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;

  &:hover {
    border-color: #3b82f6;
  }
`;

const FilterCount = styled.span`
  min-width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#2563eb" : "#202d44")};
  color: #ffffff;
  font-size: 10px;
`;

const SearchBox = styled.div`
  width: 290px;
  max-width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  border: 1px solid #26334c;
  background: #111a2e;
  border-radius: 10px;

  @media (max-width: 850px) {
    width: 100%;
  }
`;

const SearchIcon = styled.span`
  color: #8290aa;
  font-size: 21px;
`;

const SearchInput = styled.input`
  min-width: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #ffffff;
  font-size: 12px;

  &::placeholder {
    color: #68758d;
  }
`;

const TaskSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 27px;
`;

const PrioritySection = styled.section``;

const PriorityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const PriorityHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  h2 {
    font-size: 14px;
    margin: 0;
    font-weight: 800;
  }
`;

const PriorityDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 10px ${({ $color }) => $color}55;
`;

const PriorityTotal = styled.span`
  background: #1a263b;
  color: #9ba9c0;
  border-radius: 6px;
  padding: 3px 7px;
  font-size: 10px;
  font-weight: 700;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

const TaskCard = styled.article`
  background: #111a2e;
  border: 1px solid
    ${({ $overdue }) => ($overdue ? "rgba(239,68,68,.5)" : "#24314a")};
  border-left: 3px solid
    ${({ $overdue, $completed }) =>
      $completed ? "#22c55e" : $overdue ? "#ef4444" : "#263b5e"};
  border-radius: 12px;
  padding: 16px;
  opacity: ${({ $completed }) => ($completed ? ".72" : "1")};
  transition: border-color .2s, opacity .2s;

  &:hover {
    border-color: ${({ $overdue }) =>
      $overdue ? "#ef4444" : "#3b82f6"};
  }
`;

const TaskMain = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
`;

const TaskCheckbox = styled.input`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: #2563eb;
  cursor: pointer;
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 750;
  color: ${({ $completed }) => ($completed ? "#8290a8" : "#f8faff")};
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};
  overflow-wrap: anywhere;
`;

const OverdueBadge = styled.span`
  background: rgba(239,68,68,.15);
  color: #f87171;
  border: 1px solid rgba(239,68,68,.3);
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .5px;
`;

const TaskDetails = styled.p`
  margin: 7px 0 0;
  color: #8997af;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ProjectTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #9ebdff;
  background: rgba(59,130,246,.1);
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;

  span {
    font-size: 12px;
  }
`;

const TypeTag = styled.span`
  background: #202c41;
  color: #9aa8bf;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
`;

const DeadlineTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: ${({ $overdue }) =>
    $overdue ? "rgba(239,68,68,.13)" : "#202c41"};
  color: ${({ $overdue }) => ($overdue ? "#f87171" : "#9aa8bf")};
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: ${({ $overdue }) => ($overdue ? "800" : "500")};
`;

const SubtasksArea = styled.div`
  margin: 15px 0 0 31px;
  padding: 13px 0 0;
  border-top: 1px solid #26334a;

  @media (max-width: 500px) {
    margin-left: 8px;
  }
`;

const SubtasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  > span {
    color: #72819c;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 1px;
  }
`;

const SubtaskProgress = styled.span`
  color: #75839c;
  font-size: 10px;
`;

const SubtaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const SubtaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const SubtaskCheckbox = styled.input`
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
`;

const SubtaskTitle = styled.span`
  color: ${({ $completed }) => ($completed ? "#68758d" : "#c1ccdc")};
  font-size: 11px;
  line-height: 1.5;
  text-decoration: ${({ $completed }) =>
    $completed ? "line-through" : "none"};
  overflow-wrap: anywhere;
`;

const CompletedLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 13px 0 0 31px;
  color: #4ade80;
  font-size: 10px;
  font-weight: 800;

  span {
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 65px 20px;
  border: 1px dashed #2a3851;
  background: #111a2e;
  border-radius: 14px;

  h3 {
    margin: 14px 0 7px;
    font-size: 16px;
  }

  p {
    color: #8190a9;
    font-size: 12px;
    line-height: 1.6;
  }
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(34,197,94,.12);
  color: #4ade80;
  font-size: 23px;
`;

const FooterNote = styled.p`
  text-align: center;
  color: #64738d;
  font-size: 10px;
  margin: 30px 0 10px;
`;

const LoadingContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  color: #91a0b8;
  font-size: 13px;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #263650;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin .8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
