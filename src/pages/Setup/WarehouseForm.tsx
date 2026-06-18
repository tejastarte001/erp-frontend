import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaBuilding,
  FaBoxes,
  FaUsers,
  FaUserTie,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaCheckSquare,
  FaHome,
} from 'react-icons/fa';
import "./WarehouseForm.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface ValidationError {
  field: string;
  label: string;
  message: string;
}

export default function WarehouseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const isNew = id === "new";
  const warehouseName = isNew ? "New Warehouse" : decodeURIComponent(id || "");
  const isEditMode = !isNew;

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
  const [isContactInfoExpanded, setIsContactInfoExpanded] = useState(false);
  const [isTransitExpanded, setIsTransitExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // ─── Validation ──────────────────────────────────────────────────────
  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    if (isNew && !form.warehouseName.trim()) {
      allErrors.push({ field: 'warehouseName', label: 'Warehouse Name', message: 'Warehouse name is required' });
    }
    if (!form.company.trim()) {
      allErrors.push({ field: 'company', label: 'Company', message: 'Company is required' });
    }

    return allErrors;
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
      navigate('/warehouse');
    } catch (err) {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = getAllValidationErrors().length > 0;

  return (
    <div className={`wf-page ${theme}`}>
      <div className="wf-inner">

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
        <div className="wf-header">
          <button onClick={() => navigate('/warehouse')} className="back-btn">
            <FaArrowLeft size={9} /> Back
          </button>
          <div className="header-title">
            <h1>{isNew ? 'Add New Warehouse' : `Edit: ${warehouseName}`}</h1>
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
          <div className="wf-card">

            {/* Warehouse Detail */}
            <span className="wf-section-title">Warehouse Detail</span>

            {isNew && (
              <div className="wf-field">
                <label className="wf-label">
                  <FaBuilding className="wf-label-icon" />Warehouse Name <span className="wf-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.warehouseName}
                  onChange={(e) => setForm({ ...form, warehouseName: e.target.value })}
                  className={`form-field${errors.warehouseName ? ' field-error' : ''}`}
                  placeholder="Enter warehouse name"
                />
                {errors.warehouseName && <span className="wf-error-msg"><FaExclamationCircle size={10} />{errors.warehouseName}</span>}
              </div>
            )}

            <div className="wf-grid-2">
              <div className="wf-field">
                <label className="wf-label">
                  <FaUsers className="wf-label-icon" />Company <span className="wf-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={`form-field${errors.company ? ' field-error' : ''}`}
                  placeholder="Enter company name"
                />
                {errors.company && <span className="wf-error-msg"><FaExclamationCircle size={10} />{errors.company}</span>}
              </div>

              <div className="wf-field">
                <label className="wf-label">
                  <FaBoxes className="wf-label-icon" />Parent Warehouse
                </label>
                <input
                  type="text"
                  value={form.parentWarehouse}
                  onChange={(e) => setForm({ ...form, parentWarehouse: e.target.value })}
                  className="form-field"
                  placeholder="Select parent warehouse"
                />
              </div>
            </div>

            <div className="wf-field-check">
              <input
                type="checkbox"
                id="isRejectedWarehouse"
                checked={form.isRejectedWarehouse}
                onChange={(e) => setForm({ ...form, isRejectedWarehouse: e.target.checked })}
                className="wf-checkbox"
              />
              <div>
                <label htmlFor="isRejectedWarehouse" className="wf-check-label">
                  <FaCheckSquare className="wf-check-icon" /> Is Rejected Warehouse
                </label>
                <p className="wf-check-hint">If yes, then this warehouse will be used to store rejected materials</p>
              </div>
            </div>

            <div className="wf-field-check">
              <input
                type="checkbox"
                id="isGroupWarehouse"
                checked={form.isGroupWarehouse}
                onChange={(e) => setForm({ ...form, isGroupWarehouse: e.target.checked })}
                className="wf-checkbox"
              />
              <div>
                <label htmlFor="isGroupWarehouse" className="wf-check-label">
                  <FaCheckSquare className="wf-check-icon" /> Is Group Warehouse
                </label>
                <p className="wf-check-hint">Enable if this is a group warehouse</p>
              </div>
            </div>

            {/* Contact Info Collapsible */}
            <div className="wf-collapsible">
              <button 
                type="button"
                className="wf-collapsible-btn" 
                onClick={() => setIsContactInfoExpanded(!isContactInfoExpanded)}
              >
                <span className="wf-collapsible-icon">
                  {isContactInfoExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                Warehouse Contact Info
              </button>
              {isContactInfoExpanded && (
                <div className="wf-collapsible-content">
                  <div className="wf-empty-state">No address added yet.</div>
                  <div className="wf-empty-state">No contacts added yet.</div>
                  <div className="wf-collapsible-actions">
                    <button type="button" className="wf-link-btn">
                      <FaPlus size={10} /> New Address
                    </button>
                    <button type="button" className="wf-link-btn">
                      <FaPlus size={10} /> New Contact
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Transit Collapsible */}
            <div className="wf-collapsible">
              <button 
                type="button"
                className="wf-collapsible-btn" 
                onClick={() => setIsTransitExpanded(!isTransitExpanded)}
              >
                <span className="wf-collapsible-icon">
                  {isTransitExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                Transit
              </button>
              {isTransitExpanded && (
                <div className="wf-collapsible-content">
                  <div className="wf-empty-state">No transit configurations added yet.</div>
                  <button type="button" className="wf-link-btn">
                    <FaPlus size={10} /> Add Transit
                  </button>
                </div>
              )}
            </div>

            <div className="wf-divider" />

            {/* Account */}
            <span className="wf-section-title">Account</span>
            <div className="wf-field">
              <label className="wf-label">
                <FaHome className="wf-label-icon" />Account
              </label>
              <input
                type="text"
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                className="form-field"
                placeholder="If blank, parent Warehouse Account or company default will be considered in transactions"
              />
              <p className="wf-field-hint">
                If blank, parent Warehouse Account or company default will be considered in transactions
              </p>
            </div>

            <div className="wf-divider" />

            {/* Customer */}
            <span className="wf-section-title">Customer</span>
            <div className="wf-field">
              <label className="wf-label">
                <FaUserTie className="wf-label-icon" />Customer
              </label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className="form-field"
                placeholder="Only to be used for Subcontracting Inward"
              />
              <p className="wf-field-hint">Only to be used for Subcontracting Inward</p>
            </div>

            {/* ─── Comments & Activity (only for existing records) ─── */}
            {!isNew && (
              <>
                <div className="wf-divider" />
                <span className="wf-section-title">Comments</span>

                <div className="wf-comment-input-row">
                  <div className="wf-comment-avatar">AD</div>
                  <input
                    className="wf-comment-input"
                    placeholder="Type a reply / comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="wf-divider" />

                <div className="wf-activity-header">
                  <span className="wf-section-title wf-activity-title">Activity</span>
                  <button className="wf-new-email-btn" type="button">+ New Email</button>
                </div>

                <ul className="wf-activity-list">
                  <li>Administrator created this · <span className="wf-activity-time">yesterday</span></li>
                  <li>Administrator last edited this · <span className="wf-activity-time">yesterday</span></li>
                </ul>
              </>
            )}
          </div>

          {/* ─── Footer ────────────────────────────────────────────────── */}
          <div className="wf-footer">
            <button
              type="button"
              onClick={() => navigate('/warehouse')}
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