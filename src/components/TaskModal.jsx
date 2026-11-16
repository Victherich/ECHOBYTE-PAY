
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

/* -------------------- HELPERS -------------------- */

function localDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const AREAS = [
  "Personal",
  "Business",
  "Family & Home",
  "Health",
  "Learning",
  "Finances",
  "Career",
  "Other",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const RECURRENCE_OPTIONS = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Every month" },
  { value: "quarterly", label: "Every 3 months" },
  { value: "halfYearly", label: "Every 6 months" },
  { value: "yearly", label: "Every year" },
  { value: "custom", label: "Custom interval" },
];

const DEFAULT_FORM = {
  title: "",
  area: "Personal",
  details: "",
  priority: "Medium",
  scheduledDate: "",
  time: "",
  recurrenceType: "oneOff",
  recurrenceFrequency: "daily",
  customIntervalDays: 1,
};

/* -------------------- STYLES -------------------- */

const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,.76);
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

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 17px;
`;

const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 900;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: 10px;
  color: #8997b0;
  margin: 5px 0 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #35425a;
  background: #192640;
  color: white;
  cursor: pointer;
`;

const FieldLabel = styled.label`
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

  &::placeholder {
    color: #68758d;
  }

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

  option {
    background: #0c1425;
    color: white;
  }

  &:focus {
    border-color: #8878ff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: white !important;
  border-radius: 11px;
  padding: 12px;
  outline: none;
  font-size: 11px;

  &::placeholder {
    color: #68758d;
  }

  &:focus {
    border-color: #8878ff;
  }
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const SaveButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  color: white;
  font-weight: 850;
  padding: 14px;
  margin-top: 19px;
  cursor: pointer;
  opacity: ${({ disabled }) => disabled ? .6 : 1};
`;

const CancelButton = styled.button`
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
`;

const ErrorMessage = styled.div`
  background: rgba(255,100,100,.1);
  border: 1px solid rgba(255,100,100,.25);
  color: #ff9999;
  padding: 11px;
  border-radius: 10px;
  font-size: 10px;
  margin-top: 12px;
  line-height: 1.5;
`;

/* -------------------- COMPONENT -------------------- */

