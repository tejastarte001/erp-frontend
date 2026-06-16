import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ChevronDown,
  X,
  Plus,
  Download,
  Upload,
  Pencil,
  ScanBarcode,
  ClipboardList,
  Warehouse,
  Info,
  Printer,
} from "lucide-react";
import "./StockEntryForm.css";

interface ItemRow {
  id: number;
  sourceWarehouse: string;
  itemCode: string;
  qty: string;
  basicRate: string;
  itemTaxTemplate: string;
}

const today = new Date();
const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
const timeStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`;

const STOCK_ENTRY_TYPES = [
  "Disassemble", "Manufacture", "Material Consumption for Manufacture",
  "Material Issue", "Material Receipt", "Material Transfer",
  "Material Transfer for Manufacture", "Receive from Customer",
  "Repack", "Send to Subcontractor",
];

const WAREHOUSES = [
  "Finished Goods - T", "Goods In Transit - T", "Stores - T", "Work In Progress - T",
];

const LETTER_HEADS = ["Company Letterhead - Grey", "Company Letterhead - Blue"];

/* Collapsible card section */
interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  iconClass?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CardSection: React.FC<CardSectionProps> = ({
  title, icon, iconClass = "sef-card-icon--indigo", children, defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sef-section">
      <div className="sef-section-header" onClick={() => setOpen((o) => !o)}>
        <span className={`sef-card-icon ${iconClass}`}>{icon}</span>
        <span className="sef-section-title">{title}</span>
        <ChevronDown size={15} className={`sef-section-chev ${open ? "sef-section-chev--open" : ""}`} />
      </div>
      {open && <div className="sef-section-body">{children}</div>}
    </div>
  );
};

const StockentryForm: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"details" | "other">("details");
  const [series, setSeries] = useState("MAT-STE-");
  const [editPostingDate, setEditPostingDate] = useState(false);
  const [stockEntryType, setStockEntryType] = useState("");
  const [postingDate] = useState(dateStr);
  const [postingTime] = useState(timeStr);
  const [scanBarcode, setScanBarcode] = useState("");
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [targetWarehouse, setTargetWarehouse] = useState("");
  const [items, setItems] = useState<ItemRow[]>([
    { id: 1, sourceWarehouse: "", itemCode: "", qty: "0.000", basicRate: "0.00", itemTaxTemplate: "" },
  ]);
  const [printHeading, setPrintHeading] = useState("");
  const [letterHead, setLetterHead] = useState("Company Letterhead - Grey");
  const [isOpening, setIsOpening] = useState("No");
  const [remarks, setRemarks] = useState("");

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, sourceWarehouse: "", itemCode: "", qty: "0.000", basicRate: "0.00", itemTaxTemplate: "" },
    ]);
  };

  const updateItem = (idx: number, field: keyof ItemRow, value: string) => {
    setItems((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const goBack = () => navigate("/stock-entry");

  return (
    <div className="sef-shell">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sef-topbar">
        <div className="sef-topbar__left">
          <div className="sef-breadcrumb">
            <button className="sef-breadcrumb__home" title="Home" onClick={() => navigate("/dashboard")}>
              <Home size={14} />
            </button>
            <span className="sef-breadcrumb__sep">/</span>
            <span className="sef-breadcrumb__crumb">Stock</span>
            <span className="sef-breadcrumb__sep">/</span>
            <span className="sef-breadcrumb__crumb sef-breadcrumb__crumb--link" onClick={goBack}>
              Stock Entry
            </span>
            <span className="sef-breadcrumb__sep">/</span>
            <span className="sef-breadcrumb__crumb sef-breadcrumb__crumb--active">New Stock Entry</span>
          </div>
          <span className="sef-badge">Not Saved</span>
        </div>

        <div className="sef-topbar__right">
          <button className="sef-btn sef-btn--outline">
            Create <ChevronDown size={13} />
          </button>
          <button className="sef-btn sef-btn--outline">
            Get Items From <ChevronDown size={13} />
          </button>
          <button className="sef-btn sef-btn--primary">Save</button>
          <button className="sef-btn sef-btn--ghost" onClick={goBack} title="Close">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────── */}
      <div className="sef-tabs">
        <button
          className={`sef-tab ${activeTab === "details" ? "sef-tab--active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`sef-tab ${activeTab === "other" ? "sef-tab--active" : ""}`}
          onClick={() => setActiveTab("other")}
        >
          Other Info
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      {activeTab === "details" ? (
        <div className="sef-body">

          {/* Entry basics */}
          <div className="sef-main-card">
            <div className="sef-form-grid">
              {/* Series */}
              <div className="sef-field">
                <label className="sef-label">Series <span className="sef-label__req">*</span></label>
                <div className="sef-select-wrap">
                  <select className="sef-select" value={series} onChange={(e) => setSeries(e.target.value)}>
                    <option value="MAT-STE-">MAT-STE-</option>
                    <option value="STE-">STE-</option>
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>

              {/* Edit posting date toggle */}
              <div className="sef-field" style={{ justifyContent: "flex-end" }}>
                <div className="sef-checkbox-row">
                  <input
                    type="checkbox"
                    id="editPostingDate"
                    className="sef-checkbox"
                    checked={editPostingDate}
                    onChange={(e) => setEditPostingDate(e.target.checked)}
                  />
                  <label htmlFor="editPostingDate" className="sef-checkbox-label">
                    Edit Posting Date and Time
                  </label>
                </div>
              </div>

              {/* Stock Entry Type */}
              <div className="sef-field">
                <label className="sef-label">Stock Entry Type <span className="sef-label__req">*</span></label>
                <div className="sef-select-wrap">
                  <select
                    className="sef-select"
                    value={stockEntryType}
                    onChange={(e) => setStockEntryType(e.target.value)}
                  >
                    <option value="">Select type…</option>
                    {STOCK_ENTRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>

              {/* Posting Date */}
              <div className="sef-field">
                <label className="sef-label">Posting Date</label>
                <input
                  className={`sef-input ${!editPostingDate ? "sef-input--disabled" : ""}`}
                  value={postingDate}
                  readOnly={!editPostingDate}
                  onChange={() => {}}
                />
              </div>

              {/* Spacer */}
              <div />

              {/* Posting Time */}
              <div className="sef-field">
                <label className="sef-label">Posting Time</label>
                <input
                  className={`sef-input ${!editPostingDate ? "sef-input--disabled" : ""}`}
                  value={postingTime}
                  readOnly={!editPostingDate}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          {/* BOM Info */}
          <CardSection
            title="BOM Info"
            icon={<ClipboardList size={15} />}
            iconClass="sef-card-icon--amber"
            defaultOpen={false}
          >
            <div className="sef-form-grid">
              <div className="sef-field">
                <label className="sef-label">BOM No</label>
                <input className="sef-input" placeholder="Select BOM…" />
              </div>
              <div className="sef-field">
                <label className="sef-label">Quantity</label>
                <input className="sef-input" type="number" defaultValue={1} />
              </div>
            </div>
          </CardSection>

          {/* Default Warehouse */}
          <CardSection
            title="Default Warehouse"
            icon={<Warehouse size={15} />}
            iconClass="sef-card-icon--teal"
            defaultOpen={false}
          >
            <div className="sef-form-grid">
              <div className="sef-field">
                <label className="sef-label">Default Source Warehouse</label>
                <div className="sef-select-wrap">
                  <select
                    className="sef-select"
                    value={sourceWarehouse}
                    onChange={(e) => setSourceWarehouse(e.target.value)}
                  >
                    <option value="">Select warehouse…</option>
                    {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>
              <div className="sef-field">
                <label className="sef-label">Default Target Warehouse</label>
                <div className="sef-select-wrap">
                  <select
                    className="sef-select"
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                  >
                    <option value="">Select warehouse…</option>
                    {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>
            </div>
          </CardSection>

          {/* Barcode */}
          <div className="sef-main-card">
            <div className="sef-form-grid">
              <div className="sef-field">
                <label className="sef-label">Scan Barcode</label>
                <div className="sef-barcode-wrap">
                  <input
                    className="sef-input"
                    placeholder="Scan or enter barcode…"
                    value={scanBarcode}
                    onChange={(e) => setScanBarcode(e.target.value)}
                  />
                  <ScanBarcode size={16} className="sef-barcode-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="sef-items-section">
            <div className="sef-items-header">
              <span className="sef-card-icon sef-card-icon--indigo">
                <ClipboardList size={15} />
              </span>
              <span className="sef-items-title">Items</span>
              <span className="sef-items-count">{items.length}</span>
            </div>

            <div className="sef-table-wrap">
              <table className="sef-table">
                <thead>
                  <tr>
                    <th className="sef-table__check"><input type="checkbox" /></th>
                    <th className="sef-table__no">No.</th>
                    <th>Source Warehouse</th>
                    <th>Item Code <span style={{ color: "var(--c-red)" }}>*</span></th>
                    <th style={{ textAlign: "right" }}>Qty <span style={{ color: "var(--c-red)" }}>*</span></th>
                    <th style={{ textAlign: "right" }}>Basic Rate (as per valuation)</th>
                    <th>Item Tax Template</th>
                    <th className="sef-table__actions" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="sef-table__check"><input type="checkbox" /></td>
                      <td className="sef-table__no">{idx + 1}</td>
                      <td>
                        <div className="sef-select-wrap">
                          <select
                            className="sef-cell-input"
                            value={row.sourceWarehouse}
                            onChange={(e) => updateItem(idx, "sourceWarehouse", e.target.value)}
                          >
                            <option value="" />
                            {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
                          </select>
                        </div>
                      </td>
                      <td>
                        <input
                          className="sef-cell-input"
                          value={row.itemCode}
                          onChange={(e) => updateItem(idx, "itemCode", e.target.value)}
                          placeholder="Item code…"
                        />
                      </td>
                      <td>
                        <input
                          className="sef-cell-input sef-cell-input--num"
                          value={row.qty}
                          onChange={(e) => updateItem(idx, "qty", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="sef-cell-input sef-cell-input--num sef-cell-input--readonly"
                          value={`₹ ${row.basicRate}`}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="sef-cell-input"
                          value={row.itemTaxTemplate}
                          onChange={(e) => updateItem(idx, "itemTaxTemplate", e.target.value)}
                          placeholder="Template…"
                        />
                      </td>
                      <td className="sef-table__actions">
                        <button className="sef-row-edit" title="Edit row">
                          <Pencil size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="sef-table-footer">
                <div className="sef-table-footer__left">
                  <button className="sef-link-btn" onClick={addRow}>
                    <Plus size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                    Add row
                  </button>
                  <button className="sef-link-btn sef-link-btn--muted">Add multiple</button>
                </div>
                <div className="sef-table-footer__right">
                  <button className="sef-update-btn">
                    <Download size={12} /> Download
                  </button>
                  <button className="sef-update-btn">
                    <Upload size={12} /> Upload
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--c-border)" }}>
              <button className="sef-update-btn">Update Rate and Availability</button>
            </div>
          </div>

        </div>
      ) : (
        <div className="sef-body">

          <CardSection
            title="Printing Settings"
            icon={<Printer size={15} />}
            iconClass="sef-card-icon--slate"
          >
            <div className="sef-form-grid">
              <div className="sef-field">
                <label className="sef-label">Print Heading</label>
                <input
                  className="sef-input"
                  value={printHeading}
                  onChange={(e) => setPrintHeading(e.target.value)}
                  placeholder="Enter heading…"
                />
              </div>
              <div className="sef-field">
                <label className="sef-label">Letter Head</label>
                <div className="sef-select-wrap">
                  <select
                    className="sef-select"
                    value={letterHead}
                    onChange={(e) => setLetterHead(e.target.value)}
                  >
                    {LETTER_HEADS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>
            </div>
          </CardSection>

          <CardSection
            title="More Information"
            icon={<Info size={15} />}
            iconClass="sef-card-icon--teal"
          >
            <div className="sef-form-grid">
              <div className="sef-field">
                <label className="sef-label">Is Opening</label>
                <div className="sef-select-wrap">
                  <select
                    className="sef-select"
                    value={isOpening}
                    onChange={(e) => setIsOpening(e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  <ChevronDown size={14} className="sef-select-wrap__arrow" />
                </div>
              </div>
              <div className="sef-field sef-field--full">
                <label className="sef-label">Remarks</label>
                <textarea
                  className="sef-textarea"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any notes or remarks…"
                />
              </div>
            </div>
          </CardSection>

        </div>
      )}
    </div>
  );
};

export default StockentryForm;