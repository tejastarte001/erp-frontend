import React, { useState } from "react";
import {
  Home,
  ChevronDown,
  ChevronRight,
  X,
  Pencil,
  Settings,
  Copy,
  Trash2,
  AlertTriangle,
  Package,
  Wrench,
  Info,
  XCircle,
  InfoIcon,
  Save,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComponentRow {
  id: number;
  itemCode: string;
  qty: string;
  uom: string;
  rate: string;
  amount: string;
}

interface SecondaryRow {
  id: number;
  type: string;
  itemCode: string;
  itemName: string;
  uom: string;
  qty: string;
}

interface ValidationError {
  field: string;
  label: string;
  message: string;
  tabId: TabId;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEM_SUGGESTIONS = [
  { code: "23",    sub: "23, Consumable" },
  { code: "354",   sub: "354, Consumable" },
  { code: "45",    sub: "chair, Consumable" },
  { code: "50",    sub: "Door1, Products" },
  { code: "chair", sub: "chair, Products" },
];

const TYPE_OPTIONS = ["By-Product", "Scrap"];

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const Label: React.FC<{ text: string; required?: boolean; info?: boolean }> = ({ text, required, info }) => (
  <span className="nbom-label">
    {text}
    {required && <span className="nbom-label__req">*</span>}
    {info    && <span className="nbom-label__info">?</span>}
  </span>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { readOnly?: boolean }> = ({
  readOnly, className = "", ...props
}) => (
  <input
    className={`nbom-input ${readOnly ? "nbom-input--readonly" : ""} ${className}`}
    readOnly={readOnly}
    {...props}
  />
);

const Checkbox: React.FC<{ label: string; hint?: string; checked?: boolean; onChange?: () => void }> = ({
  label, hint, checked = false, onChange,
}) => (
  <div className="nbom-check-row">
    <input type="checkbox" checked={checked} onChange={onChange ?? (() => {})} />
    <div>
      <div className="nbom-check-row__label">{label}</div>
      {hint && <div className="nbom-check-row__hint">{hint}</div>}
    </div>
  </div>
);

// ─── BOM Configuration Tab ────────────────────────────────────────────────────

const BOMConfigTab: React.FC = () => {
  const [isActive,            setIsActive]            = useState(true);
  const [isDefault,           setIsDefault]           = useState(true);
  const [setRateSubAssembly,  setSetRateSubAssembly]  = useState(true);
  const [isPhantomBOM,        setIsPhantomBOM]        = useState(false);
  const [allowAltItem,        setAllowAltItem]        = useState(false);
  const [qiRequired,          setQiRequired]          = useState(false);
  const [basedOn,             setBasedOn]             = useState("");

  return (
    <div className="nbom-tab-content">
      <div className="nbom-config-checks-grid">
        <div className="nbom-config-checks-col">
          <Checkbox label="Is Active"   checked={isActive}   onChange={() => setIsActive(v => !v)} />
          <Checkbox label="Is Default"  checked={isDefault}  onChange={() => setIsDefault(v => !v)} />
          <Checkbox
            label="Set rate of sub-assembly item based on BOM"
            checked={setRateSubAssembly}
            onChange={() => setSetRateSubAssembly(v => !v)}
          />
        </div>
        <div className="nbom-config-checks-col">
          <Checkbox label="Is Phantom BOM"         checked={isPhantomBOM} onChange={() => setIsPhantomBOM(v => !v)} />
          <Checkbox label="Allow Alternative Item"  checked={allowAltItem} onChange={() => setAllowAltItem(v => !v)} />
        </div>
      </div>

      <div className="nbom-config-section">
        <div className="nbom-config-section__title">Quality Inspection</div>
        <Checkbox label="Quality Inspection Required" checked={qiRequired} onChange={() => setQiRequired(v => !v)} />
      </div>

      <div className="nbom-config-section">
        <div className="nbom-config-section__title">Default Warehouse</div>
        <div className="nbom-form-grid">
          <div className="nbom-field"><Label text="Default Source Warehouse" /><Input readOnly value="" /></div>
          <div className="nbom-field"><Label text="Default Target Warehouse" /><Input readOnly value="" /></div>
        </div>
      </div>

      <div className="nbom-config-section">
        <div className="nbom-config-section__title">Consume Components</div>
        <div style={{ maxWidth: 400 }}>
          <div className="nbom-field">
            <Label text="Based On" info />
            <select className="nbom-input" value={basedOn} onChange={e => setBasedOn(e.target.value)}>
              <option value=""></option>
              <option value="BOM">BOM</option>
              <option value="Sales Order">Sales Order</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── More Info Tab ────────────────────────────────────────────────────────────

const MoreInfoTab: React.FC = () => {
  const [costConfigOpen, setCostConfigOpen] = useState(true);
  const [rateBasedOn, setRateBasedOn]       = useState("Valuation Rate");
  const [project, setProject]               = useState("");

  return (
    <div className="nbom-tab-content">
      <div className="nbom-card" style={{ marginBottom: 0 }}>
        <div
          className="nbom-config-section__title nbom-config-section__title--collapsible"
          onClick={() => setCostConfigOpen(o => !o)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderBottom: costConfigOpen ? "1px solid var(--c-border)" : "none" }}
        >
          Cost Configuration
          <ChevronDown size={14} style={{ transform: costConfigOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--c-text-muted)" }} />
        </div>
        {costConfigOpen && (
          <div className="nbom-card__body">
            <div className="nbom-form-grid">
              <div className="nbom-field">
                <Label text="Rate Of Materials Based On" />
                <select className="nbom-input" value={rateBasedOn} onChange={e => setRateBasedOn(e.target.value)}>
                  <option value="Valuation Rate">Valuation Rate</option>
                  <option value="Last Purchase Rate">Last Purchase Rate</option>
                  <option value="Price List">Price List</option>
                </select>
              </div>
              <div>
                <div className="nbom-field"><Label text="Currency" required /><Input readOnly value="INR" /></div>
                <div className="nbom-field" style={{ marginTop: 12 }}><Label text="Conversion Rate" required /><Input readOnly value="1.000000000" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "16px 0", maxWidth: 400 }}>
        <div className="nbom-field">
          <Label text="Project" />
          <Input value={project} onChange={e => setProject(e.target.value)} placeholder="" />
        </div>
      </div>
    </div>
  );
};

// ─── Component edit popup ─────────────────────────────────────────────────────

interface ComponentPopupProps {
  row: ComponentRow; rowIndex: number;
  onClose: () => void; onSave: (u: ComponentRow) => void;
}

const ComponentPopup: React.FC<ComponentPopupProps> = ({ row, rowIndex, onClose, onSave }) => {
  const [form, setForm]               = useState<ComponentRow>({ ...row });
  const [showSuggest, setShowSuggest] = useState(false);
  const [doNotExplode, setDoNotExplode] = useState(false);
  const [allowAlt,     setAllowAlt]    = useState(false);
  const [isStock,      setIsStock]     = useState(false);
  const [hasVariants,  setHasVariants] = useState(false);
  const [includeInMfg, setIncludeInMfg] = useState(false);
  const [sourcedBySupplier, setSourcedBySupplier] = useState(false);
  const [isSubAssembly,     setIsSubAssembly]     = useState(false);
  const [isPhantom,         setIsPhantom]         = useState(false);
  const set = (k: keyof ComponentRow) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="nbom-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="nbom-popup">
        <div className="nbom-popup__head">
          <span className="nbom-popup__title">Editing Row #{rowIndex + 1}</span>
          <div className="nbom-popup__actions">
            <button className="nbom-popup-btn nbom-popup-btn--danger"><Trash2 size={13} /> Delete</button>
            <button className="nbom-popup-btn">Insert Below</button>
            <button className="nbom-popup-btn">Insert Above</button>
            <button className="nbom-popup-btn"><Copy size={12} /> Duplicate</button>
            <button className="nbom-popup-btn nbom-popup-btn--move">Move <ChevronDown size={13} /></button>
            <button className="nbom-popup__close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <div className="nbom-popup__body">
          <div className="nbom-popup-grid">
            <div className="nbom-field">
              <Label text="Item Code" required />
              <div className="nbom-autocomplete-wrap">
                <Input value={form.itemCode}
                  onChange={e => { setForm(f => ({ ...f, itemCode: e.target.value })); setShowSuggest(true); }}
                  onFocus={() => setShowSuggest(true)}
                  onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                  placeholder="Search item..." />
                {showSuggest && (
                  <div className="nbom-autocomplete-list">
                    {ITEM_SUGGESTIONS.filter(s => !form.itemCode || s.code.toLowerCase().includes(form.itemCode.toLowerCase())).map(s => (
                      <div key={s.code} className="nbom-autocomplete-item"
                        onMouseDown={() => { setForm(f => ({ ...f, itemCode: s.code })); setShowSuggest(false); }}>
                        <div className="nbom-autocomplete-item__code">{s.code}</div>
                        <div className="nbom-autocomplete-item__sub">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 22 }}>
              <Checkbox label="Do Not Explode" checked={doNotExplode} onChange={() => setDoNotExplode(v => !v)} />
            </div>
            <div className="nbom-field"><Label text="BOM No" /><Input readOnly value="" /></div>
            <div className="nbom-field"><Label text="Source Warehouse" /><Input readOnly value="" /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
              <Checkbox label="Allow Alternative Item" checked={allowAlt} onChange={() => setAllowAlt(v => !v)} />
              <Checkbox label="Is Stock Item"          checked={isStock}  onChange={() => setIsStock(v => !v)} />
            </div>
          </div>
          <div className="nbom-popup-grid">
            <div className="nbom-field"><Label text="Qty" required /><Input value={form.qty} onChange={set("qty")} type="number" /></div>
            <div className="nbom-field"><Label text="Stock UOM" /><Input readOnly value="Nos" /></div>
            <div className="nbom-field"><Label text="UOM" required /><Input value={form.uom} onChange={set("uom")} /></div>
            <div className="nbom-field"><Label text="Conversion Factor" /><Input readOnly value="" /></div>
          </div>
          <div className="nbom-popup-section">
            <div className="nbom-popup-section__title">Rate &amp; Amount</div>
            <div className="nbom-popup-grid">
              <div className="nbom-field"><Label text="Rate" required /><Input value={form.rate} onChange={set("rate")} type="number" /></div>
            </div>
          </div>
          <div className="nbom-popup-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Checkbox label="Has Variants"                   checked={hasVariants}  onChange={() => setHasVariants(v => !v)} />
              <Checkbox label="Include Item In Manufacturing"  checked={includeInMfg} onChange={() => setIncludeInMfg(v => !v)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Checkbox label="Sourced by Supplier"  checked={sourcedBySupplier} onChange={() => setSourcedBySupplier(v => !v)} />
              <Checkbox label="Is Sub Assembly Item" checked={isSubAssembly}     onChange={() => setIsSubAssembly(v => !v)} />
              <Checkbox label="Is Phantom Item"      checked={isPhantom}         onChange={() => setIsPhantom(v => !v)} />
            </div>
          </div>
        </div>
        <div className="nbom-popup__foot">
          <div className="nbom-shortcuts">
            <span>Shortcuts:</span>
            <kbd className="nbom-kbd">Ctrl + Up</kbd><span>·</span>
            <kbd className="nbom-kbd">Ctrl + Down</kbd><span>·</span>
            <kbd className="nbom-kbd">ESC</kbd>
          </div>
          <button className="nbom-popup-btn nbom-popup-btn--primary" onClick={() => { onSave(form); onClose(); }}>
            Insert Below
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Secondary Item popup ─────────────────────────────────────────────────────

interface SecondaryPopupProps {
  row: SecondaryRow; rowIndex: number;
  onClose: () => void; onSave: (u: SecondaryRow) => void;
}

const SecondaryPopup: React.FC<SecondaryPopupProps> = ({ row, rowIndex, onClose, onSave }) => {
  const [form, setForm] = useState<SecondaryRow>({ ...row });
  const set = (k: keyof SecondaryRow) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="nbom-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="nbom-popup">
        <div className="nbom-popup__head">
          <span className="nbom-popup__title">Editing Row #{rowIndex + 1}</span>
          <div className="nbom-popup__actions">
            <button className="nbom-popup-btn nbom-popup-btn--danger"><Trash2 size={13} /> Delete</button>
            <button className="nbom-popup-btn">Insert Below</button>
            <button className="nbom-popup-btn">Insert Above</button>
            <button className="nbom-popup-btn"><Copy size={12} /> Duplicate</button>
            <button className="nbom-popup-btn nbom-popup-btn--move">Move <ChevronDown size={13} /></button>
            <button className="nbom-popup__close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <div className="nbom-popup__body">
          <div className="nbom-field">
            <Label text="Type" required />
            <select className="nbom-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="">Select…</option>
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="nbom-popup-grid">
            <div className="nbom-field"><Label text="Item Code" required /><Input value={form.itemCode} onChange={set("itemCode")} placeholder="Search item…" /></div>
            <div className="nbom-field"><Label text="Qty" required /><Input value={form.qty} onChange={set("qty")} type="number" /></div>
          </div>
          <div className="nbom-popup-grid">
            <div className="nbom-field"><Label text="UOM" required /><Input value={form.uom} onChange={set("uom")} /></div>
            <div className="nbom-field"><Label text="Stock UOM" /><Input readOnly value="Nos" /></div>
          </div>
          <div className="nbom-popup-grid">
            <div /><div className="nbom-field"><Label text="Conversion Factor" required /><Input readOnly value="1.000" /></div>
          </div>
          <div className="nbom-field">
            <Label text="Description" />
            <div className="nbom-editor-wrap">
              <div className="nbom-editor-toolbar">
                <span style={{ fontSize: 12, color: "var(--c-text-muted)", padding: "0 6px", fontWeight: 600 }}>Normal</span>
                <div className="nbom-editor-divider" />
                {["B","I","U","S"].map(t => (
                  <button key={t} className="nbom-editor-btn" style={{ fontWeight: t==="B"?700:400, fontStyle: t==="I"?"italic":"normal", textDecoration: t==="U"?"underline":t==="S"?"line-through":"none" }}>{t}</button>
                ))}
                <div className="nbom-editor-divider" />
                {["≡","⊟","⊞","⟨⟩","🔗"].map((ic, i) => <button key={i} className="nbom-editor-btn">{ic}</button>)}
              </div>
              <textarea className="nbom-editor-area" placeholder="Add a description…" rows={5} />
            </div>
          </div>
          <div className="nbom-popup-section">
            <div className="nbom-popup-grid" style={{ padding: "14px 12px" }}>
              <div className="nbom-field"><Label text="Cost Allocation %" required /><Input readOnly value="0.000" /></div>
              <div className="nbom-field"><Label text="Cost" required /><Input readOnly value="₹ 0.00" /></div>
              <div className="nbom-field"><Label text="Process Loss %" required /><Input readOnly value="0.000" /></div>
              <div className="nbom-field"><Label text="Process Loss Qty" required /><Input readOnly value="0" /></div>
            </div>
          </div>
        </div>
        <div className="nbom-popup__foot">
          <div className="nbom-shortcuts">
            <span>Shortcuts:</span>
            <kbd className="nbom-kbd">Ctrl + Up</kbd><span>·</span>
            <kbd className="nbom-kbd">Ctrl + Down</kbd><span>·</span>
            <kbd className="nbom-kbd">ESC</kbd>
          </div>
          <button className="nbom-popup-btn nbom-popup-btn--primary" onClick={() => { onSave(form); onClose(); }}>
            Insert Below
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Validation Modal ─────────────────────────────────────────────────────────

interface ValidationModalProps {
  errors: ValidationError[];
  onClose: () => void;
  onJump: (tabId: TabId) => void;
  tabs: { id: TabId; label: string }[];
}

const ValidationModal: React.FC<ValidationModalProps> = ({ errors, onClose, onJump, tabs }) => (
  <div className="nbom-modal-overlay" onClick={onClose}>
    <div className="nbom-validation-modal" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="nbom-modal-header">
        <h2 className="nbom-modal-title">
          <AlertTriangle size={16} />
          Missing Required Fields
        </h2>
        <button className="nbom-modal-close" onClick={onClose}><X size={18} /></button>
      </div>

      {/* Body */}
      <div className="nbom-modal-body">
        <p className="nbom-modal-intro">
          Please fill in the following required fields before saving:
        </p>
        <div className="nbom-error-list">
          {errors.map((err, i) => {
            const tabLabel = tabs.find(t => t.id === err.tabId)?.label ?? err.tabId;
            return (
              <div key={i} className="nbom-validation-error-item" onClick={() => onJump(err.tabId)}>
                <div className="nbom-error-header">
                  <XCircle size={14} className="nbom-error-icon" />
                  <strong className="nbom-error-label">{err.label}</strong>
                  <span className="nbom-error-tab">{tabLabel}</span>
                </div>
                <div className="nbom-error-message">{err.message}</div>
              </div>
            );
          })}
        </div>
        <div className="nbom-hint-banner">
          <InfoIcon size={13} className="nbom-hint-icon" />
          Click on any error to jump to that section
        </div>
      </div>

      {/* Footer */}
      <div className="nbom-modal-footer">
        <button className="nbom-btn-cancel" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "production" | "config" | "info";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "production", label: "Production Item",    icon: <Package size={14} /> },
  { id: "config",     label: "BOM Configuration",  icon: <Wrench  size={14} /> },
  { id: "info",       label: "More Info",           icon: <Info    size={14} /> },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

interface NewBOMPageProps {
  onBack?: () => void;
}

const NewBOMPage: React.FC<NewBOMPageProps> = ({ onBack }) => {
  const [activeTab,           setActiveTab]           = useState<TabId>("production");
  const [costAllocPanelOpen,  setCostAllocPanelOpen]  = useState(true);
  const [opsPanelOpen,        setOpsPanelOpen]        = useState(true);
  const [withOperations,      setWithOperations]      = useState(false);
  const [itemToManufacture,   setItemToManufacture]   = useState("");

  const [compRows,     setCompRows]     = useState<ComponentRow[]>([
    { id: 1, itemCode: "", qty: "0.000", uom: "", rate: "₹ 0.00", amount: "₹ 0.00" },
  ]);
  const [editingComp,  setEditingComp]  = useState<{ row: ComponentRow; idx: number } | null>(null);

  const [secRows,      setSecRows]      = useState<SecondaryRow[]>([
    { id: 1, type: "", itemCode: "", itemName: "", uom: "", qty: "" },
  ]);
  const [editingSec,   setEditingSec]   = useState<{ row: SecondaryRow; idx: number } | null>(null);

  const [showValidation, setShowValidation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const addCompRow = () =>
    setCompRows(r => [...r, { id: Date.now(), itemCode: "", qty: "0.000", uom: "", rate: "₹ 0.00", amount: "₹ 0.00" }]);

  const addSecRow = () =>
    setSecRows(r => [...r, { id: Date.now(), type: "", itemCode: "", itemName: "", uom: "", qty: "" }]);

  // ─── Validation ──────────────────────────────────────────────────────────

  const getAllErrors = (): ValidationError[] => {
    const errs: ValidationError[] = [];

    // Production tab
    if (!itemToManufacture.trim())
      errs.push({ field: "itemToManufacture", label: "Item to Manufacture", message: "Item to Manufacture is required", tabId: "production" });

    const filledComps = compRows.filter(r => r.itemCode.trim());
    if (filledComps.length === 0)
      errs.push({ field: "components", label: "Components", message: "At least one component with an Item Code is required", tabId: "production" });

    compRows.forEach((r, i) => {
      if (r.itemCode && !r.uom.trim())
        errs.push({ field: `comp_uom_${i}`, label: `Component ${i + 1} UOM`, message: `UOM is required for component "${r.itemCode}"`, tabId: "production" });
    });

    return errs;
  };

  const getTabErrorCount = (tabId: TabId) => getAllErrors().filter(e => e.tabId === tabId).length;

  const hasAnyErrors = getAllErrors().length > 0;

  // ─── Save handler ─────────────────────────────────────────────────────────

  const handleSave = () => {
    const errs = getAllErrors();
    if (errs.length > 0) {
      setValidationErrors(errs);
      setShowValidation(true);
      return;
    }
    // All good — submit logic here
    console.log("Save BOM", { itemToManufacture, compRows, secRows });
  };

  const handleJump = (tabId: TabId) => {
    setActiveTab(tabId);
    setShowValidation(false);
  };

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  const handleNext = () => { const n = TABS[activeIndex + 1]; if (n) setActiveTab(n.id); };
  const handlePrev = () => { const p = TABS[activeIndex - 1]; if (p) setActiveTab(p.id); };

  // ─── Per-tab warning ──────────────────────────────────────────────────────
  const getTabWarning = (tabId: TabId) => getTabErrorCount(tabId) > 0;

  return (
    <div className="nbom-page">

      {/* ── Validation Modal ───────────────────────────────────── */}
      {showValidation && (
        <ValidationModal
          errors={validationErrors}
          onClose={() => setShowValidation(false)}
          onJump={handleJump}
          tabs={TABS}
        />
      )}

      {/* ── Topbar ────────────────────────────────────────────── */}
      <div className="nbom-topbar">

        {/* Breadcrumb */}
        <nav className="nbom-breadcrumb" aria-label="Breadcrumb">
          <ol className="nbom-breadcrumb__list">
            <li className="nbom-breadcrumb__item nbom-breadcrumb__item--home">
              <button className="nbom-breadcrumb__home-btn" title="Home" onClick={onBack}>
                <Home size={13} />
              </button>
            </li>

            <li className="nbom-breadcrumb__sep" aria-hidden><ChevronRight size={12} /></li>

            <li className="nbom-breadcrumb__item">
              <button className="nbom-breadcrumb__link" onClick={onBack}>
                Manufacturing
              </button>
            </li>

            <li className="nbom-breadcrumb__sep" aria-hidden><ChevronRight size={12} /></li>

            <li className="nbom-breadcrumb__item">
              <button className="nbom-breadcrumb__link" onClick={onBack}>
                Bill of Materials
              </button>
            </li>

            <li className="nbom-breadcrumb__sep" aria-hidden><ChevronRight size={12} /></li>

            <li className="nbom-breadcrumb__item nbom-breadcrumb__item--active" aria-current="page">
              <span className="nbom-breadcrumb__current">
                <span className="nbom-breadcrumb__current-dot" />
                New BOM
              </span>
            </li>
          </ol>
        </nav>

        {/* Right actions */}
        <div className="nbom-topbar__right">
          {hasAnyErrors && (
            <div className="nbom-error-pill">
              <AlertTriangle size={11} />
              {getAllErrors().length} missing field{getAllErrors().length > 1 ? "s" : ""}
            </div>
          )}
          <span className="nbom-badge--unsaved">Not Saved</span>
          <button className="nbom-btn-save" onClick={handleSave}>
            <Save size={13} />
            Save
          </button>
        </div>
      </div>

      {/* ── Stepper Tabs ───────────────────────────────────────── */}
      <div className="nbom-stepper-wrap">
        <div className="nbom-stepper-row">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            const hasWarn  = getTabWarning(tab.id);
            const errCount = getTabErrorCount(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`nbom-step-btn ${isActive ? "nbom-step-btn--active" : ""}`}
              >
                <div className={`nbom-step-circle
                  ${isActive            ? "nbom-step-circle--active"  : ""}
                  ${hasWarn && !isActive ? "nbom-step-circle--warning" : ""}
                `}>
                  {hasWarn && !isActive
                    ? <AlertTriangle size={14} />
                    : isActive
                      ? tab.icon
                      : idx + 1
                  }
                  {errCount > 0 && !isActive && (
                    <div className="nbom-step-error-badge">{errCount}</div>
                  )}
                </div>

                <div className="nbom-step-label-wrap">
                  <div className={`nbom-step-step
                    ${isActive            ? "nbom-step-step--active"  : ""}
                    ${hasWarn && !isActive ? "nbom-step-step--warning" : ""}
                  `}>Step {idx + 1}</div>
                  <div className={`nbom-step-name ${isActive ? "nbom-step-name--active" : ""}`}>
                    {tab.label}
                  </div>
                </div>

                {isActive && <div className="nbom-step-underline" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Warning banner ─────────────────────────────────────── */}
      {getTabWarning(activeTab) && (
        <div className="nbom-tab-warning-banner">
          <AlertTriangle size={12} />
          <span>This tab has incomplete or missing information. Please review before saving.</span>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="nbom-body" key={activeTab}>

        {activeTab === "config" && <BOMConfigTab />}
        {activeTab === "info"   && <MoreInfoTab />}

        {activeTab === "production" && (
          <>
            {/* Item to Manufacture */}
            <div className="nbom-card">
              <div className="nbom-card__body">
                <div className="nbom-field">
                  <Label text="Item to Manufacture" required info />
                  <Input
                    placeholder="Search or enter item…"
                    value={itemToManufacture}
                    onChange={e => setItemToManufacture(e.target.value)}
                    className={!itemToManufacture.trim() ? "nbom-input--error" : ""}
                  />
                  {!itemToManufacture.trim() && (
                    <span className="nbom-error-text">Item to Manufacture is required</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cost Allocation */}
            <div className="nbom-card">
              <div className="nbom-card__header" onClick={() => setCostAllocPanelOpen(o => !o)}>
                <span className="nbom-card__title"><span className="nbom-card__title-dot" />Cost Allocation / Process Loss</span>
                <ChevronDown size={15} className={`nbom-card__chev ${costAllocPanelOpen ? "nbom-card__chev--open" : ""}`} />
              </div>
              {costAllocPanelOpen && (
                <div className="nbom-card__body">
                  <div className="nbom-form-grid">
                    <div className="nbom-field"><Label text="% Cost Allocation" /><Input defaultValue="100.000" /></div>
                    <div className="nbom-field"><Label text="% Process Loss" /><Input readOnly value="" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Operations */}
            <div className="nbom-card">
              <div className="nbom-card__header" onClick={() => setOpsPanelOpen(o => !o)}>
                <span className="nbom-card__title"><span className="nbom-card__title-dot" />Operations</span>
                <ChevronDown size={15} className={`nbom-card__chev ${opsPanelOpen ? "nbom-card__chev--open" : ""}`} />
              </div>
              {opsPanelOpen && (
                <div className="nbom-card__body">
                  <Checkbox label="With Operations" hint="Manage cost of operations" checked={withOperations} onChange={() => setWithOperations(v => !v)} />
                </div>
              )}
            </div>

            {/* Components */}
            <div className="nbom-card">
              <div className="nbom-card__body">
                <div className="nbom-card__title" style={{ marginBottom: 14 }}>
                  <span className="nbom-card__title-dot" />Components
                </div>
                <div className="nbom-table-wrap">
                  <table className="nbom-table">
                    <thead>
                      <tr>
                        <th className="nbom-table-cb"><input type="checkbox" /></th>
                        <th className="nbom-table-no">No.</th>
                        <th>Item Code <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>Qty <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>UOM <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>Rate <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>Amount</th>
                        <th><Settings size={13} style={{ color: "var(--c-text-muted)" }} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {compRows.map((row, idx) => (
                        <tr key={row.id}>
                          <td className="nbom-table-cb"><input type="checkbox" /></td>
                          <td className="nbom-table-no">{idx + 1}</td>
                          <td><input className="nbom-table-input" value={row.itemCode} onChange={e => setCompRows(rs => rs.map((r, i) => i === idx ? { ...r, itemCode: e.target.value } : r))} placeholder="Item Code" /></td>
                          <td><input className="nbom-table-input" value={row.qty} onChange={e => setCompRows(rs => rs.map((r, i) => i === idx ? { ...r, qty: e.target.value } : r))} style={{ textAlign: "right", width: 80 }} /></td>
                          <td><input className="nbom-table-input" value={row.uom} onChange={e => setCompRows(rs => rs.map((r, i) => i === idx ? { ...r, uom: e.target.value } : r))} style={{ width: 80 }} /></td>
                          <td className="nbom-table-val">{row.rate}</td>
                          <td className="nbom-table-val">{row.amount}</td>
                          <td style={{ textAlign: "center" }}>
                            <button className="nbom-edit-btn" onClick={() => setEditingComp({ row, idx })}><Pencil size={12} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="nbom-table-footer">
                  <div className="nbom-table-footer__left">
                    <button className="nbom-btn-link" onClick={addCompRow}>Add row</button>
                    <button className="nbom-btn-link">Add multiple</button>
                  </div>
                  <div className="nbom-table-footer__right">
                    <button className="nbom-btn-ghost">Download</button>
                    <button className="nbom-btn-ghost">Upload</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Items */}
            <div className="nbom-card">
              <div className="nbom-card__body">
                <div className="nbom-card__title" style={{ marginBottom: 14 }}>
                  <span className="nbom-card__title-dot" style={{ background: "var(--c-teal)" }} />Secondary Items
                </div>
                <div className="nbom-table-wrap">
                  <table className="nbom-table">
                    <thead>
                      <tr>
                        <th className="nbom-table-cb"><input type="checkbox" /></th>
                        <th className="nbom-table-no">No.</th>
                        <th>Type</th>
                        <th>Item Code <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>Item Name</th>
                        <th>UOM <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th>Qty <span style={{ color: "var(--c-danger)" }}>*</span></th>
                        <th><Settings size={13} style={{ color: "var(--c-text-muted)" }} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {secRows.map((row, idx) => (
                        <tr key={row.id}>
                          <td className="nbom-table-cb"><input type="checkbox" /></td>
                          <td className="nbom-table-no">{idx + 1}</td>
                          <td><select className="nbom-table-select" value={row.type} onChange={e => setSecRows(rs => rs.map((r, i) => i === idx ? { ...r, type: e.target.value } : r))}><option value="">Select…</option>{TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                          <td><input className="nbom-table-input" value={row.itemCode} onChange={e => setSecRows(rs => rs.map((r, i) => i === idx ? { ...r, itemCode: e.target.value } : r))} placeholder="Item Code" /></td>
                          <td><input className="nbom-table-input" value={row.itemName} onChange={e => setSecRows(rs => rs.map((r, i) => i === idx ? { ...r, itemName: e.target.value } : r))} placeholder="Item Name" /></td>
                          <td><input className="nbom-table-input" value={row.uom} onChange={e => setSecRows(rs => rs.map((r, i) => i === idx ? { ...r, uom: e.target.value } : r))} placeholder="UOM" style={{ width: 80 }} /></td>
                          <td><input className="nbom-table-input" value={row.qty} onChange={e => setSecRows(rs => rs.map((r, i) => i === idx ? { ...r, qty: e.target.value } : r))} placeholder="Qty" style={{ width: 70, textAlign: "right" }} /></td>
                          <td style={{ textAlign: "center" }}><button className="nbom-edit-btn" onClick={() => setEditingSec({ row, idx })}><Pencil size={12} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="nbom-table-footer">
                  <div className="nbom-table-footer__left">
                    <button className="nbom-btn-link" onClick={addSecRow}>Add row</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="nbom-footer-row">
        {activeIndex > 0 && (
          <button type="button" className="nbom-footer-btn nbom-footer-btn--secondary" onClick={handlePrev}>← Previous</button>
        )}
        {activeIndex < TABS.length - 1 && (
          <button type="button" className="nbom-footer-btn nbom-footer-btn--primary" onClick={handleNext}>Next →</button>
        )}
        {activeIndex === TABS.length - 1 && (
          <button type="button" className="nbom-footer-btn nbom-footer-btn--primary nbom-footer-btn--submit" onClick={handleSave}>
            <Save size={14} /> Save BOM
          </button>
        )}
      </div>

      {/* ── Row edit popups ────────────────────────────────────── */}
      {editingComp && (
        <ComponentPopup row={editingComp.row} rowIndex={editingComp.idx}
          onClose={() => setEditingComp(null)}
          onSave={updated => setCompRows(rs => rs.map((r, i) => i === editingComp.idx ? updated : r))} />
      )}
      {editingSec && (
        <SecondaryPopup row={editingSec.row} rowIndex={editingSec.idx}
          onClose={() => setEditingSec(null)}
          onSave={updated => setSecRows(rs => rs.map((r, i) => i === editingSec.idx ? updated : r))} />
      )}
    </div>
  );
};

export default NewBOMPage;