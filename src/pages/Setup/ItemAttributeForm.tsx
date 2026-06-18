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
  FaPlus,
  FaTrash,
  FaTag,
} from 'react-icons/fa';
import "./ItemAttributeForm.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface AttributeValue {
  id: string;
  value: string;
  abbreviation: string;
}

interface ValidationError {
  field: string;
  label: string;
  message: string;
}

export default function ItemAttributeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const isNew = id === "new";
  const attributeName = isNew ? "New Item Attribute" : id || "";
  const isEditMode = !isNew;

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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const addRow = () => {
    setValues([...values, { id: Date.now().toString(), value: "", abbreviation: "" }]);
  };

  const removeRow = (id: string) => {
    setValues(values.filter((v) => v.id !== id));
  };

  const updateValue = (id: string, field: keyof AttributeValue, val: string) => {
    setValues(values.map((v) => (v.id === id ? { ...v, [field]: val } : v)));
  };

  // ─── Validation ──────────────────────────────────────────────────────
  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    if (!form.attributeName.trim()) {
      allErrors.push({ field: 'attributeName', label: 'Attribute Name', message: 'Attribute name is required' });
    }

    values.forEach((v, i) => {
      if (!v.value.trim()) {
        allErrors.push({ field: `value_${i}`, label: `Attribute Value ${i + 1}`, message: 'Attribute value is required' });
      }
      if (!v.abbreviation.trim()) {
        allErrors.push({ field: `abbreviation_${i}`, label: `Abbreviation ${i + 1}`, message: 'Abbreviation is required' });
      }
    });

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
      navigate('/item-attribute');
    } catch (err) {
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = getAllValidationErrors().length > 0;

  return (
    <div className={`iaf-page ${theme}`}>
      <div className="iaf-inner">

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
        <div className="iaf-header">
          <button onClick={() => navigate('/item-attribute')} className="back-btn">
            <FaArrowLeft size={9} /> Back
          </button>
          <div className="header-title">
            <h1>{isNew ? 'Add New Item Attribute' : `Edit: ${attributeName}`}</h1>
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
          <div className="iaf-card">

            {/* General Settings */}
            <span className="iaf-section-title">General Settings</span>

            <div className="iaf-field">
              <label className="iaf-label">
                <FaTag className="iaf-label-icon" />Attribute Name <span className="iaf-required">*</span>
              </label>
              <input
                type="text"
                value={form.attributeName}
                onChange={(e) => setForm({ ...form, attributeName: e.target.value })}
                className={`form-field${errors.attributeName ? ' field-error' : ''}`}
                placeholder="Enter attribute name"
              />
              {errors.attributeName && <span className="iaf-error-msg"><FaExclamationCircle size={10} />{errors.attributeName}</span>}
            </div>

            <div className="iaf-field-check">
              <input
                type="checkbox"
                id="disabled"
                checked={form.disabled}
                onChange={(e) => setForm({ ...form, disabled: e.target.checked })}
                className="iaf-checkbox"
              />
              <div>
                <label htmlFor="disabled" className="iaf-check-label">Disabled</label>
                <p className="iaf-check-hint">Disable this attribute if it is no longer in use</p>
              </div>
            </div>

            <div className="iaf-field-check">
              <input
                type="checkbox"
                id="numericValues"
                checked={form.numericValues}
                onChange={(e) => setForm({ ...form, numericValues: e.target.checked })}
                className="iaf-checkbox"
              />
              <div>
                <label htmlFor="numericValues" className="iaf-check-label">Numeric Values</label>
                <p className="iaf-check-hint">Enable if attribute values are numeric (e.g., sizes, measurements)</p>
              </div>
            </div>

            <div className="iaf-divider" />

            {/* Item Attribute Values Table */}
            <span className="iaf-section-title">Item Attribute Values</span>

            <div className="iaf-field">
              <div className="iaf-table-block">
                <table className="iaf-inline-table">
                  <thead>
                    <tr>
                      <th className="iaf-ith iaf-ith-no">
                        <input type="checkbox" className="iaf-checkbox" />
                      </th>
                      <th className="iaf-ith">No.</th>
                      <th className="iaf-ith">Attribute Value <span className="iaf-required">*</span></th>
                      <th className="iaf-ith">Abbreviation <span className="iaf-required">*</span></th>
                      <th className="iaf-ith iaf-ith-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="iaf-empty-row">No rows</td>
                      </tr>
                    ) : (
                      values.map((row, i) => (
                        <tr key={row.id} className="iaf-itr">
                          <td className="iaf-itd"><input type="checkbox" className="iaf-checkbox" /></td>
                          <td className="iaf-itd iaf-itd-no">{i + 1}</td>
                          <td className="iaf-itd">
                            <input
                              className="iaf-cell-input"
                              value={row.value}
                              onChange={(e) => updateValue(row.id, "value", e.target.value)}
                              placeholder="Enter value"
                            />
                          </td>
                          <td className="iaf-itd">
                            <input
                              className="iaf-cell-input"
                              value={row.abbreviation}
                              onChange={(e) => updateValue(row.id, "abbreviation", e.target.value)}
                              placeholder="Enter abbreviation"
                            />
                          </td>
                          <td className="iaf-itd">
                            <button className="iaf-remove-row" onClick={() => removeRow(row.id)} type="button">×</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button className="iaf-add-row" onClick={addRow} type="button">
                <FaPlus size={10} /> Add row
              </button>
            </div>

            {/* ─── Comments & Activity (only for existing records) ─── */}
            {!isNew && (
              <>
                <div className="iaf-divider" />
                <span className="iaf-section-title">Comments</span>

                <div className="iaf-comment-input-row">
                  <div className="iaf-comment-avatar">AD</div>
                  <input
                    className="iaf-comment-input"
                    placeholder="Type a reply / comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="iaf-divider" />

                <div className="iaf-activity-header">
                  <span className="iaf-section-title iaf-activity-title">Activity</span>
                  <button className="iaf-new-email-btn" type="button">+ New Email</button>
                </div>

                <ul className="iaf-activity-list">
                  <li>Administrator created this · <span className="iaf-activity-time">yesterday</span></li>
                  <li>Administrator last edited this · <span className="iaf-activity-time">yesterday</span></li>
                </ul>
              </>
            )}
          </div>

          {/* ─── Footer ────────────────────────────────────────────────── */}
          <div className="iaf-footer">
            <button
              type="button"
              onClick={() => navigate('/item-attribute')}
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