
// "use client";

// import { useEffect, useState } from "react";
// import styled from "styled-components";
// import {
//   addDoc,
//   collection,
//   doc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/firebaseConfig";

// const Overlay = styled.div`
//   position: fixed;
//   z-index: 1000;
//   inset: 0;
//   background: rgba(0, 0, 0, 0.76);
//   display: flex;
//   justify-content: center;
//   align-items: flex-end;
//   padding: 0;
// `;

// const Modal = styled.div`
//   width: 100%;
//   max-width: 480px;
//   max-height: 90dvh;
//   overflow-y: auto;
//   background: #131e33;
//   border: 1px solid #293750;
//   border-radius: 23px 23px 0 0;
//   padding: 22px 19px calc(25px + env(safe-area-inset-bottom));
//   color: white;
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   gap: 10px;
//   margin-bottom: 17px;
// `;

// const Title = styled.h2`
//   font-size: 17px;
//   font-weight: 900;
//   margin: 0;
// `;

// const Subtitle = styled.p`
//   font-size: 10px;
//   color: #8997b0;
//   margin: 5px 0 0;
// `;

// const Close = styled.button`
//   width: 32px;
//   height: 32px;
//   border-radius: 10px;
//   border: 1px solid #35425a;
//   background: #192640;
//   color: white;
//   cursor: pointer;
// `;

// const Label = styled.label`
//   display: block;
//   font-size: 10px;
//   font-weight: 800;
//   color: #c2cde0;
//   margin: 13px 0 7px;
// `;

// const Field = styled.input`
//   width: 100%;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   color-scheme: dark;
//   border-radius: 11px;
//   padding: 12px;
//   outline: none;
//   font-size: 11px;

//   &:focus {
//     border-color: #8878ff;
//   }
// `;

// const TextArea = styled.textarea`
//   width: 100%;
//   min-height: 85px;
//   resize: vertical;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   border-radius: 11px;
//   padding: 12px;
//   outline: none;
//   font-size: 11px;

//   &:focus {
//     border-color: #8878ff;
//   }
// `;

// const Select = styled.select`
//   width: 100%;
//   border: 1px solid #35425a;
//   background: #0c1425 !important;
//   color: white !important;
//   color-scheme: dark;
//   border-radius: 11px;
//   padding: 12px;
//   outline: none;
//   font-size: 11px;
// `;

// const Save = styled.button`
//   width: 100%;
//   border: 0;
//   border-radius: 12px;
//   background: linear-gradient(110deg, #7059f5, #477eea);
//   color: white;
//   font-weight: 850;
//   padding: 14px;
//   margin-top: 19px;
//   cursor: pointer;
//   opacity: ${(p) => (p.disabled ? 0.6 : 1)};
// `;

// const Cancel = styled.button`
//   width: 100%;
//   border: 1px solid #35425a;
//   border-radius: 12px;
//   background: #192640;
//   color: #c2cde0;
//   padding: 13px;
//   margin-top: 8px;
//   font-size: 10px;
//   font-weight: 800;
//   cursor: pointer;
// `;

// const ErrorMessage = styled.div`
//   background: rgba(255, 100, 100, 0.1);
//   border: 1px solid rgba(255, 100, 100, 0.25);
//   color: #ff9999;
//   padding: 11px;
//   border-radius: 10px;
//   font-size: 10px;
//   margin-top: 12px;
// `;

// export default function ProjectModal({
//   isOpen,
//   onClose,
//   user,
//   project = null,
//   onSaved,
// }) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     type: "oneOff",
//     deadlineDate: "",
//   });

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const editing = Boolean(project?.id);

//   useEffect(() => {
//     if (!isOpen) return;

//     setForm({
//       title: project?.title || "",
//       description: project?.description || "",
//       type: project?.type || "oneOff",
//       deadlineDate: project?.deadlineDate || "",
//     });

//     setError("");
//   }, [isOpen, project]);

//   function change(field, value) {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!user) {
//       setError("Please sign in before saving a project.");
//       return;
//     }

//     if (!form.title.trim()) {
//       setError("Enter a project title.");
//       return;
//     }

//     if (
//       form.type === "oneOff" &&
//       !form.deadlineDate
//     ) {
//       setError("A deadline date is required for a one-off project.");
//       return;
//     }

//     setSaving(true);
//     setError("");

