import { useState } from "react";
import "./WorkOrder.css";

type Status = "Draft" | "Not Started" | "In Process" | "Completed" | "Stopped";
type Priority = "Low" | "Medium" | "High" | "Urgent";
type Mode = "list" | "new" | "view" | "edit";

interface WOData {
  id: string;
  workOrderNo: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  age: string;
}

const STATUS_OPTIONS: Status[] = ["Draft", "Not Started", "In Process", "Completed", "Stopped"];
const PRIORITY_OPTIONS: Priority[] = ["Low", "Medium", "High", "Urgent"];

const STATUS_CLASS: Record<Status, string> = {
  Draft:          "s-draft",
  "Not Started":  "s-notstarted",
  "In Process":   "s-inprocess",
  Completed:      "s-completed",
  Stopped:        "s-stopped",
};

const PRIORITY_CLASS: Record<Priority, string> = {
  Low:    "p-low",
  Medium: "p-medium",
  High:   "p-high",
  Urgent: "p-urgent",
};

const EMPTY = {
  workOrderNo: "",
  title:       "",
  description: "",
  assignee:    "",
  dueDate:     "2026-06-17",
  priority:    "Medium" as Priority,
  status:      "Draft" as Status,
};

let counter = 1;
function genId() {
  const id = `MFG-WO-2026-${String(counter).padStart(5, "0")}`;
  counter++;
  return id;
}

function fmt(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="wo-field">
      <label>{label}{required && <span className="req"> *</span>}</label>
      {children}
    </div>
  );
}

