import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft, FaSave, FaSpinner, FaInfoCircle, FaExclamationTriangle,
  FaTimesCircle, FaFileAlt, FaCalculator, FaLock, FaShoppingCart,
  FaIndustry, FaPrint, FaPercentage, FaSitemap, FaWallet, FaExchangeAlt,
  FaMoneyBillWave, FaSyncAlt, FaChartPie, FaBuilding, FaFileInvoiceDollar,
  FaPlus, FaTrash,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddCompanyForm.css";
import { useAdminTheme } from "../admin-theme/AdminThemeContext";

// ─── interfaces ───────────────────────────────────────────────────────────

interface PrintTableRow {
  id: string;
  print_label: string;
  print_value: string;
}

interface CompanyFormData {
  // Tab 0 — Details
  company: string;
  default_letter_head: string;
  abbr: string;
  tax_id: string;
  default_currency: string;
  domain: string;
  country: string;
  date_of_establishment: Date | null;
  default_gst_rate: number;
  parent_company: string;
  is_group: boolean;
  default_holiday_list: string;
  gstin_uin: string;
  gst_category: string;
  pan: string;
  registration_details: string;

  // Tab 1 — Accounts
  create_chart_of_accounts_based_on: string;
  write_off_account: string;
  default_payment_discount_account: string;
  unrealized_profit_loss_account: string;
  default_payment_terms_template: string;
  default_customs_duty_expense_account: string;
  default_finance_book: string;
  default_gst_expense_account: string;
  default_customs_duty_payable_account: string;
  exchange_gain_loss_account: string;
  unrealized_exchange_gain_loss_account: string;
  round_off_account: string;
  round_off_for_opening: string;
  round_off_cost_center: string;
  book_advance_payments_in_separate_party_account: boolean;
  reconciliation_takes_effect_on: string;
  auto_create_exchange_rate_revaluation: boolean;
  frequency: string;
  submit_err_journals: boolean;
  exception_budget_approver_role: string;
  accumulated_depreciation_account: string;
  gain_loss_account_on_asset_disposal: string;
  depreciation_expense_account: string;
  asset_depreciation_cost_center: string;
  series_for_asset_depreciation_entry: string;
  capital_work_in_progress_account: string;
  asset_received_but_not_billed: string;

  // Tab 2 — Accounts Closing
  accounts_frozen_till_date: Date | null;
  roles_allowed_to_edit_frozen_entries: string;

  // Tab 3 — Buying and Selling
  default_buying_terms: string;
  default_selling_terms: string;
  monthly_sales_target: number;
  default_sales_contact: string;
  default_warehouse_for_sales_return: string;
  purchase_expense_account: string;
  purchase_expense_contra_account: string;
  service_expense_account: string;

  // Tab 4 — Stock and Manufacturing
  default_operating_cost_account: string;
  default_work_in_progress_warehouse: string;
  default_finished_goods_warehouse: string;
  default_scrap_warehouse: string;

  // Tab 5 — Print Options
  enable_physical_signature: boolean;
  bank_details: PrintTableRow[];
  registration_details_rows: PrintTableRow[];
}

interface ValidationError {
  field: string;
  label: string;
  message: string;
  tabIndex: number;
}

interface TabWarning {
  [key: number]: boolean;
}

const GST_CATEGORY_OPTIONS = [
  "Unregistered", "Registered Regular", "Registered Composition", "SEZ",
  "Overseas", "Deemed Export", "UIN Holders", "Tax Deductor", "Tax Collector",
];

const CHART_OF_ACCOUNTS_OPTIONS = ["Standard with Numbers", "Standard", "Existing Company"];
const RECONCILIATION_OPTIONS = ["Oldest Of Invoice Or Advance", "Promotional Scheme"];
const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly"];

const emptyPrintRow = (): PrintTableRow => ({
  id: Math.random().toString(36).slice(2),
  print_label: "",
  print_value: "",
});

