// BrandForm.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BrandForm.css";

interface BrandDefaults {
  id: string;
  company: string;
  defaultWarehouse: string;
  defaultPriceList: string;
}

export default function BrandForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const brandName = isNew ? "New Brand" : decodeURIComponent(id || "");

  const [form, setForm] = useState({
    name: isNew ? "" : decodeURIComponent(id || ""),
  });

  const [defaults, setDefaults] = useState<BrandDefaults[]>([]);
  const [comment, setComment] = useState("");

  const addRow = () => {
    setDefaults([
      ...defaults,
      { id: Date.now().toString(), company: "", defaultWarehouse: "", defaultPriceList: "" },
    ]);
  };

  const removeRow = (id: string) => {
    setDefaults(defaults.filter((r) => r.id !== id));
  };

  const updateDefault = (id: string, field: keyof BrandDefaults, value: string) => {
    setDefaults(defaults.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="bf-content">
      {/* Topbar */}
      <div className="bf-topbar">
        <div className="bf-breadcrumb">
          <span className="bf-bc-link">Stock</span>
          <span className="bf-bc-sep">/</span>
          <span className="bf-bc-link">Stock</span>
          <span className="bf-bc-sep">/</span>
          <span className="bf-bc-link" onClick={() => navigate("/brand")}>Brand</span>
          <span className="bf-bc-sep">/</span>
          <span className="bf-bc-current">{isNew ? "New Brand" : brandName}</span>
        </div>
        <div className="bf-topbar-right">
          {!isNew && (
            <button className="bf-btn-outline">View</button>
          )}
          <button className="bf-btn-save">Save</button>
        </div>
      </div>

      {/* Body */}
      <div className="bf-body">
        <div className="bf-main">
          {/* Brand Name */}
          <section className="bf-section">
            <div className="bf-field">
              <label className="bf-label">Brand Name <span className="bf-req">*</span></label>
              <input
                className="bf-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!isNew}
              />
            </div>
          </section>

          <div className="bf-divider" />

          {/* Brand Defaults */}
          <section className="bf-section">
            <h3 className="bf-section-title">Brand Defaults</h3>
            
            <div className="bf-table-block">
              <table className="bf-table">
                <thead>
                  <tr>
                    <th className="bf-th bf-th-check"><input type="checkbox" className="bf-checkbox" /></th>
                    <th className="bf-th bf-th-no">No.</th>
                    <th className="bf-th">Company <span className="bf-req">*</span></th>
                    <th className="bf-th">Default Warehouse</th>
                    <th className="bf-th">Default Price List</th>
                    <th className="bf-th bf-th-act"></th>
                  </tr>
                </thead>
                <tbody>
                  {defaults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="bf-empty-row">No rows</td>
                    </tr>
                  ) : (
                    defaults.map((row, index) => (
                      <tr key={row.id} className="bf-tr">
                        <td className="bf-td bf-td-check"><input type="checkbox" className="bf-checkbox" /></td>
                        <td className="bf-td bf-td-no">{index + 1}</td>
                        <td className="bf-td">
                          <input
                            className="bf-cell-input"
                            value={row.company}
                            onChange={(e) => updateDefault(row.id, "company", e.target.value)}
                            placeholder="Company"
                          />
                        </td>
                        <td className="bf-td">
                          <input
                            className="bf-cell-input"
                            value={row.defaultWarehouse}
                            onChange={(e) => updateDefault(row.id, "defaultWarehouse", e.target.value)}
                            placeholder="Default Warehouse"
                          />
                        </td>
                        <td className="bf-td">
                          <input
                            className="bf-cell-input"
                            value={row.defaultPriceList}
                            onChange={(e) => updateDefault(row.id, "defaultPriceList", e.target.value)}
                            placeholder="Default Price List"
                          />
                        </td>
                        <td className="bf-td bf-td-act">
                          <button className="bf-remove-row" onClick={() => removeRow(row.id)}>×</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button className="bf-add-row-btn" onClick={addRow}>Add row</button>
          </section>

          <div className="bf-divider" />

          {/* Comments */}
          <section className="bf-section">
            <h3 className="bf-section-title">Comments</h3>
            <div className="bf-comment-row">
              <div className="bf-comment-avatar">TT</div>
              <input
                className="bf-comment-input"
                placeholder="Type a reply / comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </section>

          <div className="bf-divider" />

          {/* Activity */}
          <section className="bf-section bf-section-activity">
            <div className="bf-activity-header">
              <h3 className="bf-section-title">Activity</h3>
              <button className="bf-new-email-btn">+ New Email</button>
            </div>
            <ul className="bf-activity-list">
              <li>You created this · <span className="bf-activity-time">1 minute ago</span></li>
              <li>You last edited this · <span className="bf-activity-time">1 minute ago</span></li>
            </ul>
            <button className="bf-activity-collapse">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="bf-sidebar-right">
          {!isNew ? (
            <>
              <div className="bf-doc-avatar">{brandName.charAt(0).toUpperCase()}</div>
              <div className="bf-doc-name">{brandName}</div>
              <div className="bf-doc-id">{brandName}</div>

              <div className="bf-sidebar-actions">
                <button className="bf-sidebar-action">
                  <AssignIcon />
                  Assign
                  <span className="bf-sidebar-plus">+</span>
                </button>
                <button className="bf-sidebar-action">
                  <AttachIcon />
                  Attachments
                  <span className="bf-sidebar-plus">+</span>
                </button>
                <button className="bf-sidebar-action">
                  <TagsIcon />
                  Tags
                  <span className="bf-sidebar-plus">+</span>
                </button>
                <button className="bf-sidebar-action">
                  <ShareIcon />
                  Share
                  <span className="bf-sidebar-plus">+</span>
                </button>
              </div>

              <div className="bf-sidebar-meta">
                <div className="bf-meta-row">
                  <span className="bf-meta-label">Last Edited By</span>
                  <span className="bf-meta-val">You</span>
                </div>
                <div className="bf-meta-time">1 minute ago</div>
                <div className="bf-meta-row" style={{ marginTop: 12 }}>
                  <span className="bf-meta-label">Created By</span>
                  <span className="bf-meta-val">You</span>
                </div>
                <div className="bf-meta-time">1 minute ago</div>
              </div>
            </>
          ) : (
            <>
              <div className="bf-doc-avatar">N</div>
              <div className="bf-doc-name">New Brand</div>
              <div className="bf-doc-id">Not Saved</div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// Icons
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