export default function WorkOrder() {
  const [mode, setMode]     = useState<Mode>("list");
  const [records, setRecords] = useState<WOData[]>([]);
  const [form, setForm]     = useState({ ...EMPTY });
  const [editing, setEditing] = useState<WOData | null>(null);
  const [viewing, setViewing] = useState<WOData | null>(null);

  const ch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Save new ── */
  const handleSave = () => {
    if (!form.title.trim()) return;
    const rec: WOData = {
      ...form,
      workOrderNo: form.workOrderNo || genId(),
      id: genId(),
      createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      age: "0 d",
    };
    setRecords(p => [rec, ...p]);
    setMode("list");
  };

  /* ── Start Production ── */
  const handleStartProduction = () => {
    if (!form.title.trim()) return;
    const rec: WOData = {
      ...form,
      status: "In Process",
      workOrderNo: form.workOrderNo || genId(),
      id: genId(),
      createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      age: "0 d",
    };
    setRecords(p => [rec, ...p]);
    setMode("list");
  };

  /* ── Update edited ── */
  const handleUpdate = () => {
    if (!editing) return;
    setRecords(p => p.map(r => r.id === editing.id ? { ...r, ...form, workOrderNo: form.workOrderNo || r.workOrderNo } : r));
    setViewing(v => v ? { ...v, ...form } : v);
    setEditing(null);
    setMode("view");
  };

  /* ── Open view ── */
  const openView = (rec: WOData) => {
    setViewing(rec);
    setMode("view");
  };

  /* ── Open edit ── */
  const openEdit = (rec: WOData) => {
    setEditing(rec);
    setForm({
      workOrderNo: rec.workOrderNo,
      title:       rec.title,
      description: rec.description,
      assignee:    rec.assignee,
      dueDate:     rec.dueDate,
      priority:    rec.priority,
      status:      rec.status,
    });
    setMode("edit");
  };

  const openNew = () => {
    setForm({ ...EMPTY, workOrderNo: "" });
    setEditing(null);
    setMode("new");
  };

  const isEdit = mode === "edit";
  const f = form;

  /* ══════════════════════════════════════════
     LIST VIEW
  ══════════════════════════════════════════ */
  if (mode === "list") {
    return (
      <div className="wo-page">
        {/* breadcrumb */}
        <div className="wo-breadcrumb">
          <span className="wo-bc-home">⌂</span>
          <span className="wo-bc-sep">/</span>
          <span className="wo-bc-muted">Manufacturing</span>
          <span className="wo-bc-sep">/</span>
          <span className="wo-bc-active">Work Order</span>
        </div>

        {/* list toolbar */}
        <div className="wo-list-toolbar">
          <div className="wo-list-toolbar-left">
            <div className="wo-list-view-toggle">
              <span className="wo-list-view-icon">☰</span> List View <span className="wo-caret">▾</span>
            </div>
            <div className="wo-saved-filters">
              Saved Filters <span className="wo-caret">▾</span>
            </div>
          </div>
          <div className="wo-list-toolbar-right">
            <button className="wo-icon-btn" title="Refresh">⟲</button>
            <button className="wo-icon-btn" title="More">⋯</button>
            <button className="wo-btn-add" onClick={openNew}>
              + Add Work Order
            </button>
          </div>
        </div>

        {/* filter bar */}
        <div className="wo-filter-bar">
          <div className="wo-filter-inputs">
            <div className="wo-filter-chip wo-filter-chip-id">
              <span className="wo-filter-dot" /> ID <span className="wo-caret">⌃</span>
            </div>
            <div className="wo-filter-chip">
              Status <span className="wo-caret">▾</span>
            </div>
            <div className="wo-filter-chip">
              Priority <span className="wo-caret">▾</span>
            </div>
          </div>
          <div className="wo-filter-right">
            <button className="wo-filter-btn">⏷ Filter</button>
            <button className="wo-sort-btn">↕ Created On <span className="wo-caret">▾</span></button>
          </div>
        </div>

        {/* table */}
        <div className="wo-list-wrap">
          {records.length === 0 ? (
            <div className="wo-empty">
              <div className="wo-empty-icon">📋</div>
              <div className="wo-empty-title">You haven't created a Work Order yet</div>
              <button className="wo-btn-add wo-empty-btn" onClick={openNew}>
                + Create your first Work Order
              </button>
            </div>
          ) : (
            <table className="wo-table">
              <thead>
                <tr>
                  <th className="wo-th-check"><input type="checkbox" /></th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>ID</th>
                  <th className="wo-th-right">Due Date</th>
                  <th className="wo-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} className="wo-tr" onClick={() => openView(r)}>
                    <td className="wo-td-check" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" />
                    </td>
                    <td className="wo-td-link">{r.title}</td>
                    <td>
                      <span className={`wo-status-pill ${STATUS_CLASS[r.status]}`}>{r.status}</span>
                    </td>
                    <td>
                      <span className={`wo-priority-pill ${PRIORITY_CLASS[r.priority]}`}>
                        <span className="wo-priority-dot" /> {r.priority}
                      </span>
                    </td>
                    <td className="wo-td-muted">{r.assignee || "—"}</td>
                    <td className="wo-td-id">{r.id}</td>
                    <td className="wo-td-right wo-td-muted">{fmt(r.dueDate)}</td>
                    <td className="wo-td-actions" onClick={e => e.stopPropagation()}>
                      <span className="wo-action-icon">💬 0</span>
                      <span className="wo-action-dot">·</span>
                      <span className="wo-action-icon">♡</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {records.length > 0 && (
          <div className="wo-list-footer">
            <span className="wo-record-count">{records.length} record{records.length !== 1 ? "s" : ""}</span>
            <div className="wo-page-size-btns">
              <button className="wo-page-size-btn wo-page-size-active">20</button>
              <button className="wo-page-size-btn">100</button>
              <button className="wo-page-size-btn">500</button>
              <button className="wo-page-size-btn">2500</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     FORM (new / edit)
  ══════════════════════════════════════════ */
  if (mode === "new" || mode === "edit") {
    return (
      <div className="wo-page">
        <div className="wo-topbar">
          <div className="wo-topbar-left">
            <button className="wo-back-btn" onClick={() => isEdit ? setMode("view") : setMode("list")}>
              <span className="wo-back-arrow">←</span> Back
            </button>
            <span className="wo-topbar-title">
              {isEdit && editing ? editing.id : "New Work Order"}
            </span>
            {isEdit && editing && (
              <span className={`wo-status-pill ${STATUS_CLASS[editing.status]}`}>{editing.status}</span>
            )}
          </div>
          <div className="wo-topbar-right">
            
            <button className="wo-btn-blue"
              onClick={isEdit ? handleUpdate : handleSave}
              disabled={!f.title.trim()}>
              {isEdit ? "Update" : "Save"}
            </button>
            
          </div>
        </div>

        <div className="wo-content">
          <div className="wo-card">
            <div className="wo-card-header">
              <span className="wo-card-title">Work Order Details</span>
            </div>
            <div className="wo-card-body">
              <div className="wo-row wo-row-1">
                <Field label="Title" required>
                  <input name="title" value={f.title} onChange={ch}
                    placeholder="e.g. Assemble Cabinet Hardware" autoComplete="off" />
                </Field>
              </div>
              <div className="wo-row wo-row-1">
                <Field label="Description">
                  <textarea name="description" value={f.description} onChange={ch}
                    placeholder="Add any extra detail about this work order" rows={3} />
                </Field>
              </div>
              <div className="wo-row">
                <Field label="Assignee">
                  <input name="assignee" value={f.assignee} onChange={ch}
                    placeholder="e.g. john" autoComplete="off" />
                </Field>
                <Field label="Due Date">
                  <input name="dueDate" type="date" value={f.dueDate} onChange={ch} />
                </Field>
              </div>
              <div className="wo-row">
                <Field label="Priority">
                  <div className="wo-select-wrap">
                    <span className={`wo-priority-dot wo-priority-dot-inline ${PRIORITY_CLASS[f.priority]}`} />
                    <select name="priority" value={f.priority} onChange={ch}>
                      {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Status">
                  <div className="wo-select-wrap">
                    <select name="status" value={f.status} onChange={ch}>
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     VIEW
  ══════════════════════════════════════════ */
  if (!viewing) return null;
  const rec = records.find(r => r.id === viewing.id) || viewing;

  return (
    <div className="wo-page">
      <div className="wo-topbar">
        <div className="wo-topbar-left">
          <button className="wo-back-btn" onClick={() => setMode("list")}>
            <span className="wo-back-arrow">←</span> Back
          </button>
          <span className="wo-topbar-title">{rec.id}</span>
          <span className={`wo-status-pill ${STATUS_CLASS[rec.status]}`}>{rec.status}</span>
        </div>
        <div className="wo-topbar-right">
          <button className="wo-btn-ghost" onClick={openNew}>+ New</button>
          <button className="wo-btn-blue" onClick={() => openEdit(rec)}>Edit</button>
        </div>
      </div>

      <div className="wo-content">
        <div className="wo-card">
          <div className="wo-card-header">
            <span className="wo-card-title">Work Order Details</span>
            <span className="wo-card-id">{rec.id}</span>
          </div>
          <div className="wo-view-grid">
            <div className="wo-read-field wo-read-field-wide">
              <span className="wo-read-label">Title</span>
              <span className="wo-read-value">{rec.title || "—"}</span>
            </div>
            <div className="wo-read-field wo-read-field-wide">
              <span className="wo-read-label">Description</span>
              <span className="wo-read-value">{rec.description || "—"}</span>
            </div>
            <div className="wo-read-field">
              <span className="wo-read-label">Assignee</span>
              <span className="wo-read-value">{rec.assignee || "—"}</span>
            </div>
            <div className="wo-read-field">
              <span className="wo-read-label">Due Date</span>
              <span className="wo-read-value">{fmt(rec.dueDate)}</span>
            </div>
            <div className="wo-read-field">
              <span className="wo-read-label">Priority</span>
              <span className={`wo-priority-pill ${PRIORITY_CLASS[rec.priority]}`}>
                <span className="wo-priority-dot" /> {rec.priority}
              </span>
            </div>
            <div className="wo-read-field">
              <span className="wo-read-label">Status</span>
              <span className={`wo-status-pill ${STATUS_CLASS[rec.status]}`}>{rec.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}