//     const data = {
//       title: form.title.trim(),
//       description: form.description.trim(),
//       type: form.type,
//       deadlineDate:
//         form.type === "oneOff"
//           ? form.deadlineDate
//           : "",
//       updatedAt: serverTimestamp(),
//     };

//     try {
//       if (editing) {
//         await updateDoc(
//           doc(
//             db,
//             "users",
//             user.uid,
//             "projects",
//             project.id
//           ),
//           data
//         );
//       } else {
//         await addDoc(
//           collection(
//             db,
//             "users",
//             user.uid,
//             "projects"
//           ),
//           {
//             ...data,
//             done: false,
//             tasks: [],
//             createdAt: serverTimestamp(),
//           }
//         );
//       }

//       onSaved?.();
//       onClose?.();
//     } catch (err) {
//       console.error("Save project error:", err);

//       setError(
//         "The project could not be saved. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!isOpen) return null;

//   return (
//     <Overlay
//       onClick={() => !saving && onClose?.()}
//     >
//       <Modal onClick={(e) => e.stopPropagation()}>
//         <Header>
//           <div>
//             <Title>
//               {editing
//                 ? "Edit project"
//                 : "Create a project"}
//             </Title>

//             <Subtitle>
//               Organize your projects and deadlines.
//             </Subtitle>
//           </div>

//           <Close
//             type="button"
//             disabled={saving}
//             onClick={onClose}
//           >
//             ×
//           </Close>
//         </Header>

//         <form onSubmit={handleSubmit}>
//           <Label>Project title</Label>

//           <Field
//             required
//             autoFocus
//             placeholder="e.g. Launch LIFEOS"
//             value={form.title}
//             onChange={(e) =>
//               change("title", e.target.value)
//             }
//           />

//           <Label>Description</Label>

//           <TextArea
//             placeholder="Project goals, notes, or details..."
//             value={form.description}
//             onChange={(e) =>
//               change("description", e.target.value)
//             }
//           />

//           <Label>Project type</Label>

//           <Select
//             value={form.type}
//             onChange={(e) => {
//               const type = e.target.value;

//               setForm((prev) => ({
//                 ...prev,
//                 type,
//                 deadlineDate:
//                   type === "continuous"
//                     ? ""
//                     : prev.deadlineDate,
//               }));
//             }}
//           >
//             <option value="oneOff">
//               One-off project
//             </option>

//             <option value="continuous">
//               Continuous project
//             </option>
//           </Select>

//           <Select
//   value={
//     taskForms[project.id]?.priority || "medium"
//   }
//   onChange={(e) =>
//     setTaskForms((prev) => ({
//       ...prev,
//       [project.id]: {
//         ...prev[project.id],
//         priority: e.target.value,
//       },
//     }))
//   }
// >
//   <option value="critical">Critical</option>
//   <option value="high">High</option>
//   <option value="medium">Medium</option>
//   <option value="low">Low</option>
// </Select>

//           {form.type === "oneOff" && (
//             <>
//               <Label>
//                 Project deadline (date only)
//               </Label>

//               <Field
//                 required
//                 type="date"
//                 value={form.deadlineDate}
//                 onChange={(e) =>
//                   change(
//                     "deadlineDate",
//                     e.target.value
//                   )
//                 }
//               />
//             </>
//           )}

//           {form.type === "continuous" && (
//             <Subtitle style={{ marginTop: 10 }}>
//               Continuous projects have no deadline or frequency.
//             </Subtitle>
//           )}

//           {error && (
//             <ErrorMessage>{error}</ErrorMessage>
//           )}

//           <Save
//             type="submit"
//             disabled={saving}
//           >
//             {saving
//               ? "Saving..."
//               : editing
//               ? "Update project"
//               : "Save project"}
//           </Save>

//           <Cancel
//             type="button"
//             disabled={saving}
//             onClick={onClose}
//           >
//             Cancel
//           </Cancel>
//         </form>
//       </Modal>
//     </Overlay>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

/* =========================
   STYLES
========================= */

const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0, 0, 0, 0.76);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 90dvh;
  overflow-y: auto;
  background: #131e33;
  border: 1px solid #293750;
  border-radius: 23px 23px 0 0;
  padding: 22px 19px calc(25px + env(safe-area-inset-bottom));
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 17px;
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 900;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 10px;
  color: #8997b0;
  margin: 5px 0 0;
`;

const Close = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #35425a;
  background: #192640;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: #c2cde0;
  margin: 13px 0 7px;
`;

