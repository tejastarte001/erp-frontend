// WorkOrderForm.tsx - Updated to handle view mode
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaBox,
  FaClipboardList,
  FaCalendar,
  FaBuilding,
  FaIndustry,
  FaRuler,
  FaEdit,
} from 'react-icons/fa';
import "./WorkOrderForm.css";
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import api from '../services/api';

type Status = "Draft" | "Not Started" | "In Process" | "Completed" | "Stopped";

interface WorkOrderData {
  id: number;
  name: string;
  production_item: string;
  bom_no: string;
  qty: number;
  produced_qty: number;
  company: string;
  status: Status;
  planned_start_date: string;
  planned_end_date: string;
}

interface ValidationError {
  field: string;
  label: string;
  message: string;
}

const STATUS_OPTIONS: Status[] = ["Draft", "Not Started", "In Process", "Completed", "Stopped"];
const STATUS_LABELS: Record<Status, string> = {
  Draft: "Draft",
  "Not Started": "Not Started",
  "In Process": "In Process",
  Completed: "Completed",
  Stopped: "Stopped",
};

const STATUS_CLASS: Record<Status, string> = {
  Draft: "s-draft",
  "Not Started": "s-notstarted",
  "In Process": "s-inprocess",
  Completed: "s-completed",
  Stopped: "s-stopped",
};

interface ApiResponse {
  success: number;
  data: WorkOrderData;
}

