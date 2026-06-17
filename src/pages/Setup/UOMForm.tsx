// UOMForm.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UOMForm.css";

export default function UOMForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const uomName = isNew ? "New UOM" : decodeURIComponent(id || "");

  const [form, setForm] = useState({
    name: isNew ? "" : decodeURIComponent(id || ""),
    category: "Electric Current",
    symbol: "",
    commonCode: "",
    description: "",
    enabled: true,
    mustBeWholeNumber: false,
  });

  const [comment, setComment] = useState("");

  return (
    <div className="uomf-content">
      {/* Topbar */}
      <div className="uomf-topbar">
        <div className="uomf-breadcrumb">
          <span className="uomf-bc-link">Stock</span>
          <span className="uomf-bc-sep">/</span>
          <span className="uomf-bc-link">Stock</span>
          <span className="uomf-bc-sep">/</span>
          <span className="uomf-bc-link" onClick={() => navigate("/uom")}>UOM</span>
          <span className="uomf-bc-sep">/</span>
          <span className="uomf-bc-current">{isNew ? "New UOM" : uomName}</span>
        </div>
        <div className="uomf-topbar-right">
          {!isNew && (
            <button className="uomf-btn-outline">View</button>
          )}
          <button className="uomf-btn-save">Save</button>
        </div>
      </div>

      {/* Body */}
      <div className="uomf-body">
        <div className="uomf-main">
          {/* UOM Details */}
          <section className="uomf-section">
            <div className="uomf-field">
              <label className="uomf-label">UOM Name <span className="uomf-req">*</span></label>
              <input
                className="uomf-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!isNew}
              />
            </div>

            <div className="uomf-field">
              <label className="uomf-label">Category</label>
              <select
                className="uomf-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Area">Area</option>
                <option value="Electric Current">Electric Current</option>
                <option value="Electrical Charge">Electrical Charge</option>
                <option value="Length">Length</option>
                <option value="Pressure">Pressure</option>
                <option value="Volume">Volume</option>
                <option value="Weight">Weight</option>
                <option value="Time">Time</option>
                <option value="Temperature">Temperature</option>
                <option value="Speed">Speed</option>
                <option value="Frequency">Frequency</option>
                <option value="Force">Force</option>
                <option value="Energy">Energy</option>
                <option value="Power">Power</option>
              </select>
            </div>

            <div className="uomf-check-row">
              <input
                type="checkbox"
                id="enabled"
                className="uomf-checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              />
              <label htmlFor="enabled" className="uomf-check-label">Enabled</label>
            </div>

            <div className="uomf-check-row">
              <input
                type="checkbox"
                id="mustBeWholeNumber"
                className="uomf-checkbox"
                checked={form.mustBeWholeNumber}
                onChange={(e) => setForm({ ...form, mustBeWholeNumber: e.target.checked })}
              />
              <div>
                <label htmlFor="mustBeWholeNumber" className="uomf-check-label">Must be Whole Number</label>
                <p className="uomf-hint">Check this to disallow fractions. (for Nos)</p>
              </div>
            </div>
          </section>

          <div className="uomf-divider" />

          {/* Symbol */}
          <section className="uomf-section">
            <h3 className="uomf-section-title">Symbol</h3>
            <div className="uomf-field">
              <input
                className="uomf-input"
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                placeholder="Enter symbol"
              />
            </div>
          </section>

          <div className="uomf-divider" />

          {/* Common Code */}
          <section className="uomf-section">
            <h3 className="uomf-section-title">Common Code</h3>
            <div className="uomf-field">
              <input
                className="uomf-input"
                value={form.commonCode}
                onChange={(e) => setForm({ ...form, commonCode: e.target.value })}
                placeholder="Enter common code"
              />
            </div>
          </section>

          <div className="uomf-divider" />

          {/* Description */}
          <section className="uomf-section">
            <h3 className="uomf-section-title">Description</h3>
            <div className="uomf-field">
              <textarea
                className="uomf-textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </section>

          <div className="uomf-divider" />

          {/* Comments */}
          <section className="uomf-section">
            <h3 className="uomf-section-title">Comments</h3>
            <div className="uomf-comment-row">
              <div className="uomf-comment-avatar">TT</div>
              <input
                className="uomf-comment-input"
                placeholder="Type a reply / comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </section>

          <div className="uomf-divider" />

          {/* Activity */}
          <section className="uomf-section uomf-section-activity">
            <div className="uomf-activity-header">
              <h3 className="uomf-section-title">Activity</h3>
              <button className="uomf-new-email-btn">+ New Email</button>
            </div>
            <ul className="uomf-activity-list">
              <li>Administrator created this · <span className="uomf-activity-time">yesterday</span></li>
              <li>Administrator last edited this · <span className="uomf-activity-time">yesterday</span></li>
            </ul>
            <button className="uomf-activity-collapse">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="uomf-sidebar-right">
          {!isNew ? (
            <>
              <div className="uomf-doc-avatar">{uomName.charAt(0).toUpperCase()}</div>
              <div className="uomf-doc-name">{uomName}</div>
              <div className="uomf-doc-id">{uomName}</div>

              <div className="uomf-sidebar-actions">
                <button className="uomf-sidebar-action">
                  <AssignIcon />
                  Assign
                  <span className="uomf-sidebar-plus">+</span>
                </button>
                <button className="uomf-sidebar-action">
                  <AttachIcon />
                  Attachments
                  <span className="uomf-sidebar-plus">+</span>
                </button>
                <button className="uomf-sidebar-action">
                  <TagsIcon />
                  Tags
                  <span className="uomf-sidebar-plus">+</span>
                </button>
                <button className="uomf-sidebar-action">
                  <ShareIcon />
                  Share
                  <span className="uomf-sidebar-plus">+</span>
                </button>
              </div>

              <div className="uomf-sidebar-meta">
                <div className="uomf-meta-row">
                  <span className="uomf-meta-label">Last Edited By</span>
                  <span className="uomf-meta-val">Administrator</span>
                </div>
                <div className="uomf-meta-time">yesterday</div>
                <div className="uomf-meta-row" style={{ marginTop: 12 }}>
                  <span className="uomf-meta-label">Created By</span>
                  <span className="uomf-meta-val">Administrator</span>
                </div>
                <div className="uomf-meta-time">yesterday</div>
              </div>
            </>
          ) : (
            <>
              <div className="uomf-doc-avatar">N</div>
              <div className="uomf-doc-name">New UOM</div>
              <div className="uomf-doc-id">Not Saved</div>
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