export default function TaskModal({
  isOpen,
  onClose,
  user,
  task = null,
  initialData = {},
  onSaved,
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(task?.id);

  /* PREFILL FORM */

  useEffect(() => {
    if (!isOpen) return;

    const source = task || initialData || {};

    setForm({
      ...DEFAULT_FORM,
      title: source.title || "",
      area: source.area || "Personal",
      details: source.details || "",
      priority: source.priority || "Medium",
      scheduledDate: source.scheduledDate || "",
      time:
        source.time && source.time !== "Unscheduled"
          ? source.time
          : "",
      recurrenceType: source.recurrenceType || "oneOff",
      recurrenceFrequency:
        source.recurrenceFrequency || "daily",
      customIntervalDays: source.customIntervalDays || 1,
    });

    setError("");
  }, [isOpen, task, initialData]);

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* CLOSE */

  function handleClose() {
    if (saving) return;
    setError("");
    onClose?.();
  }

  /* SAVE / UPDATE TASK */

  async function saveTask(e) {
    e.preventDefault();

    if (!user) {
      setError("Please sign in before saving a task.");
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");

    const today = localDateString();

    const scheduledTime = form.time || "Unscheduled";

    const overdue =
      Boolean(form.scheduledDate) &&
      form.scheduledDate < today &&
      !(task?.done || false);

    const taskData = {
      title: form.title.trim(),
      area: form.area,
      details: form.details.trim(),
      priority: form.priority,
      scheduledDate: form.scheduledDate || "",
      time: scheduledTime,

      recurrenceType: form.recurrenceType || "oneOff",

      recurrenceFrequency:
        form.recurrenceType === "recurring"
          ? form.recurrenceFrequency
          : "",

      customIntervalDays:
        form.recurrenceType === "recurring" &&
        form.recurrenceFrequency === "custom"
          ? Number(form.customIntervalDays) || 1
          : 1,

      nextOccurrenceDate: task?.nextOccurrenceDate || "",

      overdue,
      updatedAt: serverTimestamp(),
    };

    try {
      let savedTask;

      if (isEditing) {
        await updateDoc(
          doc(db, "users", user.uid, "tasks", task.id),
          taskData
        );

        savedTask = {
          ...task,
          ...taskData,
        };
      } else {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "tasks"),
          {
            ...taskData,
            done: false,
            subtasks: [],
            sourceInboxId: "",
            createdAt: serverTimestamp(),
          }
        );

        savedTask = {
          id: docRef.id,
          ...taskData,
          done: false,
          subtasks: [],
          sourceInboxId: "",
        };
      }

      onSaved?.(savedTask);
      onClose?.();

    } catch (err) {
      console.error("Save task error:", err);
      setError("Your task could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>
              {isEditing ? "Edit task" : "Create a task"}
            </ModalTitle>

            <ModalSubtitle>
              Organise the task with its area, date and priority.
            </ModalSubtitle>
          </div>

          <CloseButton
            type="button"
            onClick={handleClose}
            disabled={saving}
          >
            ✕
          </CloseButton>
        </ModalHeader>

        <form onSubmit={saveTask}>
          <FieldLabel>Task title</FieldLabel>

          <Field
            autoFocus
            required
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) =>
              updateForm("title", e.target.value)
            }
          />

          <FieldLabel>Life area</FieldLabel>

          <Select
            value={form.area}
            onChange={(e) =>
              updateForm("area", e.target.value)
            }
          >
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Select>

          <FieldLabel>Additional details</FieldLabel>

          <TextArea
            placeholder="Add task descriptions, instructions or notes..."
            value={form.details}
            onChange={(e) =>
              updateForm("details", e.target.value)
            }
          />

          <TwoColumns>
            <div>
              <FieldLabel>Priority</FieldLabel>

              <Select
                value={form.priority}
                onChange={(e) =>
                  updateForm("priority", e.target.value)
                }
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <FieldLabel>Scheduled date</FieldLabel>

              <Field
                type="date"
            required
                value={form.scheduledDate}
                onChange={(e) =>
                  updateForm("scheduledDate", e.target.value)
                }
              />
            </div>
          </TwoColumns>

          <FieldLabel>Scheduled time</FieldLabel>

          <Field
            type="time"
            required
            value={form.time}
            onChange={(e) =>
              updateForm("time", e.target.value)
            }
          />

          <FieldLabel>Task repetition</FieldLabel>

          <Select
            value={form.recurrenceType}
            onChange={(e) =>
              updateForm("recurrenceType", e.target.value)
            }
          >
            <option value="oneOff">One-off task</option>
            <option value="recurring">Recurring task</option>
          </Select>

          {form.recurrenceType === "recurring" && (
            <>
              <FieldLabel>Repeat frequency</FieldLabel>

              <Select
                value={form.recurrenceFrequency}
                onChange={(e) =>
                  updateForm("recurrenceFrequency", e.target.value)
                }
              >
                {RECURRENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              {form.recurrenceFrequency === "custom" && (
                <>
                  <FieldLabel>
                    Repeat every how many days?
                  </FieldLabel>

                  <Field
                    type="number"
                    min="1"
                    max="365"
                    value={form.customIntervalDays}
                    onChange={(e) =>
                      updateForm(
                        "customIntervalDays",
                        Math.max(
                          1,
                          Math.min(
                            365,
                            Number(e.target.value) || 1
                          )
                        )
                      )
                    }
                  />
                </>
              )}
            </>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SaveButton type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEditing
              ? "Update task"
              : "Save task"}
          </SaveButton>

          <CancelButton
            type="button"
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </CancelButton>
        </form>
      </Modal>
    </Overlay>
  );
}
