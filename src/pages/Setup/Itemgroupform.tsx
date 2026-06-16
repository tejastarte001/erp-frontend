import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemGroupForm.css";

interface DefaultRow {
  id: string;
  company: string;
  defaultWarehouse: string;
  defaultPriceList: string;
}

interface TaxRow {
  id: string;
  itemTaxTemplate: string;
  taxCategory: string;
  validFrom: string;
  minNetRate: string;
  maxNetRate: string;
}

interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
  time: string;
}

const EXISTING_DATA: Record<string, {
  parentItemGroup: string;
  isGroup: boolean;
  hsnSac: string;
  defaults: DefaultRow[];
  taxes: TaxRow[];
  comments: Comment[];
  activity: { text: string; time: string }[];
}> = {
  "Consumable": {
    parentItemGroup: "All Item Groups",
    isGroup: false,
    hsnSac: "",
    defaults: [],
    taxes: [],
    comments: [],
    activity: [
      { text: "Administrator created this", time: "4 hours ago" },
      { text: "Administrator last edited this", time: "4 hours ago" },
    ],
  },
};

export default function ItemGroupForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const existing = id ? EXISTING_DATA[decodeURIComponent(id)] : undefined;

  const [itemGroupName, setItemGroupName] = useState(isNew ? "" : (id !== "new" ? decodeURIComponent(id ?? "") : ""));
  const [parentItemGroup, setParentItemGroup] = useState(existing?.parentItemGroup ?? "");
  const [isGroup, setIsGroup] = useState(existing?.isGroup ?? false);
  const [hsnSac, setHsnSac] = useState(existing?.hsnSac ?? "");
  const [defaults, setDefaults] = useState<DefaultRow[]>(existing?.defaults ?? []);
  const [taxes, setTaxes] = useState<TaxRow[]>(existing?.taxes ?? []);
  const [commentText, setCommentText] = useState("");
  const [isDirty, setIsDirty] = useState(isNew);

  const comments = existing?.comments ?? [];
  const activity = existing?.activity ?? [];

  const addDefaultRow = () => {
    setDefaults([...defaults, { id: Date.now().toString(), company: "", defaultWarehouse: "", defaultPriceList: "" }]);
    setIsDirty(true);
  };

  const addTaxRow = () => {
    setTaxes([...taxes, { id: Date.now().toString(), itemTaxTemplate: "", taxCategory: "", validFrom: "", minNetRate: "", maxNetRate: "" }]);
    setIsDirty(true);
  };

  const removeDefaultRow = (rowId: string) => {
    setDefaults(defaults.filter((r) => r.id !== rowId));
    setIsDirty(true);
  };

  const removeTaxRow = (rowId: string) => {
    setTaxes(taxes.filter((r) => r.id !== rowId));
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsDirty(false);
    // Save logic here
  };

  return (
    <div className="igf-page">
      {/* Top bar */}
      <div className="igf-topbar">
        <div className="igf-breadcrumb">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="igf-bc-sep">/</span>
          <span className="igf-bc-link" onClick={() => navigate("/item-group")}>Stock</span>
          <span className="igf-bc-sep">/</span>
          <span className="igf-bc-link" onClick={() => navigate("/item-group")}>Item Group</span>
          <span className="igf-bc-sep">/</span>
          <span className="igf-bc-current">{isNew ? "New Item Group" : itemGroupName}</span>
          {isNew && <span className="igf-status-badge unsaved">Not Saved</span>}
        </div>
        <div className="igf-topbar-right">
          {!isNew && (
            <>
              <button className="igf-btn-outline">Item Group Tree</button>
              <button className="igf-btn-outline">Items</button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                </svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
              {/* Nav arrows */}
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="igf-btn-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
                </svg>
              </button>
            </>
          )}
          {isNew && (
            <button className="igf-btn-outline">Item Group Tree</button>
          )}
          <button className="igf-btn-save" onClick={handleSave} disabled={!isDirty}>
            Save
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="igf-layout">
        {/* Main form */}
        <div className="igf-main">
          {/* General Settings */}
          <section className="igf-section">
            <h2 className="igf-section-title">General Settings</h2>

            {isNew && (
              <div className="igf-field">
                <label className="igf-label">
                  Item Group Name <span className="igf-required">*</span>
                </label>
                <input
                  className="igf-input"
                  value={itemGroupName}
                  onChange={(e) => { setItemGroupName(e.target.value); setIsDirty(true); }}
                  placeholder=""
                />
              </div>
            )}

            <div className="igf-field">
              <label className="igf-label">Parent Item Group</label>
              <div className="igf-input-wrap">
                <input
                  className="igf-input"
                  value={parentItemGroup}
                  onChange={(e) => { setParentItemGroup(e.target.value); setIsDirty(true); }}
                  placeholder=""
                />
              </div>
            </div>

            <div className="igf-field igf-field-check">
              <input
                type="checkbox"
                id="isGroup"
                checked={isGroup}
                onChange={(e) => { setIsGroup(e.target.checked); setIsDirty(true); }}
                className="igf-checkbox"
              />
              <div>
                <label htmlFor="isGroup" className="igf-check-label">Is Group</label>
                <p className="igf-check-hint">Only leaf nodes are allowed in transaction</p>
              </div>
            </div>
          </section>

          <div className="igf-divider" />

          {/* Defaults */}
          <section className="igf-section">
            <h2 className="igf-section-title">Defaults</h2>

            <div className="igf-field">
              <label className="igf-label">HSN/SAC</label>
              <input
                className="igf-input"
                value={hsnSac}
                onChange={(e) => { setHsnSac(e.target.value); setIsDirty(true); }}
                placeholder=""
              />
              <p className="igf-field-hint">You can search code by the description of the category.</p>
            </div>

            <div className="igf-field">
              <label className="igf-label">Item Group Defaults</label>
              <div className="igf-table-block">
                <table className="igf-inline-table">
                  <thead>
                    <tr>
                      <th className="igf-ith igf-ith-no">
                        <input type="checkbox" className="igf-checkbox" />
                      </th>
                      <th className="igf-ith">No.</th>
                      <th className="igf-ith">Company <span className="igf-required">*</span></th>
                      <th className="igf-ith">Default Warehouse</th>
                      <th className="igf-ith">Default Price List</th>
                      <th className="igf-ith igf-ith-action">
                        <button className="igf-col-settings" title="Column settings">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                          </svg>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {defaults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="igf-empty-row">No rows</td>
                      </tr>
                    ) : (
                      defaults.map((row, i) => (
                        <tr key={row.id} className="igf-itr">
                          <td className="igf-itd"><input type="checkbox" className="igf-checkbox" /></td>
                          <td className="igf-itd igf-itd-no">{i + 1}</td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.company} onChange={(e) => {
                            setDefaults(defaults.map(r => r.id === row.id ? { ...r, company: e.target.value } : r));
                          }} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.defaultWarehouse} onChange={(e) => {
                            setDefaults(defaults.map(r => r.id === row.id ? { ...r, defaultWarehouse: e.target.value } : r));
                          }} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.defaultPriceList} onChange={(e) => {
                            setDefaults(defaults.map(r => r.id === row.id ? { ...r, defaultPriceList: e.target.value } : r));
                          }} /></td>
                          <td className="igf-itd">
                            <button className="igf-remove-row" onClick={() => removeDefaultRow(row.id)}>×</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button className="igf-add-row" onClick={addDefaultRow}>Add row</button>
            </div>
          </section>

          <div className="igf-divider" />

          {/* Item Tax */}
          <section className="igf-section">
            <h2 className="igf-section-title">Item Tax</h2>

            <div className="igf-field">
              <label className="igf-label">Taxes</label>
              <div className="igf-table-block">
                <table className="igf-inline-table">
                  <thead>
                    <tr>
                      <th className="igf-ith igf-ith-no"><input type="checkbox" className="igf-checkbox" /></th>
                      <th className="igf-ith">No.</th>
                      <th className="igf-ith">Item Tax Template <span className="igf-required">*</span></th>
                      <th className="igf-ith">Tax Category</th>
                      <th className="igf-ith">Valid From</th>
                      <th className="igf-ith">Minimum Net Rate</th>
                      <th className="igf-ith">Maximum Net Rate</th>
                      <th className="igf-ith igf-ith-action">
                        <button className="igf-col-settings" title="Column settings">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                          </svg>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="igf-empty-row">No rows</td>
                      </tr>
                    ) : (
                      taxes.map((row, i) => (
                        <tr key={row.id} className="igf-itr">
                          <td className="igf-itd"><input type="checkbox" className="igf-checkbox" /></td>
                          <td className="igf-itd igf-itd-no">{i + 1}</td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.itemTaxTemplate} onChange={(e) => setTaxes(taxes.map(r => r.id === row.id ? { ...r, itemTaxTemplate: e.target.value } : r))} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.taxCategory} onChange={(e) => setTaxes(taxes.map(r => r.id === row.id ? { ...r, taxCategory: e.target.value } : r))} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.validFrom} onChange={(e) => setTaxes(taxes.map(r => r.id === row.id ? { ...r, validFrom: e.target.value } : r))} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.minNetRate} onChange={(e) => setTaxes(taxes.map(r => r.id === row.id ? { ...r, minNetRate: e.target.value } : r))} /></td>
                          <td className="igf-itd"><input className="igf-cell-input" value={row.maxNetRate} onChange={(e) => setTaxes(taxes.map(r => r.id === row.id ? { ...r, maxNetRate: e.target.value } : r))} /></td>
                          <td className="igf-itd"><button className="igf-remove-row" onClick={() => removeTaxRow(row.id)}>×</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button className="igf-add-row" onClick={addTaxRow}>Add row</button>
            </div>
          </section>

          {/* Comments & Activity - only on existing records */}
          {!isNew && (
            <>
              <div className="igf-divider" />
              <section className="igf-section">
                <h2 className="igf-section-title">Comments</h2>
                <div className="igf-comment-input-row">
                  <div className="igf-comment-avatar">TT</div>
                  <input
                    className="igf-comment-input"
                    placeholder="Type a reply / comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                {comments.map((c) => (
                  <div key={c.id} className="igf-comment-row">
                    <div className="igf-comment-avatar">{c.initials}</div>
                    <div>
                      <div className="igf-comment-author">{c.author} <span className="igf-comment-time">{c.time}</span></div>
                      <div className="igf-comment-text">{c.text}</div>
                    </div>
                  </div>
                ))}
              </section>

              <div className="igf-divider" />
              <section className="igf-section igf-section-activity">
                <div className="igf-activity-header">
                  <h2 className="igf-section-title" style={{ margin: 0 }}>Activity</h2>
                  <button className="igf-new-email-btn">+ New Email</button>
                </div>
                <ul className="igf-activity-list">
                  {activity.map((a, i) => (
                    <li key={i} className="igf-activity-item">
                      {a.text} · <span className="igf-activity-time">{a.time}</span>
                    </li>
                  ))}
                </ul>
                <button className="igf-activity-collapse">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
              </section>
            </>
          )}
        </div>

        {/* Right sidebar - only for existing records */}
        {!isNew && (
          <aside className="igf-sidebar">
            <div className="igf-doc-avatar">
              {itemGroupName.charAt(0).toUpperCase()}
            </div>
            <div className="igf-doc-name">{itemGroupName}</div>

            <div className="igf-sidebar-actions">
              <button className="igf-sidebar-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Assign
                <span className="igf-sidebar-plus">+</span>
              </button>
              <button className="igf-sidebar-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Attachments
                <span className="igf-sidebar-plus">+</span>
              </button>
              <button className="igf-sidebar-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Tags
                <span className="igf-sidebar-plus">+</span>
              </button>
              <button className="igf-sidebar-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
                <span className="igf-sidebar-plus">+</span>
              </button>
            </div>

            <div className="igf-sidebar-meta">
              <div className="igf-meta-row">
                <span className="igf-meta-label">Last Edited By</span>
                <span className="igf-meta-val">Administrator</span>
              </div>
              <div className="igf-meta-time">4 hours ago</div>
              <div className="igf-meta-row" style={{ marginTop: 12 }}>
                <span className="igf-meta-label">Created By</span>
                <span className="igf-meta-val">Administrator</span>
              </div>
              <div className="igf-meta-time">4 hours ago</div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}