const Field = styled.input`
  width: 100%;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  color-scheme: dark;
  border-radius: 11px;
  padding: 12px;
  outline: none;
  font-size: 11px;

  &:focus {
    border-color: #8878ff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 85px;
  resize: vertical;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  border-radius: 11px;
  padding: 12px;
  outline: none;
  font-size: 11px;

  &:focus {
    border-color: #8878ff;
  }
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  color-scheme: dark;
  border-radius: 11px;
  padding: 12px;
  outline: none;
  font-size: 11px;

  &:focus {
    border-color: #8878ff;
  }
`;

const Save = styled.button`
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  color: white;
  font-weight: 850;
  padding: 14px;
  margin-top: 19px;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

const Cancel = styled.button`
  width: 100%;
  border: 1px solid #35425a;
  border-radius: 12px;
  background: #192640;
  color: #c2cde0;
  padding: 13px;
  margin-top: 8px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.25);
  color: #ff9999;
  padding: 11px;
  border-radius: 10px;
  font-size: 10px;
  margin-top: 12px;
`;

/* =========================
   PROJECT MODAL
========================= */

export default function ProjectModal({
  isOpen,
  onClose,
  user,
  project = null,
  onSaved,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "oneOff",
    deadlineDate: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(project?.id);

  /* LOAD PROJECT DATA */

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      title: project?.title || "",
      description: project?.description || "",
      type: project?.type || "oneOff",
      deadlineDate: project?.deadlineDate || "",
    });

    setError("");
  }, [isOpen, project]);

  /* FORM CHANGE */

  function change(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /* SAVE PROJECT */

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving) return;

    if (!user) {
      setError("Please sign in before saving a project.");
      return;
    }

    if (!form.title.trim()) {
      setError("Enter a project title.");
      return;
    }

    if (
      form.type === "oneOff" &&
      !form.deadlineDate
    ) {
      setError(
        "A deadline date is required for a one-off project."
      );
      return;
    }

    setSaving(true);
    setError("");

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      deadlineDate:
        form.type === "oneOff"
          ? form.deadlineDate
          : "",
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(
          doc(
            db,
            "users",
            user.uid,
            "projects",
            project.id
          ),
          data
        );
      } else {
        await addDoc(
          collection(
            db,
            "users",
            user.uid,
            "projects"
          ),
          {
            ...data,
            done: false,
            tasks: [],
            createdAt: serverTimestamp(),
          }
        );
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Save project error:", err);

      setError(
        "The project could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Overlay
      onClick={() => !saving && onClose?.()}
    >
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>
            <Title>
              {editing
                ? "Edit project"
                : "Create a project"}
            </Title>

            <Subtitle>
              Organize your projects and deadlines.
            </Subtitle>
          </div>

          <Close
            type="button"
            disabled={saving}
            onClick={onClose}
          >
            ×
          </Close>
        </Header>

        <form onSubmit={handleSubmit}>
          <Label>Project title</Label>

          <Field
            required
            autoFocus
            placeholder="e.g. Launch LIFEOS"
            value={form.title}
            onChange={(e) =>
              change("title", e.target.value)
            }
          />

          <Label>Description</Label>

          <TextArea
            placeholder="Project goals, notes, or details..."
            value={form.description}
            onChange={(e) =>
              change("description", e.target.value)
            }
          />

          <Label>Project type</Label>

          <Select
            value={form.type}
            onChange={(e) => {
              const type = e.target.value;

              setForm((prev) => ({
                ...prev,
                type,
                deadlineDate:
                  type === "continuous"
                    ? ""
                    : prev.deadlineDate,
              }));
            }}
          >
            <option value="oneOff">
              One-off project
            </option>

            <option value="continuous">
              Continuous project
            </option>
          </Select>

          {form.type === "oneOff" && (
            <>
              <Label>
                Project deadline (date only)
              </Label>

              <Field
                required
                type="date"
                value={form.deadlineDate}
                onChange={(e) =>
                  change(
                    "deadlineDate",
                    e.target.value
                  )
                }
              />
            </>
          )}

          {form.type === "continuous" && (
            <Subtitle style={{ marginTop: 10 }}>
              Continuous projects have no deadline or frequency.
            </Subtitle>
          )}

          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}

          <Save
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
              ? "Update project"
              : "Save project"}
          </Save>

          <Cancel
            type="button"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Cancel>
        </form>
      </Modal>
    </Overlay>
  );
}
