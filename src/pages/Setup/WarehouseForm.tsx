// WarehouseForm.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WarehouseForm.css";

export default function WarehouseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const warehouseName = isNew ? "New Warehouse" : decodeURIComponent(id || "");

  const [form, setForm] = useState({
    warehouseName: isNew ? "" : decodeURIComponent(id || ""),
    company: "Test",
    isRejectedWarehouse: false,
    parentWarehouse: "All Warehouses - T",
    isGroupWarehouse: false,
    account: "",
    customer: "",
  });

  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="wf-content">
      {/* Topbar */}
      <div className="wf-topbar">
        <div className="wf-breadcrumb">
          <span className="wf-bc-link">Stock</span>
          <span className="wf-bc-sep">/</span>
          <span className="wf-bc-link">Stock</span>
          <span className="wf-bc-sep">/</span>
          <span className="wf-bc-link" onClick={() => navigate("/warehouse")}>Warehouse</span>
          <span className="wf-bc-sep">/</span>
          <span className="wf-bc-current">{isNew ? "New Warehouse" : warehouseName}</span>
        </div>
        <div className="wf-topbar-right">
          {!isNew && (
            <>
              <button className="wf-btn-outline">Disable</button>
              <button className="wf-btn-outline">Convert to Group</button>
              <button className="wf-btn-outline">View</button>
            </>
          )}
          <button className="wf-btn-save">Save</button>
        </div>
      </div>

      {/* Body */}
      <div className="wf-body">
        <div className="wf-main">
          {/* Warehouse Detail */}
          <section className="wf-section">
            <h3 className="wf-section-title">Warehouse Detail</h3>
            
            <div className="wf-field">
              <label className="wf-label">Warehouse Name <span className="wf-req">*</span></label>
              <input
                className="wf-input"
                value={form.warehouseName}
                onChange={(e) => setForm({ ...form, warehouseName: e.target.value })}
                disabled={!isNew}
              />
            </div>

            <div className="wf-field">
              <label className="wf-label">Company <span className="wf-req">*</span></label>
              <input
                className="wf-input"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            <div className="wf-check-row">
              <input
                type="checkbox"
                id="isRejectedWarehouse"
                className="wf-checkbox"
                checked={form.isRejectedWarehouse}
                onChange={(e) => setForm({ ...form, isRejectedWarehouse: e.target.checked })}
              />
              <div>
                <label htmlFor="isRejectedWarehouse" className="wf-check-label">Is Rejected Warehouse</label>
                <p className="wf-hint">If yes, then this warehouse will be used to store rejected materials</p>
              </div>
            </div>

            <div className="wf-field">
              <label className="wf-label">Parent Warehouse</label>
              <input
                className="wf-input"
                value={form.parentWarehouse}
                onChange={(e) => setForm({ ...form, parentWarehouse: e.target.value })}
              />
            </div>

            <div className="wf-check-row">
              <input
                type="checkbox"
                id="isGroupWarehouse"
                className="wf-checkbox"
                checked={form.isGroupWarehouse}
                onChange={(e) => setForm({ ...form, isGroupWarehouse: e.target.checked })}
              />
              <div>
                <label htmlFor="isGroupWarehouse" className="wf-check-label">Is Group Warehouse</label>
              </div>
            </div>

            <div className="wf-collapsible">
              <button 
                className="wf-collapsible-btn" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span>Warehouse Contact Info {isExpanded ? "▼" : "▶"}</span>
              </button>
              {isExpanded && (
                <div className="wf-collapsible-content">
                  <p className="wf-hint">No address added yet.</p>
                  <p className="wf-hint">No contacts added yet.</p>
                  <button className="wf-link-btn">+ New Address</button>
                  <button className="wf-link-btn">+ New Contact</button>
                </div>
              )}
            </div>

            <div className="wf-collapsible">
              <button className="wf-collapsible-btn">
                <span>Transit ▶</span>
              </button>
            </div>
          </section>

          <div className="wf-divider" />

          {/* Account */}
          <section className="wf-section">
            <h3 className="wf-section-title">Account</h3>
            <div className="wf-field">
              <label className="wf-label">Account</label>
              <input
                className="wf-input"
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                placeholder="If blank, parent Warehouse Account or company default will be considered in transactions"
              />
            </div>
          </section>

          <div className="wf-divider" />

          {/* Customer */}
          <section className="wf-section">
            <h3 className="wf-section-title">Customer</h3>
            <div className="wf-field">
              <label className="wf-label">Customer</label>
              <input
                className="wf-input"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                placeholder="Only to be used for Subcontracting Inward."
              />
            </div>
          </section>

          <div className="wf-divider" />

          {/* Comments */}
          <section className="wf-section">
            <h3 className="wf-section-title">Comments</h3>
            <div className="wf-comment-row">
              <div className="wf-comment-avatar">TT</div>
              <input
                className="wf-comment-input"
                placeholder="Type a reply / comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </section>

          <div className="wf-divider" />

          {/* Activity */}
          <section className="wf-section wf-section-activity">
            <div className="wf-activity-header">
              <h3 className="wf-section-title">Activity</h3>
              <button className="wf-new-email-btn">+ New Email</button>
            </div>
            <ul className="wf-activity-list">
              <li>Administrator created this · <span className="wf-activity-time">yesterday</span></li>
              <li>Administrator last edited this · <span className="wf-activity-time">yesterday</span></li>
            </ul>
            <button className="wf-activity-collapse">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="wf-sidebar-right">
          {!isNew ? (
            <>
              <div className="wf-doc-avatar">{warehouseName.charAt(0).toUpperCase()}</div>
              <div className="wf-doc-name">{warehouseName}</div>
              <div className="wf-doc-id">{warehouseName}</div>

              <div className="wf-sidebar-actions">
                <button className="wf-sidebar-action">
                  <AssignIcon />
                  Assign
                  <span className="wf-sidebar-plus">+</span>
                </button>
                <button className="wf-sidebar-action">
                  <AttachIcon />
                  Attachments
                  <span className="wf-sidebar-plus">+</span>
                </button>
                <button className="wf-sidebar-action">
                  <TagsIcon />
                  Tags
                  <span className="wf-sidebar-plus">+</span>
                </button>
                <button className="wf-sidebar-action">
                  <ShareIcon />
                  Share
                  <span className="wf-sidebar-plus">+</span>
                </button>
              </div>

              <div className="wf-sidebar-meta">
                <div className="wf-meta-row">
                  <span className="wf-meta-label">Last Edited By</span>
                  <span className="wf-meta-val">Administrator</span>
                </div>
                <div className="wf-meta-time">yesterday</div>
                <div className="wf-meta-row" style={{ marginTop: 12 }}>
                  <span className="wf-meta-label">Created By</span>
                  <span className="wf-meta-val">Administrator</span>
                </div>
                <div className="wf-meta-time">yesterday</div>
              </div>
            </>
          ) : (
            <>
              <div className="wf-doc-avatar">N</div>
              <div className="wf-doc-name">New Warehouse</div>
              <div className="wf-doc-id">Not Saved</div>
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