
"use client";

import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0;
  background: rgba(0, 0, 0, .72);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: #131e33;
  color: #f8faff;
  border: 1px solid #293750;
  border-radius: 24px 24px 0 0;
  padding: 21px 19px calc(22px + env(safe-area-inset-bottom));
  max-height: 88%;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  color: #f8faff;
  font-size: 17px;
  margin: 0 0 5px;
`;

const Muted = styled.div`
  font-size: 11px;
  color: #8997b0;
`;

const ModuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 16px;
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

const SecondaryButton = styled.button`
  width: 100%;
  border: 1px solid #35425a;
  border-radius: 13px;
  background: #192640;
  color: #c2cde0;
  padding: 13px;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 750;

  &:hover {
    border-color: #8878ff;
    color: white;
  }
`;

const modules = [
//   {
//     name: "Universal Inbox",
//     desc: "Capture everything",
//     icon: "📥",
//     bg: "#eeedff",
//     href: "/dashboard/inbox",
//   },
//   {
//     name: "Calendar",
//     desc: "Events and time blocks",
//     icon: "📅",
//     bg: "#e8f5ff",
//     href: "/dashboard/calendar",
//   },
//   {
//     name: "My Tasks",
//     desc: "One-off and recurring",
//     icon: "☑️",
//     bg: "#eaf8f0",
//     href: "/dashboard/tasks",
//   },
//   {
//     name: "Projects",
//     desc: "Milestones and deliverables",
//     icon: "📂",
//     bg: "#fff1e9",
//     href: "/dashboard/projects",
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
  {
    name: "Settings",
    desc: "Profile and preferences",
    icon: "⚙️",
    bg: "#f0f2f6",
    href: "/dashboard/settings",
  },
];

export default function ModuleSelectionModal({ onClose, onSelect }) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Explore LIFEOS</ModalTitle>

        <Muted>Choose a workspace to open</Muted>

        <ModuleGrid>
          {modules.map((module) => (
            <Module
              key={module.name}
              type="button"
              onClick={() => onSelect(module.href)}
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

        <SecondaryButton type="button" onClick={onClose}>
          Close
        </SecondaryButton>
      </Modal>
    </Overlay>
  );
}
