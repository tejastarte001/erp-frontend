import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaCheck,
  FaPlus,
  FaTrash,
  FaFolder,
  FaTag,
  FaList,
  FaBuilding,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaClock,
} from 'react-icons/fa';
import "./ItemGroupForm.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

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

interface ValidationError {
  field: string;
  label: string;
  message: string;
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
    comments: [
      { id: "1", author: "Administrator", initials: "AD", text: "Created this item group", time: "4 hours ago" },
    ],
    activity: [
      { text: "Administrator created this", time: "4 hours ago" },
      { text: "Administrator last edited this", time: "4 hours ago" },
    ],
  },
};

export default function ItemGroupForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const isNew = id === "new";
  const existing = id ? EXISTING_DATA[decodeURIComponent(id)] : undefined;
  const isEditMode = !isNew && existing;

  // ─── Form State ────────────────────────────────────────────────────────
  const [itemGroupName, setItemGroupName] = useState(isNew ? "" : (id !== "new" ? decodeURIComponent(id ?? "") : ""));
  const [parentItemGroup, setParentItemGroup] = useState(existing?.parentItemGroup ?? "");
  const [isGroup, setIsGroup] = useState(existing?.isGroup ?? false);
  const [hsnSac, setHsnSac] = useState(existing?.hsnSac ?? "");
  const [defaults, setDefaults] = useState<DefaultRow[]>(existing?.defaults ?? []);
  const [taxes, setTaxes] = useState<TaxRow[]>(existing?.taxes ?? []);
  const [commentText, setCommentText] = useState("");
  const [isDirty, setIsDirty] = useState(isNew);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const comments = existing?.comments ?? [];
  const activity = existing?.activity ?? [];

  // ─── Validation ──────────────────────────────────────────────────────
  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    if (isNew && !itemGroupName.trim()) {
      allErrors.push({ field: 'itemGroupName', label: 'Item Group Name', message: 'Item group name is required' });
    }

    return allErrors;
  };

  // ─── Handlers ────────────────────────────────────────────────────────
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

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrorsList = getAllValidationErrors();
    if (validationErrorsList.length > 0) {
      setValidationErrors(validationErrorsList);
      setShowValidationSummary(true);
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDirty(false);
      navigate('/item-group');
    } catch (err) {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = getAllValidationErrors().length > 0;

  return (
    <div className={`igf-page ${theme}`}>
      <div className="igf-inner">

        {/* ─── Validation Summary Modal ────────────────────────────── */}
        {showValidationSummary && validationErrors.length > 0 && (
          <div className="modal-overlay" onClick={() => setShowValidationSummary(false)}>
            <div className="validation-summary-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <FaExclamationTriangle /> Missing Required Fields
                </h2>
                <button className="modal-close" onClick={() => setShowValidationSummary(false)}>×</button>
              </div>
              <div className="modal-body">
                <p className="modal-description">
                  Please fill in the following required fields before submitting:
                </p>
                <div className="validation-errors-list">
                  {validationErrors.map((error, idx) => (
                    <div key={idx} className="validation-error-item">
                      <div className="error-header">
                        <FaTimesCircle className="error-icon" />
                        <strong>{error.label}</strong>
                      </div>
                      <div className="error-message">{error.message}</div>
                    </div>
                  ))}
                </div>
                <div className="validation-tip">
                  <FaInfoCircle className="tip-icon" />
                  Please fix the errors above before submitting
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowValidationSummary(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Header ────────────────────────────────────────────────── */}
        <div className="igf-header">
          <button onClick={() => navigate('/item-group')} className="back-btn">
            <FaArrowLeft size={9} /> Back
          </button>
          <div className="header-title">
            <h1>{isNew ? 'Add New Item Group' : `Edit: ${itemGroupName}`}</h1>
          </div>
          {hasErrors && (
            <div className="error-badge">
              <FaExclamationTriangle size={12} />
              {getAllValidationErrors().length} missing field{getAllValidationErrors().length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <form onSubmit={handleSave}>

          {/* ─── Main Form Card ────────────────────────────────────────── */}
          <div className="igf-card">

            {/* General Settings */}
            <span className="igf-section-title">General Settings</span>

            {isNew && (
              <div className="igf-field">
                <label className="igf-label">
                  <FaTag className="igf-label-icon" />Item Group Name <span className="igf-required">*</span>
                </label>
                <input
                  type="text"
                  value={itemGroupName}
                  onChange={(e) => { setItemGroupName(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.itemGroupName ? ' field-error' : ''}`}
                  placeholder="Enter item group name"
                />
                {errors.itemGroupName && <span className="igf-error-msg"><FaExclamationCircle size={10} />{errors.itemGroupName}</span>}
              </div>
            )}

            <div className="igf-grid-2">
              <div className="igf-field">
                <label className="igf-label"><FaFolder className="igf-label-icon" />Parent Item Group</label>
                <input
                  type="text"
                  value={parentItemGroup}
                  onChange={(e) => { setParentItemGroup(e.target.value); setIsDirty(true); }}
                  className="form-field"
                  placeholder="Select parent group"
                />
              </div>

              <div className="igf-field">
                <label className="igf-label"><FaList className="igf-label-icon" />HSN/SAC</label>
                <input
                  type="text"
                  value={hsnSac}
                  onChange={(e) => { setHsnSac(e.target.value); setIsDirty(true); }}
                  className="form-field"
                  placeholder="Enter HSN/SAC code"
                />
                <p className="igf-field-hint">
                  You can search code by the description of the category.
                </p>
              </div>
            </div>

            <div className="igf-field-check">
              <input
                type="checkbox"
                id="isGroup"
                checked={isGroup}
                onChange={(e) => { setIsGroup(e.target.checked); setIsDirty(true); }}
                className="igf-checkbox"
              />
              <div>
                <label htmlFor="isGroup" className="igf-check-label">
                  Is Group
                </label>
                <p className="igf-check-hint">
                  Only leaf nodes are allowed in transaction
                </p>
              </div>
            </div>

            <div className="igf-divider" />

            {/* Defaults */}
            <span className="igf-section-title">Item Group Defaults</span>

            <div className="igf-field">
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
                        <button className="igf-col-settings" title="Column settings" type="button">
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
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.company} onChange={(e) => {
                              setDefaults(defaults.map(r => r.id === row.id ? { ...r, company: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.defaultWarehouse} onChange={(e) => {
                              setDefaults(defaults.map(r => r.id === row.id ? { ...r, defaultWarehouse: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.defaultPriceList} onChange={(e) => {
                              setDefaults(defaults.map(r => r.id === row.id ? { ...r, defaultPriceList: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <button className="igf-remove-row" onClick={() => removeDefaultRow(row.id)} type="button">×</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button className="igf-add-row" onClick={addDefaultRow} type="button">
                <FaPlus size={10} /> Add row
              </button>
            </div>

            <div className="igf-divider" />

            {/* Taxes */}
            <span className="igf-section-title">Item Tax</span>

            <div className="igf-field">
              <div className="igf-table-block">
                <table className="igf-inline-table">
                  <thead>
                    <tr>
                      <th className="igf-ith igf-ith-no"><input type="checkbox" className="igf-checkbox" /></th>
                      <th className="igf-ith">No.</th>
                      <th className="igf-ith">Item Tax Template <span className="igf-required">*</span></th>
                      <th className="igf-ith">Tax Category</th>
                      <th className="igf-ith">Valid From</th>
                      <th className="igf-ith">Min Net Rate</th>
                      <th className="igf-ith">Max Net Rate</th>
                      <th className="igf-ith igf-ith-action">
                        <button className="igf-col-settings" title="Column settings" type="button">
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
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.itemTaxTemplate} onChange={(e) => {
                              setTaxes(taxes.map(r => r.id === row.id ? { ...r, itemTaxTemplate: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.taxCategory} onChange={(e) => {
                              setTaxes(taxes.map(r => r.id === row.id ? { ...r, taxCategory: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.validFrom} onChange={(e) => {
                              setTaxes(taxes.map(r => r.id === row.id ? { ...r, validFrom: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.minNetRate} onChange={(e) => {
                              setTaxes(taxes.map(r => r.id === row.id ? { ...r, minNetRate: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <input className="igf-cell-input" value={row.maxNetRate} onChange={(e) => {
                              setTaxes(taxes.map(r => r.id === row.id ? { ...r, maxNetRate: e.target.value } : r));
                              setIsDirty(true);
                            }} />
                          </td>
                          <td className="igf-itd">
                            <button className="igf-remove-row" onClick={() => removeTaxRow(row.id)} type="button">×</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button className="igf-add-row" onClick={addTaxRow} type="button">
                <FaPlus size={10} /> Add row
              </button>
            </div>

            {/* ─── Comments & Activity (only for existing records) ─── */}
            {!isNew && (
              <>
                <div className="igf-divider" />
                <span className="igf-section-title">Comments</span>

                <div className="igf-comment-input-row">
                  <div className="igf-comment-avatar">AD</div>
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

                <div className="igf-divider" />

                <div className="igf-activity-header">
                  <span className="igf-section-title igf-activity-title">Activity</span>
                  <button className="igf-new-email-btn" type="button">+ New Email</button>
                </div>

                <ul className="igf-activity-list">
                  {activity.map((a, i) => (
                    <li key={i} className="igf-activity-item">
                      {a.text} · <span className="igf-activity-time">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ─── Footer ────────────────────────────────────────────────── */}
          <div className="igf-footer">
            <button
              type="button"
              onClick={() => navigate('/item-group')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting && <FaSpinner className="spinning" />}
              <FaSave size={12} />
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}