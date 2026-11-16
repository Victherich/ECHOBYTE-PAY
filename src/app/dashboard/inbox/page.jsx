
"use client";

import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import TaskModal from "@/components/TaskModal";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";

/* ---------------- STYLES ---------------- */

const Content = styled.div`
  padding: 18px;
`;

const Section = styled.section`
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #131e33;
  border: 1px solid #293750;
  border-radius: 18px;
  padding: 15px;
`;

const PageIntro = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #f8faff;
  font-size: 19px;
  font-weight: 850;
  letter-spacing: -.5px;
  margin: 0 0 6px;
`;

const Description = styled.p`
  color: #8997b0;
  font-size: 11px;
  line-height: 1.6;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
`;

const Stat = styled.div`
  background: #131e33;
  border: 1px solid #293750;
  border-radius: 15px;
  padding: 12px 10px;
  min-width: 0;
`;

const StatIcon = styled.div`
  font-size: 17px;
  margin-bottom: 8px;
`;

const StatNumber = styled.div`
  color: #f8faff;
  font-size: 21px;
  font-weight: 900;
`;

const StatLabel = styled.div`
  font-size: 9px;
  color: #8997b0;
  margin-top: 4px;
`;

const SearchBox = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #35425a;
  border-radius: 13px;
  background: #0c1425 !important;
  color: #ffffff !important;
  outline: none;
  font-size: 11px;
  color-scheme: dark;

  &::placeholder {
    color: #68758d;
  }

  &:focus {
    border-color: #8878ff;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  flex-shrink: 0;
  border: 1px solid ${({ $active }) =>
    $active ? "#7965f4" : "#35425a"};
  background: ${({ $active }) =>
    $active ? "rgba(117,94,255,.18)" : "#131e33"};
  color: ${({ $active }) =>
    $active ? "#b9adff" : "#8997b0"};
  border-radius: 10px;
  padding: 9px 13px;
  font-size: 10px;
  font-weight: 800;
`;

const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1px 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #edf2ff;
  font-size: 13px;
  font-weight: 850;
`;

const Count = styled.span`
  color: #8997b0;
  font-size: 10px;
`;

const InboxItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 14px 0;
  border-bottom: 1px solid #293750;

  &:last-child {
    border-bottom: 0;
  }
`;