export default function WorkOrderForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const isNew = id === "new";

  // ─── Form State ────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [productionItem, setProductionItem] = useState("");
  const [bomNo, setBomNo] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [producedQty, setProducedQty] = useState<number>(0);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("Draft");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [plannedEndDate, setPlannedEndDate] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);
  const [, setIsDirty] = useState(isNew);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // ─── Fetch existing work order ──────────────────────────────────────
  useEffect(() => {
    if (!isNew && id) {
      const fetchWorkOrder = async () => {
        setLoading(true);
        try {
          const response = await api.get<ApiResponse>(`/work-order/${id}`);
          if (response.data.success === 1) {
            const data = response.data.data;
            setName(data.name);
            setProductionItem(data.production_item);
            setBomNo(data.bom_no);
            setQty(data.qty);
            setProducedQty(data.produced_qty);
            setCompany(data.company);
            setStatus(data.status);
            setPlannedStartDate(data.planned_start_date.split('T')[0]);
            setPlannedEndDate(data.planned_end_date.split('T')[0]);
            // Set view mode by default when viewing existing records
            setIsViewMode(true);
          }
        } catch (err) {
          console.error('Error fetching work order:', err);
          setApiError('Failed to load work order data');
        } finally {
          setLoading(false);
        }
      };
      fetchWorkOrder();
    }
  }, [id, isNew]);

  // ─── Validation ──────────────────────────────────────────────────────
  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    if (!name.trim()) {
      allErrors.push({ field: 'name', label: 'Work Order Name', message: 'Work order name is required' });
    }

    if (!productionItem.trim()) {
      allErrors.push({ field: 'productionItem', label: 'Production Item', message: 'Production item is required' });
    }

    if (!bomNo.trim()) {
      allErrors.push({ field: 'bomNo', label: 'BOM Number', message: 'BOM number is required' });
    }

    if (qty <= 0) {
      allErrors.push({ field: 'qty', label: 'Quantity', message: 'Quantity must be greater than 0' });
    }

    if (!company.trim()) {
      allErrors.push({ field: 'company', label: 'Company', message: 'Company is required' });
    }

    if (!plannedStartDate) {
      allErrors.push({ field: 'plannedStartDate', label: 'Planned Start Date', message: 'Planned start date is required' });
    }

    if (!plannedEndDate) {
      allErrors.push({ field: 'plannedEndDate', label: 'Planned End Date', message: 'Planned end date is required' });
    }

    if (plannedStartDate && plannedEndDate && plannedStartDate > plannedEndDate) {
      allErrors.push({ field: 'plannedEndDate', label: 'Planned End Date', message: 'End date must be after start date' });
    }

    return allErrors;
  };

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const validationErrorsList = getAllValidationErrors();
    if (validationErrorsList.length > 0) {
      setValidationErrors(validationErrorsList);
      setShowValidationSummary(true);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        production_item: productionItem.trim(),
        bom_no: bomNo.trim(),
        qty: qty,
        produced_qty: producedQty || 0,
        company: company.trim(),
        status: status,
        planned_start_date: plannedStartDate,
        planned_end_date: plannedEndDate,
      };

      let response;
      if (isNew) {
        response = await api.post('/work-order', payload);
      } else {
        response = await api.put(`/work-order/${id}`, payload);
      }

      if (response.data && response.data.success === 1) {
        console.log(isNew ? 'Work order created successfully:' : 'Work order updated successfully:', response.data);
        setIsDirty(false);
        setIsViewMode(true);
        navigate('/work-order');
      } else {
        setApiError(response.data?.message || `Failed to ${isNew ? 'create' : 'update'} work order`);
      }
    } catch (err: any) {
      console.error('Error saving work order:', err);

      if (err.response) {
        if (err.response.status === 409) {
          setApiError('A work order with this name already exists');
        } else if (err.response.status === 400) {
          setApiError(err.response.data?.message || 'Invalid data provided');
        } else {
          setApiError(err.response.data?.message || `Failed to ${isNew ? 'create' : 'update'} work order`);
        }
      } else if (err.request) {
        setApiError('Network error. Please check your connection.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
    setIsDirty(true);
  };

  const handleEditMode = () => {
    setIsViewMode(false);
  };

  const hasErrors = getAllValidationErrors().length > 0;

  if (loading) {
    return (
      <div className={`wof-page ${theme}`}>
        <div className="wof-inner">
          <div className="wof-loading">Loading work order data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wof-page ${theme}`}>
      <div className="wof-inner">

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

        {/* ─── API Error Display ────────────────────────────────────── */}
        {apiError && (
          <div className="wof-api-error">
            <FaExclamationCircle className="error-icon" />
            <span>{apiError}</span>
            <button className="error-close" onClick={() => setApiError(null)}>×</button>
          </div>
        )}

        {/* ─── Header ────────────────────────────────────────────────── */}
        <div className="wof-header">
          <button onClick={() => navigate('/work-order')} className="back-btn">
            <FaArrowLeft size={9} /> Back
          </button>
          <div className="header-title">
            <h1>
              {isNew ? 'Add New Work Order' : `${isViewMode ? 'View' : 'Edit'}: ${name}`}
            </h1>
            {!isNew && (
              <span className={`wof-status-badge ${STATUS_CLASS[status]}`}>
                {STATUS_LABELS[status]}
              </span>
            )}
          </div>
          {!isNew && isViewMode && (
            <button className="wof-edit-btn" onClick={handleEditMode}>
              <FaEdit size={12} /> Edit
            </button>
          )}
          {!isViewMode && hasErrors && (
            <div className="error-badge">
              <FaExclamationTriangle size={12} />
              {getAllValidationErrors().length} missing field{getAllValidationErrors().length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <form onSubmit={handleSave}>
          <div className="wof-card">
            <span className="wof-section-title">
              <FaClipboardList className="wof-section-icon" /> Work Order Details
            </span>

            <div className="wof-grid-2">
              <div className="wof-field">
                <label className="wof-label">
                  <FaBox className="wof-label-icon" />Work Order Name <span className="wof-required">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.name ? ' field-error' : ''}`}
                  placeholder="e.g. WO-00001"
                  disabled={submitting || loading || isViewMode}
                />
                {errors.name && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.name}</span>}
              </div>

              <div className="wof-field">
                <label className="wof-label">
                  <FaIndustry className="wof-label-icon" />Production Item <span className="wof-required">*</span>
                </label>
                <input
                  type="text"
                  value={productionItem}
                  onChange={(e) => { setProductionItem(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.productionItem ? ' field-error' : ''}`}
                  placeholder="e.g. FG-001"
                  disabled={submitting || loading || isViewMode}
                />
                {errors.productionItem && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.productionItem}</span>}
              </div>
            </div>

            <div className="wof-grid-2">
              <div className="wof-field">
                <label className="wof-label">
                  <FaClipboardList className="wof-label-icon" />BOM Number <span className="wof-required">*</span>
                </label>
                <input
                  type="text"
                  value={bomNo}
                  onChange={(e) => { setBomNo(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.bomNo ? ' field-error' : ''}`}
                  placeholder="e.g. BOM-00001"
                  disabled={submitting || loading || isViewMode}
                />
                {errors.bomNo && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.bomNo}</span>}
              </div>

              <div className="wof-field">
                <label className="wof-label">
                  <FaBuilding className="wof-label-icon" />Company <span className="wof-required">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.company ? ' field-error' : ''}`}
                  placeholder="e.g. SculptorTech Pvt Ltd"
                  disabled={submitting || loading || isViewMode}
                />
                {errors.company && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.company}</span>}
              </div>
            </div>

            <div className="wof-grid-2">
              <div className="wof-field">
                <label className="wof-label">
                  <FaRuler className="wof-label-icon" />Quantity <span className="wof-required">*</span>
                </label>
                <input
                  type="number"
                  value={qty || ''}
                  onChange={(e) => { setQty(Number(e.target.value)); setIsDirty(true); }}
                  className={`form-field${errors.qty ? ' field-error' : ''}`}
                  placeholder="e.g. 100"
                  min="1"
                  disabled={submitting || loading || isViewMode}
                />
                {errors.qty && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.qty}</span>}
              </div>

              <div className="wof-field">
                <label className="wof-label">Produced Quantity</label>
                <input
                  type="number"
                  value={producedQty || ''}
                  onChange={(e) => { setProducedQty(Number(e.target.value)); setIsDirty(true); }}
                  className="form-field"
                  placeholder="e.g. 0"
                  min="0"
                  disabled={submitting || loading || isViewMode}
                />
              </div>
            </div>

            <div className="wof-grid-2">
              <div className="wof-field">
                <label className="wof-label">
                  <FaCalendar className="wof-label-icon" />Planned Start Date <span className="wof-required">*</span>
                </label>
                <input
                  type="date"
                  value={plannedStartDate}
                  onChange={(e) => { setPlannedStartDate(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.plannedStartDate ? ' field-error' : ''}`}
                  disabled={submitting || loading || isViewMode}
                />
                {errors.plannedStartDate && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.plannedStartDate}</span>}
              </div>

              <div className="wof-field">
                <label className="wof-label">
                  <FaCalendar className="wof-label-icon" />Planned End Date <span className="wof-required">*</span>
                </label>
                <input
                  type="date"
                  value={plannedEndDate}
                  onChange={(e) => { setPlannedEndDate(e.target.value); setIsDirty(true); }}
                  className={`form-field${errors.plannedEndDate ? ' field-error' : ''}`}
                  disabled={submitting || loading || isViewMode}
                />
                {errors.plannedEndDate && <span className="wof-error-msg"><FaExclamationCircle size={10} />{errors.plannedEndDate}</span>}
              </div>
            </div>

            <div className="wof-field">
              <label className="wof-label">Status</label>
              <div className="wof-status-selector">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`wof-status-btn ${status === s ? 'wof-status-btn-active' : ''}`}
                    onClick={() => handleStatusChange(s)}
                    disabled={submitting || loading || isViewMode}
                  >
                    <span className={`wof-status-dot ${STATUS_CLASS[s]}`} />
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Footer ────────────────────────────────────────────────── */}
          <div className="wof-footer">
            <button
              type="button"
              onClick={() => navigate('/work-order')}
              className="cancel-btn"
              disabled={submitting}
            >
              {isViewMode ? 'Back' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                disabled={submitting}
                className="submit-btn"
              >
                {submitting && <FaSpinner className="spinning" />}
                <FaSave size={12} />
                {isNew ? 'Create' : 'Update'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}