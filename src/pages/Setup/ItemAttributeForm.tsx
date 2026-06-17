// ItemAttributeForm.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemAttributeForm.css";

interface AttributeValue {
  id: string;
  value: string;
  abbreviation: string;
}

export default function ItemAttributeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const attributeName = isNew ? "New Item Attribute" : id || "";

  const [form, setForm] = useState({
    attributeName: isNew ? "" : id || "",
    disabled: false,
    numericValues: false,
  });

  const [values, setValues] = useState<AttributeValue[]>([
    { id: "1", value: "Red", abbreviation: "RED" },
    { id: "2", value: "Green", abbreviation: "GRE" },
    { id: "3", value: "Blue", abbreviation: "BLU" },
    { id: "4", value: "Black", abbreviation: "BLA" },
    { id: "5", value: "White", abbreviation: "WHI" },
  ]);

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const addRow = () => {
    setValues([...values, { id: Date.now().toString(), value: "", abbreviation: "" }]);
  };

  const removeRow = (id: string) => {
    setValues(values.filter((v) => v.id !== id));
  };

  const updateValue = (id: string, field: keyof AttributeValue, val: string) => {
    setValues(values.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
  };

  return (
    <div className="iaf-content">
      {/* Topbar */}
      <div className="iaf-topbar">
        <div className="iaf-breadcrumb">
          <span className="iaf-bc-link">Stock</span>
          <span className="iaf-bc-sep">/</span>
          <span className="iaf-bc-link">Stock</span>
          <span className="iaf-bc-sep">/</span>
          <span className="iaf-bc-link" onClick={() => navigate("/item-attribute")}>Item Attribute</span>
          <span className="iaf-bc-sep">/</span>
          <span className="iaf-bc-current">{isNew ? "New Item Attribute" : attributeName}</span>
        </div>
        <div className="iaf-topbar-right">
          <button className="iaf-btn-outline">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="iaf-btn-save">Save</button>
        </div>
      </div>

      {/* Content Body */}
      <div className="iaf-body">
        <div className="iaf-main">
          {/* Form */}
          <section className="iaf-section">
            <div className="iaf-field">
              <label className="iaf-label">Attribute Name <span className="iaf-req">*</span></label>
              <input
                className="iaf-input"
                value={form.attributeName}
                onChange={(e) => setForm({ ...form, attributeName: e.target.value })}
              />
            </div>

            <div className="iaf-check-row">
              <input
                type="checkbox"
                id="disabled"
                className="iaf-checkbox"
                checked={form.disabled}
                onChange={(e) => setForm({ ...form, disabled: e.target.checked })}
              />
              <label htmlFor="disabled" className="iaf-check-label">Disabled</label>
            </div>

            <div className="iaf-check-row">
              <input
                type="checkbox"
                id="numericValues"
                className="iaf-checkbox"
                checked={form.numericValues}
                onChange={(e) => setForm({ ...form, numericValues: e.target.checked })}
              />
              <label htmlFor="numericValues" className="iaf-check-label">Numeric Values</label>
            </div>
          </section>

          <div className="iaf-divider" />

          {/* Item Attribute Values Table */}
          <section className="iaf-section">
            <div className="iaf-section-header">
              <h3 className="iaf-section-title">Item Attribute Values</h3>
              <button className="iaf-add-row-btn" onClick={addRow}>Add row</button>
            </div>

            <div className="iaf-table-block">
              <table className="iaf-table">
                <thead>
                  <tr>
                    <th className="iaf-th iaf-th-check"><input type="checkbox" className="iaf-checkbox" /></th>
                    <th className="iaf-th iaf-th-no">No.</th>
                    <th className="iaf-th">Attribute Value <span className="iaf-req">*</span></th>
                    <th className="iaf-th">Abbreviation <span className="iaf-req">*</span></th>
                    <th className="iaf-th iaf-th-act"></th>
                  </tr>
                </thead>
                <tbody>
                  {values.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`iaf-tr ${editingRow === row.id ? "iaf-tr-editing" : ""}`}
                      onClick={() => setEditingRow(row.id)}
                    >
                      <td className="iaf-td iaf-td-check"><input type="checkbox" className="iaf-checkbox" /></td>
                      <td className="iaf-td iaf-td-no">{index + 1}</td>
                      <td className="iaf-td">
                        <input
                          className="iaf-cell-input"
                          value={row.value}
                          onChange={(e) => updateValue(row.id, "value", e.target.value)}
                          placeholder="Attribute Value"
                        />
                      </td>
                      <td className="iaf-td">
                        <input
                          className="iaf-cell-input"
                          value={row.abbreviation}
                          onChange={(e) => updateValue(row.id, "abbreviation", e.target.value)}
                          placeholder="Abbreviation"
                        />
                      </td>
                      <td className="iaf-td iaf-td-act">
                        <button className="iaf-remove-row" onClick={() => removeRow(row.id)}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="iaf-divider" />

          {/* Comments */}
          <section className="iaf-section">
            <h3 className="iaf-section-title">Comments</h3>
            <div className="iaf-comment-row">
              <div className="iaf-comment-avatar">TT</div>
              <input
                className="iaf-comment-input"
                placeholder="Type a reply / comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </section>

          <div className="iaf-divider" />

          {/* Activity */}
          <section className="iaf-section iaf-section-activity">
            <div className="iaf-activity-header">
              <h3 className="iaf-section-title">Activity</h3>
              <button className="iaf-new-email-btn">+ New Email</button>
            </div>
            <ul className="iaf-activity-list">
              <li>Administrator created this · <span className="iaf-activity-time">yesterday</span></li>
              <li>Administrator last edited this · <span className="iaf-activity-time">yesterday</span></li>
            </ul>
            <button className="iaf-activity-collapse">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="iaf-sidebar-right">
          <div className="iaf-doc-avatar">{attributeName.charAt(0).toUpperCase()}</div>
          <div className="iaf-doc-name">{attributeName}</div>
          <div className="iaf-doc-id">{isNew ? "NEW" : attributeName}</div>

          <div className="iaf-sidebar-actions">
            <button className="iaf-sidebar-action">
              <AssignIcon />
              Assign
              <span className="iaf-sidebar-plus">+</span>
            </button>
            <button className="iaf-sidebar-action">
              <AttachIcon />
              Attachments
              <span className="iaf-sidebar-plus">+</span>
            </button>
            <button className="iaf-sidebar-action">
              <TagsIcon />
              Tags
              <span className="iaf-sidebar-plus">+</span>
            </button>
            <button className="iaf-sidebar-action">
              <ShareIcon />
              Share
              <span className="iaf-sidebar-plus">+</span>
            </button>
          </div>

          <div className="iaf-sidebar-meta">
            <div className="iaf-meta-row">
              <span className="iaf-meta-label">Last Edited By</span>
              <span className="iaf-meta-val">Administrator</span>
            </div>
            <div className="iaf-meta-time">yesterday</div>
            <div className="iaf-meta-row" style={{ marginTop: 12 }}>
              <span className="iaf-meta-label">Created By</span>
              <span className="iaf-meta-val">Administrator</span>
            </div>
            <div className="iaf-meta-time">yesterday</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Icons (keep all the icon functions)
function AssignIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function TagsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}