const ItemIcon = styled.div`
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || "#202b46"};
  font-size: 17px;
`;

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemTitle = styled.div`
  color: #e7edfa;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

const ItemMeta = styled.div`
  color: #8997b0;
  font-size: 9px;
  margin-top: 5px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 5px 7px;
  border-radius: 7px;
  background: rgba(120,105,255,.15);
  color: #b5a7ff;
  font-size: 8px;
  font-weight: 850;
  white-space: nowrap;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: 1px solid #35425a;
  background: #192640;
  color: #c2cde0;
  border-radius: 8px;
  padding: 7px 9px;
  font-size: 9px;
  font-weight: 750;

  &:hover {
    border-color: #8878ff;
    color: white;
  }

  &:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #ff9999;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 13px;
  background: linear-gradient(110deg, #7059f5, #477eea);
  color: white;
  font-weight: 850;
  padding: 14px;
  font-size: 11px;
  margin-top: 12px;

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
`;

const Empty = styled.div`
  padding: 30px 10px;
  color: #8997b0;
  text-align: center;
  font-size: 11px;
  line-height: 1.7;
`;

const EmptyIcon = styled.div`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0;
  background: rgba(0,0,0,.72);
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

const ModalTitle = styled.h3`
  color: #f8faff;
  font-size: 17px;
  margin: 0 0 5px;
`;

const Muted = styled.p`
  color: #8997b0;
  font-size: 10px;
  margin: 0;
  line-height: 1.5;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: #c2cde0;
  margin: 14px 0 7px;
`;

const Field = styled.input`
  width: 100%;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: #ffffff !important;
  border-radius: 12px;
  padding: 13px;
  outline: none;
  font-size: 12px;
  color-scheme: dark;

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
  color: #ffffff !important;
  border-radius: 12px;
  padding: 13px;
  outline: none;
  font-size: 12px;
  color-scheme: dark;

  option {
    background: #0c1425;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 75px;
  resize: vertical;
  border: 1px solid #35425a;
  background: #0c1425 !important;
  color: #ffffff !important;
  border-radius: 12px;
  padding: 13px;
  outline: none;
  font-size: 12px;
  color-scheme: dark;

  &::placeholder {
    color: #68758d;
  }

  &:focus {
    border-color: #8878ff;
  }
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
`;

const Notice = styled.div`
  color: ${({ $error }) => $error ? "#ff9999" : "#a99aff"};
  background: ${({ $error }) =>
    $error ? "rgba(255,100,100,.09)" : "rgba(120,105,255,.1)"};
  border: 1px solid ${({ $error }) =>
    $error ? "rgba(255,100,100,.25)" : "rgba(120,105,255,.2)"};
  border-radius: 12px;
  padding: 11px;
  margin-bottom: 13px;
  font-size: 10px;
  line-height: 1.5;
`;

/* ---------------- CONSTANTS ---------------- */

const types = [
  "All",
  "Idea",
  "Reminder",
  "Event",
  "Project",
  "Goal",
  "Note",
  "Shopping",
  "Appointment",
];

const typeIcons = {
  Idea: "💡",
  Reminder: "🔔",
  Event: "📅",
  Project: "📂",
  Goal: "🎯",
  Note: "📝",
  Shopping: "🛒",
  Appointment: "🤝",
};

const typeBackgrounds = {
  Idea: "#eeedff",
  Reminder: "#fff6df",
  Event: "#e8f5ff",
  Project: "#fff1e9",
  Goal: "#ffeef1",
  Note: "#e9f8f0",
  Shopping: "#fff6df",
  Appointment: "#e8f5ff",
};

const areas = [
  "Personal",
  "Business",
  "Family & Home",
  "Health",
  "Learning",
  "Finances",
  "Career",
  "Other",
];

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "Recently";

  return timestamp.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ---------------- COMPONENT ---------------- */

export default function InboxTab({ onCapture }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
 const [convertingItem, setConvertingItem] = useState(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Idea");
  const [area, setArea] = useState("Personal");
  const [details, setDetails] = useState("");

  /* Get authenticated user */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  /* Real-time Firestore inbox listener */

  useEffect(() => {
    if (!user?.uid) {
      setInbox([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const inboxRef = collection(db, "users", user.uid, "inbox");
    const inboxQuery = query(inboxRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      inboxQuery,
      snapshot => {
        const records = snapshot.docs.map(document => ({
          id: document.id,
          ...document.data(),
        }));

        setInbox(records);
        setLoading(false);
      },
      err => {
        console.error("Inbox loading error:", err);
        setError("Unable to load your inbox. Please check your connection and Firestore permissions.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  /* Search and filters */

  const filteredInbox = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return inbox.filter(item => {
      const matchesFilter =
        activeFilter === "All" || item.type === activeFilter;

      const matchesSearch =
        (item.title || "").toLowerCase().includes(searchText) ||
        (item.area || "").toLowerCase().includes(searchText) ||
        (item.details || "").toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [inbox, activeFilter, search]);

  /* Reset form */

  function resetForm() {
    setTitle("");
    setType("Idea");
    setArea("Personal");
    setDetails("");
    setEditingItem(null);
  }

  /* Open add modal */

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  /* Open edit modal */

  function openEditModal(item) {
    setEditingItem(item);
    setTitle(item.title || "");
    setType(item.type || "Idea");
    setArea(item.area || "Personal");
    setDetails(item.details || "");
    setShowModal(true);
  }

  /* Save new item or update existing item */

  async function saveItem(e) {
    e.preventDefault();

    if (!user?.uid || !title.trim() || saving) return;

    setSaving(true);
    setError("");

    const itemData = {
      title: title.trim(),
      type,
      area,
      details: details.trim(),
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingItem) {
        const itemRef = doc(
          db,
          "users",
          user.uid,
          "inbox",
          editingItem.id
        );

        await updateDoc(itemRef, itemData);
      } else {
        const inboxRef = collection(
          db,
          "users",
          user.uid,
          "inbox"
        );

        await addDoc(inboxRef, {
          ...itemData,
          createdAt: serverTimestamp(),
          status: "inbox",
        });
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Saving inbox item failed:", err);
      setError("Unable to save this item. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  /* Delete item */

  async function deleteItem(item) {
    if (!user?.uid || deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "inbox", item.id)
      );
    } catch (err) {
      console.error("Deleting inbox item failed:", err);
      setError("Unable to delete this item. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  /* Convert inbox item into a Firestore task */

function convertToTask(item) {
  setError("");
  setConvertingItem(item);
}

  /* ---------------- RENDER ---------------- */

  if (authLoading || loading) {
    return (
      <Content>
        <Empty>
          <EmptyIcon>📥</EmptyIcon>
          Loading your inbox...
        </Empty>
      </Content>
    );
  }

  if (!user) {
    return (
      <Content>
        <Empty>
          <EmptyIcon>🔐</EmptyIcon>
          Please sign in to access your inbox.
        </Empty>
      </Content>
    );
  }

  return (
    <>
      <Content>
        <PageIntro>
          <Title>Universal Inbox</Title>
          <Description>
            Everything you've captured, waiting to be organised.
            Keep your ideas, reminders and important information in one place.
          </Description>
        </PageIntro>

        {error && (
          <Notice $error>
            {error}
          </Notice>
        )}

        <Section>
          <StatsGrid>
            <Stat>
              <StatIcon>📥</StatIcon>
              <StatNumber>{inbox.length}</StatNumber>
              <StatLabel>Total items</StatLabel>
            </Stat>

            <Stat>
              <StatIcon>💡</StatIcon>
              <StatNumber>
                {inbox.filter(item => item.type === "Idea").length}
              </StatNumber>
              <StatLabel>Ideas</StatLabel>
            </Stat>

            <Stat>
              <StatIcon>🔔</StatIcon>
              <StatNumber>
                {inbox.filter(item => item.type === "Reminder").length}
              </StatNumber>
              <StatLabel>Reminders</StatLabel>
            </Stat>
          </StatsGrid>
        </Section>

        <Section>
          <PrimaryButton onClick={openAddModal}>
            ＋ Capture new item
          </PrimaryButton>
        </Section>

        <Section>
          <SearchBox
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="⌕ Search your inbox..."
          />
        </Section>

        <Section>
          <FilterRow>
            {types.map(filter => (
              <FilterButton
                key={filter}
                $active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </FilterButton>
            ))}
          </FilterRow>
        </Section>

        <Section>
          <SectionHead>
            <SectionTitle>Your captured items</SectionTitle>
            <Count>{filteredInbox.length} items</Count>
          </SectionHead>

          <Card>
            {filteredInbox.length === 0 ? (
              <Empty>
                <EmptyIcon>📥</EmptyIcon>
                {inbox.length === 0
                  ? "Your inbox is clear. Capture something to get started."
                  : "No items match your search or selected filter."}
              </Empty>
            ) : (
              filteredInbox.map(item => (
                <InboxItem key={item.id}>
                  <ItemIcon $bg={typeBackgrounds[item.type]}>
                    {typeIcons[item.type] || "📥"}
                  </ItemIcon>

                  <ItemBody>
                    <ItemTitle>{item.title}</ItemTitle>

                    <ItemMeta>
                      {item.type} · {item.area || "Unassigned"} · {formatDate(item.createdAt)}
                    </ItemMeta>

                    {item.details && (
                      <Description style={{ marginTop: 7 }}>
                        {item.details}
                      </Description>
                    )}

                    <ItemActions>
                      <ActionButton
                        onClick={() => openEditModal(item)}
                      >
                        ✎ Edit
                      </ActionButton>

                    {/* <ActionButton
  onClick={() => convertToTask(item)}
>
  Convert to task
</ActionButton> */}

                      <DeleteButton
                        onClick={() => deleteItem(item)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </DeleteButton>
                    </ItemActions>
                  </ItemBody>

                  <Tag>CAPTURED</Tag>
                </InboxItem>
              ))
            )}
          </Card>
        </Section>
      </Content>

      {showModal && (
        <Overlay onClick={() => !saving && setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>
              {editingItem ? "Edit inbox item" : "Capture to inbox"}
            </ModalTitle>

            <Muted>
              {editingItem
                ? "Update the details of your captured item."
                : "Quickly save something before you forget it. You can organise it later."}
            </Muted>

            <form onSubmit={saveItem}>
              <FieldLabel>What are you capturing?</FieldLabel>

              <Select
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {types.filter(item => item !== "All").map(item => (
                  <option key={item}>{item}</option>
                ))}
              </Select>

              <FieldLabel>Title</FieldLabel>

              <Field
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What do you need to remember?"
                required
              />

              <FieldLabel>Life area</FieldLabel>

              <Select
                value={area}
                onChange={e => setArea(e.target.value)}
              >
                {areas.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </Select>

              <FieldLabel>Additional details (optional)</FieldLabel>

              <TextArea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Add any extra information..."
              />

              <PrimaryButton type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingItem
                    ? "Update item"
                    : "Save to inbox"}
              </PrimaryButton>

              <SecondaryButton
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </SecondaryButton>
            </form>
          </Modal>
        </Overlay>
      )}

      <TaskModal
  isOpen={!!convertingItem}
  onClose={() => setConvertingItem(null)}
  user={user}
  initialData={
    convertingItem
      ? {
          title: convertingItem.title || "",
          area: convertingItem.area || "Personal",
          details: convertingItem.details || "",
          priority: "Medium",
          scheduledDate: "",
          time: "",
        }
      : {}
  }
  onSaved={(savedTask) => {
    if (!convertingItem) return;

    const item = convertingItem;

    // Remove the inbox item only after the task has been saved.
    deleteDoc(
      doc(db, "users", user.uid, "inbox", item.id)
    )
      .then(() => {
        if (onCapture) {
          onCapture({
            type: "Task",
            title: savedTask?.title || item.title,
            area: savedTask?.area || item.area || "Personal",
            details: savedTask?.details || item.details || "",
          });
        }
      })
      .catch((err) => {
        console.error("Removing converted inbox item failed:", err);
        setError(
          "The task was created, but the original inbox item could not be removed."
        );
      });
  }}
/>
    </>
  );
}