const defaultFormData = (): CompanyFormData => ({
  company: "",
  default_letter_head: "",
  abbr: "",
  tax_id: "",
  default_currency: "",
  domain: "",
  country: "",
  date_of_establishment: null,
  default_gst_rate: 18,
  parent_company: "",
  is_group: false,
  default_holiday_list: "",
  gstin_uin: "",
  gst_category: "Unregistered",
  pan: "",
  registration_details: "",

  create_chart_of_accounts_based_on: "",
  write_off_account: "",
  default_payment_discount_account: "",
  unrealized_profit_loss_account: "",
  default_payment_terms_template: "",
  default_customs_duty_expense_account: "",
  default_finance_book: "",
  default_gst_expense_account: "",
  default_customs_duty_payable_account: "",
  exchange_gain_loss_account: "",
  unrealized_exchange_gain_loss_account: "",
  round_off_account: "",
  round_off_for_opening: "",
  round_off_cost_center: "",
  book_advance_payments_in_separate_party_account: false,
  reconciliation_takes_effect_on: "Oldest Of Invoice Or Advance",
  auto_create_exchange_rate_revaluation: false,
  frequency: "Daily",
  submit_err_journals: false,
  exception_budget_approver_role: "",
  accumulated_depreciation_account: "",
  gain_loss_account_on_asset_disposal: "",
  depreciation_expense_account: "",
  asset_depreciation_cost_center: "",
  series_for_asset_depreciation_entry: "",
  capital_work_in_progress_account: "",
  asset_received_but_not_billed: "",

  accounts_frozen_till_date: null,
  roles_allowed_to_edit_frozen_entries: "",

  default_buying_terms: "",
  default_selling_terms: "",
  monthly_sales_target: 0,
  default_sales_contact: "",
  default_warehouse_for_sales_return: "",
  purchase_expense_account: "",
  purchase_expense_contra_account: "",
  service_expense_account: "",

  default_operating_cost_account: "",
  default_work_in_progress_warehouse: "",
  default_finished_goods_warehouse: "",
  default_scrap_warehouse: "",

  enable_physical_signature: false,
  bank_details: [],
  registration_details_rows: [],
});

const AddCompanyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useAdminTheme();

  const isEditMode = !!id && id !== "new";

  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [warnings, setWarnings] = useState<TabWarning>({});
  const [saving, setSaving] = useState(false);

  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const [formData, setFormData] = useState<CompanyFormData>(defaultFormData());

  const tabs = [
    { id: 0, name: "Details", icon: <FaFileAlt size={14} /> },
    { id: 1, name: "Accounts", icon: <FaCalculator size={14} /> },
    { id: 2, name: "Accounts Closing", icon: <FaLock size={14} /> },
    { id: 3, name: "Buying and Selling", icon: <FaShoppingCart size={14} /> },
    { id: 4, name: "Stock and Manufacturing", icon: <FaIndustry size={14} /> },
    { id: 5, name: "Print Options", icon: <FaPrint size={14} /> },
  ];

  // ─── load existing company when editing (from navigation state only) ────
  useEffect(() => {
    if (isEditMode) {
      const state = location.state as { company?: any };
      if (state?.company) {
        loadCompanyIntoForm(state.company);
      }
    }
  }, [id]);

  const loadCompanyIntoForm = (c: any) => {
    setFormData((prev) => ({
      ...prev,
      ...c,
      date_of_establishment: c.date_of_establishment ? new Date(c.date_of_establishment) : null,
      accounts_frozen_till_date: c.accounts_frozen_till_date ? new Date(c.accounts_frozen_till_date) : null,
      bank_details: c.bank_details || [],
      registration_details_rows: c.registration_details_rows || [],
    }));
  };

  // ─── validation ────────────────────────────────────────────────────────

  const getValidationErrors = (step: number): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!formData.company.trim()) newErrors.company = "Company is required";
      if (!formData.abbr.trim()) newErrors.abbr = "Abbr is required";
      if (!formData.default_currency.trim()) newErrors.default_currency = "Default Currency is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
      if (!formData.gst_category.trim()) newErrors.gst_category = "GST Category is required";
    }

    return newErrors;
  };

  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    if (!formData.company.trim())
      allErrors.push({ field: "company", label: "Company", message: "Company is required", tabIndex: 0 });
    if (!formData.abbr.trim())
      allErrors.push({ field: "abbr", label: "Abbr", message: "Abbr is required", tabIndex: 0 });
    if (!formData.default_currency.trim())
      allErrors.push({ field: "default_currency", label: "Default Currency", message: "Default Currency is required", tabIndex: 0 });
    if (!formData.country.trim())
      allErrors.push({ field: "country", label: "Country", message: "Country is required", tabIndex: 0 });
    if (!formData.gst_category.trim())
      allErrors.push({ field: "gst_category", label: "GST Category", message: "GST Category is required", tabIndex: 0 });

    return allErrors;
  };

  const getTabErrorCount = (tabId: number): number => {
    return getAllValidationErrors().filter((e) => e.tabIndex === tabId).length;
  };

  const jumpToTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    setShowValidationSummary(false);
    setErrors({});
  };

  const checkTabWarnings = (step: number): boolean => {
    const stepErrors = getValidationErrors(step);
    const hasWarnings = Object.keys(stepErrors).length > 0;
    setWarnings((prev) => ({ ...prev, [step]: hasWarnings }));
    return hasWarnings;
  };

  const getTabStatus = (tabId: number) => {
    return warnings[tabId] ? "warning" : "ok";
  };

  const handleTabChange = (tabId: number) => {
    checkTabWarnings(tabId);
    setActiveTab(tabId);
    setErrors({});
    setShowValidationSummary(false);
  };

  const handleNext = () => {
    const nextTab = activeTab + 1;
    if (nextTab <= 5) {
      checkTabWarnings(nextTab);
      setActiveTab(nextTab);
      setErrors({});
      setShowValidationSummary(false);
    }
  };

  const handlePrevious = () => {
    setActiveTab(activeTab - 1);
    setErrors({});
    setShowValidationSummary(false);
  };

  // ─── field handlers ────────────────────────────────────────────────────

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;
    if (type === "number") {
      processedValue = value === "" ? 0 : parseFloat(value) || 0;
    }
    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    checkTabWarnings(activeTab);
  };

  const handleDateChange = (field: keyof CompanyFormData, date: Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
    checkTabWarnings(activeTab);
  };

  // ─── Bank Details (Tab 5) ─────────────────────────────────────────────

  const addBankRow = () => {
    setFormData((prev) => ({ ...prev, bank_details: [...prev.bank_details, emptyPrintRow()] }));
  };

  const removeBankRow = (rowId: string) => {
    setFormData((prev) => ({ ...prev, bank_details: prev.bank_details.filter((r) => r.id !== rowId) }));
  };

  const updateBankRow = (rowId: string, field: keyof PrintTableRow, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bank_details: prev.bank_details.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    }));
  };

  // ─── Registration Details rows (Tab 5) ────────────────────────────────

  const addRegRow = () => {
    setFormData((prev) => ({ ...prev, registration_details_rows: [...prev.registration_details_rows, emptyPrintRow()] }));
  };

  const removeRegRow = (rowId: string) => {
    setFormData((prev) => ({
      ...prev,
      registration_details_rows: prev.registration_details_rows.filter((r) => r.id !== rowId),
    }));
  };

  const updateRegRow = (rowId: string, field: keyof PrintTableRow, value: string) => {
    setFormData((prev) => ({
      ...prev,
      registration_details_rows: prev.registration_details_rows.map((r) =>
        r.id === rowId ? { ...r, [field]: value } : r
      ),
    }));
  };

  // ─── submit (no API — local only for now) ─────────────────────────────

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allErrors = getAllValidationErrors();
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setShowValidationSummary(true);
      return;
    }

    setSaving(true);
    // No API call yet — this is where the create/update request will go.
    console.log(isEditMode ? "Update company:" : "Create company:", formData);

    setTimeout(() => {
      setSaving(false);
      navigate("/company");
    }, 400);
  };

  const allValidationErrors = getAllValidationErrors();
  const hasAnyErrors = allValidationErrors.length > 0;

  return (
    <div className={`acf-page ${theme}`}>

      {/* Validation Summary Modal */}
      {showValidationSummary && validationErrors.length > 0 && (
        <div className="acf-modal-overlay" onClick={() => setShowValidationSummary(false)}>
          <div className="acf-validation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acf-modal-header acf-modal-header-warning">
              <h2 className="acf-modal-title-warning">
                <FaExclamationTriangle /> Missing Required Fields
              </h2>
              <button className="acf-modal-close" onClick={() => setShowValidationSummary(false)}>×</button>
            </div>
            <div className="acf-modal-body">
              <p className="acf-modal-intro">
                Please fill in the following required fields before submitting:
              </p>
              <div className="acf-error-list">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="acf-validation-error-item" onClick={() => jumpToTab(error.tabIndex)}>
                    <div className="acf-error-header">
                      <FaTimesCircle className="acf-error-icon" />
                      <strong className="acf-error-label">{error.label}</strong>
                      <span className="acf-error-tab">
                        Tab {error.tabIndex + 1}: {tabs[error.tabIndex].name}
                      </span>
                    </div>
                    <div className="acf-error-message">{error.message}</div>
                  </div>
                ))}
              </div>
              <div className="acf-hint-banner">
                <FaInfoCircle className="acf-hint-icon" />
                Click on any error to jump to that section
              </div>
            </div>
            <div className="acf-modal-footer">
              <button className="acf-btn-cancel" onClick={() => setShowValidationSummary(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="acf-header-wrap">
        <div className="acf-header-row">
          <button type="button" onClick={() => navigate("/company")} className="acf-back-btn">
            <FaArrowLeft size={12} /> Back
          </button>
          <h1 className="acf-title">
            {isEditMode ? "Edit Company" : "New Company"}
          </h1>

          {hasAnyErrors && (
            <div className="acf-error-pill">
              <FaExclamationTriangle size={11} />
              {allValidationErrors.length} missing field(s)
            </div>
          )}
        </div>
      </div>

      <div className="acf-container">
        <form onSubmit={handleSubmit}>

          {/* Tabs */}
          <div className="acf-tabs-wrap">
            <div className="acf-tabs-row">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const tabStatus = getTabStatus(tab.id);
                const errorCount = getTabErrorCount(tab.id);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`acf-tab-btn ${isActive ? "acf-tab-btn-active" : ""}`}
                  >
                    <div
                      className={`acf-tab-circle ${isActive ? "acf-tab-circle-active" : ""} ${
                        tabStatus === "warning" && !isActive ? "acf-tab-circle-warning" : ""
                      }`}
                    >
                      {tabStatus === "warning" && !isActive ? <FaExclamationTriangle size={14} /> : tab.id + 1}

                      {errorCount > 0 && !isActive && (
                        <div className="acf-tab-error-badge">{errorCount}</div>
                      )}
                    </div>

                    <div className="acf-tab-label-wrap">
                      <div className={`acf-tab-step ${isActive ? "acf-tab-step-active" : ""} ${
                        tabStatus === "warning" && !isActive ? "acf-tab-step-warning" : ""
                      }`}>
                        Step {tab.id + 1}
                      </div>
                      <div className={`acf-tab-name ${isActive ? "acf-tab-name-active" : ""}`}>
                        {tab.name}
                      </div>
                    </div>

                    {isActive && <div className="acf-tab-underline" />}
                  </button>
                );
              })}
            </div>
          </div>

          {warnings[activeTab] && (
            <div className="acf-tab-warning-banner">
              <FaExclamationTriangle size={12} />
              <span>This tab has incomplete or missing information. You can proceed but please review before submitting.</span>
            </div>
          )}

          <div>

            {/* Tab 0 — Details */}
            {activeTab === 0 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Company *</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Industries"
                        className={`acf-input ${errors.company ? "acf-input-error" : ""}`}
                      />
                      {errors.company && <span className="acf-error-text">{errors.company}</span>}
                    </div>
                    <div>
                      <label className="acf-label">Default Letter Head</label>
                      <input
                        type="text"
                        name="default_letter_head"
                        value={formData.default_letter_head}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                  </div>

                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Abbr *</label>
                      <input
                        type="text"
                        name="abbr"
                        value={formData.abbr}
                        onChange={handleInputChange}
                        placeholder="e.g. ACME"
                        className={`acf-input ${errors.abbr ? "acf-input-error" : ""}`}
                      />
                      {errors.abbr && <span className="acf-error-text">{errors.abbr}</span>}
                    </div>
                    <div>
                      <label className="acf-label">Tax ID</label>
                      <input
                        type="text"
                        name="tax_id"
                        value={formData.tax_id}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                  </div>

                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default Currency *</label>
                      <input
                        type="text"
                        name="default_currency"
                        value={formData.default_currency}
                        onChange={handleInputChange}
                        placeholder="e.g. INR"
                        className={`acf-input ${errors.default_currency ? "acf-input-error" : ""}`}
                      />
                      {errors.default_currency && <span className="acf-error-text">{errors.default_currency}</span>}
                    </div>
                    <div>
                      <label className="acf-label">Domain</label>
                      <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                  </div>

                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="e.g. India"
                        className={`acf-input ${errors.country ? "acf-input-error" : ""}`}
                      />
                      {errors.country && <span className="acf-error-text">{errors.country}</span>}
                    </div>
                    <div>
                      <label className="acf-label">Date of Establishment</label>
                      <DatePicker
                        selected={formData.date_of_establishment}
                        onChange={(date: Date | null) => handleDateChange("date_of_establishment", date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select date"
                        className="acf-date-input"
                      />
                    </div>
                  </div>

                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default GST Rate</label>
                      <input
                        type="number"
                        name="default_gst_rate"
                        value={formData.default_gst_rate || ""}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="acf-input"
                      />
                      <span className="acf-field-note">
                        Sales / Purchase Taxes and Charges Template will be created based on this GST Rate.
                      </span>
                    </div>
                    <div>
                      <label className="acf-label">Parent Company</label>
                      <input
                        type="text"
                        name="parent_company"
                        value={formData.parent_company}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                  </div>

                  <div className="acf-field-block">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="is_group"
                        checked={formData.is_group}
                        onChange={handleInputChange}
                        className="acf-checkbox"
                      />
                      Is Group
                    </label>
                  </div>

                  <div className="acf-field-block acf-mb-20">
                    <label className="acf-label">Default Holiday List</label>
                    <input
                      type="text"
                      name="default_holiday_list"
                      value={formData.default_holiday_list}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="acf-input"
                    />
                  </div>

                  <div className="acf-section-title acf-section-title-first"><FaPercentage size={12} /> Tax Details</div>

                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">GSTIN / UIN</label>
                      <input
                        type="text"
                        name="gstin_uin"
                        value={formData.gstin_uin}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                    <div>
                      <label className="acf-label">GST Category *</label>
                      <select
                        name="gst_category"
                        value={formData.gst_category}
                        onChange={handleInputChange}
                        className={`acf-input ${errors.gst_category ? "acf-input-error" : ""}`}
                      >
                        {GST_CATEGORY_OPTIONS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {errors.gst_category && <span className="acf-error-text">{errors.gst_category}</span>}
                    </div>
                  </div>

                  <div className="acf-field-block acf-mb-20">
                    <label className="acf-label">PAN</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="acf-input"
                    />
                  </div>

                  <div className="acf-section-title"><FaFileAlt size={12} /> Registration Details</div>
                  <div className="acf-field-block">
                    <textarea
                      name="registration_details"
                      value={formData.registration_details}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Company registration numbers for your reference. Tax numbers etc."
                      className="acf-input acf-textarea"
                    />
                    <span className="acf-field-note">
                      Company registration numbers for your reference. Tax numbers etc.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1 — Accounts */}
            {activeTab === 1 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-section-title acf-section-title-first"><FaSitemap size={12} /> Chart of Accounts</div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Create Chart Of Accounts Based On</label>
                      <select
                        name="create_chart_of_accounts_based_on"
                        value={formData.create_chart_of_accounts_based_on}
                        onChange={handleInputChange}
                        className="acf-input"
                      >
                        <option value="">Select...</option>
                        {CHART_OF_ACCOUNTS_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="acf-section-title"><FaWallet size={12} /> Default Accounts</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Write Off Account</label>
                      <input type="text" name="write_off_account" value={formData.write_off_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Payment Discount Account</label>
                      <input type="text" name="default_payment_discount_account" value={formData.default_payment_discount_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Unrealized Profit / Loss Account</label>
                      <input type="text" name="unrealized_profit_loss_account" value={formData.unrealized_profit_loss_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Payment Terms Template</label>
                      <input type="text" name="default_payment_terms_template" value={formData.default_payment_terms_template} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default Customs Duty Expense Account</label>
                      <input type="text" name="default_customs_duty_expense_account" value={formData.default_customs_duty_expense_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Finance Book</label>
                      <input type="text" name="default_finance_book" value={formData.default_finance_book} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Default GST Expense Account</label>
                      <input type="text" name="default_gst_expense_account" value={formData.default_gst_expense_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Customs Duty Payable Account</label>
                      <input type="text" name="default_customs_duty_payable_account" value={formData.default_customs_duty_payable_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>

                  <div className="acf-section-title"><FaExchangeAlt size={12} /> Exchange Gain / Loss</div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Exchange Gain / Loss Account</label>
                      <input type="text" name="exchange_gain_loss_account" value={formData.exchange_gain_loss_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Unrealized Exchange Gain/Loss Account</label>
                      <input type="text" name="unrealized_exchange_gain_loss_account" value={formData.unrealized_exchange_gain_loss_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>

                  <div className="acf-section-title"><FaCalculator size={12} /> Round Off</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Round Off Account</label>
                      <input type="text" name="round_off_account" value={formData.round_off_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Round Off for Opening</label>
                      <input type="text" name="round_off_for_opening" value={formData.round_off_for_opening} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Round Off Cost Center</label>
                      <input type="text" name="round_off_cost_center" value={formData.round_off_cost_center} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>

                  <div className="acf-section-title"><FaMoneyBillWave size={12} /> Advance Payments</div>
                  <div className="acf-field-block">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="book_advance_payments_in_separate_party_account"
                        checked={formData.book_advance_payments_in_separate_party_account}
                        onChange={handleInputChange}
                        className="acf-checkbox"
                      />
                      Book Advance Payments in Separate Party Account
                    </label>
                    <span className="acf-field-note">
                      Enabling this records advances received in a Liability Account and advances paid in an Asset Account, instead of the usual Asset/Liability account.
                    </span>
                  </div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Reconciliation Takes Effect On</label>
                      <select
                        name="reconciliation_takes_effect_on"
                        value={formData.reconciliation_takes_effect_on}
                        onChange={handleInputChange}
                        className="acf-input"
                      >
                        {RECONCILIATION_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="acf-section-title"><FaSyncAlt size={12} /> Exchange Rate Revaluation Settings</div>
                  <div className="acf-field-block">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="auto_create_exchange_rate_revaluation"
                        checked={formData.auto_create_exchange_rate_revaluation}
                        onChange={handleInputChange}
                        className="acf-checkbox"
                      />
                      Auto Create Exchange Rate Revaluation
                    </label>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Frequency</label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        className="acf-input"
                      >
                        {FREQUENCY_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="acf-field-block acf-mb-20">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="submit_err_journals"
                        checked={formData.submit_err_journals}
                        onChange={handleInputChange}
                        className="acf-checkbox"
                      />
                      Submit ERR Journals?
                    </label>
                    <span className="acf-field-note">
                      Upon enabling this, the JV will be submitted for a different exchange rate.
                    </span>
                  </div>

                  <div className="acf-section-title"><FaChartPie size={12} /> Budget Detail</div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Exception Budget Approver Role</label>
                      <input type="text" name="exception_budget_approver_role" value={formData.exception_budget_approver_role} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>

                  <div className="acf-section-title"><FaBuilding size={12} /> Fixed Asset Defaults</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Accumulated Depreciation Account</label>
                      <input type="text" name="accumulated_depreciation_account" value={formData.accumulated_depreciation_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Gain/Loss Account on Asset Disposal</label>
                      <input type="text" name="gain_loss_account_on_asset_disposal" value={formData.gain_loss_account_on_asset_disposal} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Depreciation Expense Account</label>
                      <input type="text" name="depreciation_expense_account" value={formData.depreciation_expense_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Asset Depreciation Cost Center</label>
                      <input type="text" name="asset_depreciation_cost_center" value={formData.asset_depreciation_cost_center} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Series for Asset Depreciation Entry (Journal Entry)</label>
                      <input type="text" name="series_for_asset_depreciation_entry" value={formData.series_for_asset_depreciation_entry} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Capital Work In Progress Account</label>
                      <input type="text" name="capital_work_in_progress_account" value={formData.capital_work_in_progress_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Asset Received But Not Billed</label>
                      <input type="text" name="asset_received_but_not_billed" value={formData.asset_received_but_not_billed} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 — Accounts Closing */}
            {activeTab === 2 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Accounts Frozen Till Date</label>
                      <DatePicker
                        selected={formData.accounts_frozen_till_date}
                        onChange={(date: Date | null) => handleDateChange("accounts_frozen_till_date", date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select date"
                        className="acf-date-input"
                      />
                      <span className="acf-field-note">
                        Accounting entries are frozen up to this date. Only users with the specified role can create or modify entries before this date.
                      </span>
                    </div>
                    <div>
                      <label className="acf-label">Roles Allowed to Set and Edit Frozen Account Entries</label>
                      <input
                        type="text"
                        name="roles_allowed_to_edit_frozen_entries"
                        value={formData.roles_allowed_to_edit_frozen_entries}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        className="acf-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3 — Buying and Selling */}
            {activeTab === 3 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-section-title acf-section-title-first"><FaShoppingCart size={12} /> Buying &amp; Selling Settings</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default Buying Terms</label>
                      <input type="text" name="default_buying_terms" value={formData.default_buying_terms} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Selling Terms</label>
                      <input type="text" name="default_selling_terms" value={formData.default_selling_terms} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Monthly Sales Target</label>
                      <input type="number" name="monthly_sales_target" value={formData.monthly_sales_target || ""} onChange={handleInputChange} placeholder="0" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Sales Contact</label>
                      <input type="text" name="default_sales_contact" value={formData.default_sales_contact} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2 acf-mb-20">
                    <div>
                      <label className="acf-label">Default Warehouse for Sales Return</label>
                      <input type="text" name="default_warehouse_for_sales_return" value={formData.default_warehouse_for_sales_return} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>

                  <div className="acf-section-title"><FaFileInvoiceDollar size={12} /> Purchase Expense</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Purchase Expense Account</label>
                      <input type="text" name="purchase_expense_account" value={formData.purchase_expense_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Purchase Expense Contra Account</label>
                      <input type="text" name="purchase_expense_contra_account" value={formData.purchase_expense_contra_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Service Expense Account</label>
                      <input type="text" name="service_expense_account" value={formData.service_expense_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                      <span className="acf-field-note">For service item</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4 — Stock and Manufacturing */}
            {activeTab === 4 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-section-title acf-section-title-first"><FaIndustry size={12} /> Manufacturing</div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default Operating Cost Account</label>
                      <input type="text" name="default_operating_cost_account" value={formData.default_operating_cost_account} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Work In Progress Warehouse</label>
                      <input type="text" name="default_work_in_progress_warehouse" value={formData.default_work_in_progress_warehouse} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                  <div className="acf-grid-2">
                    <div>
                      <label className="acf-label">Default Finished Goods Warehouse</label>
                      <input type="text" name="default_finished_goods_warehouse" value={formData.default_finished_goods_warehouse} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                    <div>
                      <label className="acf-label">Default Scrap Warehouse</label>
                      <input type="text" name="default_scrap_warehouse" value={formData.default_scrap_warehouse} onChange={handleInputChange} placeholder="Optional" className="acf-input" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5 — Print Options */}
            {activeTab === 5 && (
              <div className="acf-fade-in">
                <div className="acf-card">
                  <div className="acf-field-block acf-mb-20">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="enable_physical_signature"
                        checked={formData.enable_physical_signature}
                        onChange={handleInputChange}
                        className="acf-checkbox"
                      />
                      Enable Physical Signature
                    </label>
                  </div>

                  <div className="acf-section-title acf-section-title-first"><FaFileInvoiceDollar size={12} /> Bank Details</div>
                  <div className="acf-table-wrap">
                    <table className="acf-table">
                      <colgroup>
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "12%" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Print Label</th>
                          <th>Print Value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.bank_details.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="acf-table-empty">No rows</td>
                          </tr>
                        ) : (
                          formData.bank_details.map((row, i) => (
                            <tr key={row.id}>
                              <td className="acf-cell-center">{i + 1}</td>
                              <td>
                                <input
                                  type="text"
                                  value={row.print_label}
                                  onChange={(e) => updateBankRow(row.id, "print_label", e.target.value)}
                                  placeholder="Print label"
                                  className="acf-cell-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={row.print_value}
                                  onChange={(e) => updateBankRow(row.id, "print_value", e.target.value)}
                                  placeholder="Print value"
                                  className="acf-cell-input"
                                />
                              </td>
                              <td className="acf-cell-center">
                                <button type="button" onClick={() => removeBankRow(row.id)} className="acf-row-remove">
                                  <FaTrash size={11} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={addBankRow} className="acf-add-row-btn">
                    <FaPlus size={10} /> Add Row
                  </button>

                  <div className="acf-section-title acf-mt-20"><FaFileAlt size={12} /> Registration Details</div>
                  <div className="acf-table-wrap">
                    <table className="acf-table">
                      <colgroup>
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "12%" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Print Label</th>
                          <th>Print Value</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.registration_details_rows.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="acf-table-empty">No rows</td>
                          </tr>
                        ) : (
                          formData.registration_details_rows.map((row, i) => (
                            <tr key={row.id}>
                              <td className="acf-cell-center">{i + 1}</td>
                              <td>
                                <input
                                  type="text"
                                  value={row.print_label}
                                  onChange={(e) => updateRegRow(row.id, "print_label", e.target.value)}
                                  placeholder="Print label"
                                  className="acf-cell-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={row.print_value}
                                  onChange={(e) => updateRegRow(row.id, "print_value", e.target.value)}
                                  placeholder="Print value"
                                  className="acf-cell-input"
                                />
                              </td>
                              <td className="acf-cell-center">
                                <button type="button" onClick={() => removeRegRow(row.id)} className="acf-row-remove">
                                  <FaTrash size={11} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={addRegRow} className="acf-add-row-btn">
                    <FaPlus size={10} /> Add Row
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="acf-footer-row">
            {activeTab > 0 && (
              <button type="button" onClick={handlePrevious} className="acf-btn-secondary">
                ← Previous
              </button>
            )}
            {activeTab < 5 && (
              <button type="button" onClick={handleNext} className="acf-btn-primary">
                Next →
              </button>
            )}
            {activeTab === 5 && (
              <button type="submit" disabled={saving} className="acf-btn-primary acf-btn-submit" style={{ opacity: saving ? 0.6 : 1 }}>
                {saving && <FaSpinner className="acf-spinning" />}
                <FaSave /> {isEditMode ? "Update Company" : "Create Company"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyForm;