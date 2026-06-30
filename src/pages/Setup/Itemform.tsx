import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTag,
  FaList,
  FaBoxes,
  FaDollarSign,
  FaCube,
  FaTruck,
  FaShoppingCart,
  FaIndustry,
  FaClipboardCheck,
  FaLink,
  
} from 'react-icons/fa';
import "./ItemForm.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';
import toast from "react-hot-toast";
import api from '../../services/api';

interface TableRow { id: string; [key: string]: string }

function makeRow(fields: string[]): TableRow {
  const row: TableRow = { id: Date.now().toString() + Math.random() };
  fields.forEach((f) => (row[f] = ""));
  return row;
}

interface ValidationError {
  field: string;
  label: string;
  message: string;
  tabIndex: number;
}

interface ItemData {
  id: number;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  is_stock_item: number;
  is_fixed_asset: number;
  is_sales_item: number;
  is_purchase_item: number;
  disabled: number;
  description: string;
  brand: string | null;
  valuation_method: string;
  creation: string;
  modified: string;
  hsn_sac?: string;
}

interface ItemGroup {
  id: number;
  item_group_name: string;
  parent_item_group: string;
  is_group: number;
  image: string | null;
  creation: string;
  modified: string;
}

interface UOM {
  id: number;
  uom_name: string;
  symbol: string;
  common_code: string;
  category: string;
  enabled: number;
  must_be_whole_number: number;
  creation: string;
}

/* ── Shared sub-components ─────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="itf-section-title">{children}</h3>;
}

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="itf-field">
      <label className="itf-label">
        {label} {required && <span className="itf-req">*</span>}
      </label>
      {children}
      {hint && <p className="itf-hint">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, readOnly, placeholder,
}: {
  value: string; onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string;
}) {
  return (
    <input
      className="itf-input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder ?? ""}
    />
  );
}

// Enhanced SelectInput with search functionality
// Enhanced SelectInput with search functionality and fixed positioning
function SelectInput({
  value,
  onChange,
  options,
  placeholder = "Search or select...",
  loading = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  loading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(240, filteredOptions.length * 38 + 12);
      
      setDropdownPosition({
        top: spaceBelow > dropdownHeight ? rect.bottom + 4 : rect.top - dropdownHeight - 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      calculateDropdownPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Recalculate position on scroll or resize
  useEffect(() => {
    if (isOpen) {
      const handleUpdate = () => calculateDropdownPosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);
      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex];
          onChange?.(selected.value);
          setSearchTerm("");
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className="itf-select-container" ref={dropdownRef}>
      <div
        ref={wrapperRef}
        className={`itf-select-wrapper ${isOpen ? 'itf-select-open' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <input
          ref={inputRef}
          type="text"
          className="itf-select-input"
          value={isOpen ? searchTerm : (selectedOption?.label || "")}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
              setHighlightedIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={selectedOption?.label || placeholder}
          onFocus={() => setIsOpen(true)}
          readOnly={!isOpen}
        />
        <span className="itf-select-arrow">
          {loading ? (
            <FaSpinner className="spinning" size={12} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>
        {isOpen && searchTerm && (
          <button
            className="itf-select-clear"
            onClick={(e) => {
              e.stopPropagation();
              setSearchTerm("");
              setHighlightedIndex(-1);
              if (inputRef.current) inputRef.current.focus();
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="itf-select-dropdown"
          ref={listRef}
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: '240px',
            zIndex: 9999,
          }}
        >
          {loading ? (
            <div className="itf-select-loading">
              <FaSpinner className="spinning" size={16} />
              <span>Loading...</span>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="itf-select-empty">No options found</div>
          ) : (
            filteredOptions.map((opt, index) => (
              <div
                key={opt.value}
                className={`itf-select-option ${index === highlightedIndex ? 'itf-select-option-highlighted' : ''}`}
                onClick={() => {
                  onChange?.(opt.value);
                  setSearchTerm("");
                  setIsOpen(false);
                  setHighlightedIndex(-1);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {opt.label}
                {opt.value === value && (
                  <span className="itf-select-option-check">✓</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CheckField({
  id, checked, onChange, label, hint,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div className="itf-check-row">
      <input
        type="checkbox" id={id} className="itf-checkbox"
        checked={checked} onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <label htmlFor={id} className="itf-check-label">{label}</label>
        {hint && <p className="itf-hint">{hint}</p>}
      </div>
    </div>
  );
}

function InlineTable({
  columns, rows, onAddRow, onRemoveRow, renderCell,
}: {
  columns: { key: string; label: string; required?: boolean }[];
  rows: TableRow[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  renderCell: (row: TableRow, col: string, onChange: (v: string) => void) => React.ReactNode;
}) {
  return (
    <>
      <div className="itf-table-block">
        <div className="itf-table-scroll-wrapper">
          <table className="itf-inline-table">
            <thead>
              <tr>
                <th className="itf-ith itf-ith-check"><input type="checkbox" className="itf-checkbox" /></th>
                <th className="itf-ith itf-ith-no">No.</th>
                {columns.map((c) => (
                  <th key={c.key} className="itf-ith">
                    {c.label} {c.required && <span className="itf-req">*</span>}
                  </th>
                ))}
                <th className="itf-ith itf-ith-act">
                  <SettingsIcon />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={columns.length + 3} className="itf-empty-row">No rows</td></tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={row.id} className="itf-itr">
                    <td className="itf-itd"><input type="checkbox" className="itf-checkbox" /></td>
                    <td className="itf-itd itf-itd-no">{i + 1}</td>
                    {columns.map((c) => (
                      <td key={c.key} className="itf-itd itf-cell-with-dropdown">
                        {renderCell(row, c.key, () => {})}
                      </td>
                    ))}
                    <td className="itf-itd">
                      <button className="itf-remove-row" onClick={() => onRemoveRow(row.id)}>×</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <button className="itf-add-row" onClick={onAddRow}><FaPlus size={10} /> Add row</button>
    </>
  );
}

function SettingsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

/* ── Tab content components ─────────────────────────── */

function DetailsTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });
  
  // State for item groups
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // State for UOMs
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loadingUoms, setLoadingUoms] = useState(false);

  // Fetch item groups on mount
  useEffect(() => {
    const fetchItemGroups = async () => {
      setLoadingGroups(true);
      try {
        const response = await api.get("/item-group");
        if (response.data.success === 1) {
          setItemGroups(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching item groups:', err);
        toast.error('Failed to load item groups');
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchItemGroups();
  }, []);

  // Fetch UOMs on mount
  useEffect(() => {
    const fetchUoms = async () => {
      setLoadingUoms(true);
      try {
        const response = await api.get("/uom");
        if (response.data.success === 1) {
          setUoms(response.data.data.records || []);
        }
      } catch (err) {
        console.error('Error fetching UOMs:', err);
        toast.error('Failed to load UOMs');
      } finally {
        setLoadingUoms(false);
      }
    };
    fetchUoms();
  }, []);

  // Convert item groups to select options format
  const groupOptions = itemGroups.map(group => ({
    label: group.item_group_name,
    value: group.item_group_name
  }));

  // Convert UOMs to select options format
  const uomOptions = uoms
    .filter(uom => uom.enabled === 1)
    .map(uom => ({
      label: uom.uom_name + (uom.symbol ? ` (${uom.symbol})` : ''),
      value: uom.uom_name
    }));

  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Item Name" required>
              <TextInput value={form.itemName} onChange={(v) => s("itemName", v)} />
            </Field>
            <Field label="Item Group" required>
              <SelectInput 
                value={form.itemGroup} 
                onChange={(v) => s("itemGroup", v)} 
                options={groupOptions}
                loading={loadingGroups}
                placeholder="Search for an item group..."
              />
            </Field>
            <Field label="HSN/SAC" hint="You can search code by the description of the category.">
              <TextInput value={form.hsnSac} onChange={(v) => s("hsnSac", v)} />
            </Field>
            <Field label="Default Unit of Measure" required>
              <SelectInput 
                value={form.defaultUOM} 
                onChange={(v) => s("defaultUOM", v)} 
                options={uomOptions}
                loading={loadingUoms}
                placeholder="Search for a UOM..."
              />
            </Field>
          </div>
          <div className="itf-col">
            <CheckField id="disabled" checked={form.disabled} onChange={(v) => s("disabled", v)} label="Disabled" />
            <CheckField
              id="maintainStock" checked={form.maintainStock} onChange={(v) => s("maintainStock", v)}
              label="Maintain Stock"
              hint="ERPNext will make a stock ledger entry for each transaction of this item."
            />
            <CheckField
              id="isFixedAsset" checked={form.isFixedAsset} onChange={(v) => s("isFixedAsset", v)}
              label="Is Fixed Asset"
              hint="Enable if this item is a company asset like machinery or furniture."
            />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Item Attributes</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField id="allowSales" checked={form.allowSales} onChange={(v) => s("allowSales", v)} label="Allow Sales" />
            <CheckField id="allowAltItem" checked={form.allowAltItem} onChange={(v) => s("allowAltItem", v)} label="Allow Alternative Item" />
            <CheckField id="hasVariants" checked={form.hasVariants} onChange={(v) => s("hasVariants", v)} label="Has Variants" />
          </div>
          <div className="itf-col">
            <CheckField id="allowPurchase" checked={form.allowPurchase} onChange={(v) => s("allowPurchase", v)} label="Allow Purchase" />
            <CheckField id="isCustomerProvided" checked={form.isCustomerProvided} onChange={(v) => s("isCustomerProvided", v)} label="Is Customer Provided Item" />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Over Delivery/Receipt Allowance (%)" hint="Percentage by which over-delivery or over-receipt is allowed.">
              <TextInput value={form.overDelivery} onChange={(v) => s("overDelivery", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Over Billing Allowance (%)" hint="Percentage by which over-billing is allowed.">
              <TextInput value={form.overBilling} onChange={(v) => s("overBilling", v)} />
            </Field>
          </div>
        </div>
      </section>
    </>
  );
}

function AccountingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [defaults, setDefaults] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <SectionTitle>Item Defaults</SectionTitle>
        <InlineTable
          columns={[
            { key: "company", label: "Company", required: true },
            { key: "defaultWarehouse", label: "Default Warehouse" },
            { key: "defaultPriceList", label: "Default Price List" },
          ]}
          rows={defaults}
          onAddRow={() => setDefaults([...defaults, makeRow(["company","defaultWarehouse","defaultPriceList"])])}
          onRemoveRow={(id) => setDefaults(defaults.filter((r) => r.id !== id))}
          renderCell={(row, col) => (
            <input className="itf-cell-input" defaultValue={row[col]} />
          )}
        />
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Deferred Accounting</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField
              id="deferredExpense" checked={form.deferredExpense ?? false}
              onChange={(v) => s("deferredExpense", v)} label="Enable Deferred Expense"
              hint="Income from this item will be recognized over a period of months."
            />
          </div>
          <div className="itf-col">
            <CheckField
              id="deferredRevenue" checked={form.deferredRevenue ?? false}
              onChange={(v) => s("deferredRevenue", v)} label="Enable Deferred Revenue"
              hint="Expense for this item will be recognized over a period of months."
            />
          </div>
        </div>
      </section>
    </>
  );
}



// In the UOMTab component, update the state and logic:

function UOMTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  // Initialize with the default UOM from the form
  const [rows, setRows] = useState<TableRow[]>(() => {
    // If we have a default UOM from the form, use it
    if (form.defaultUOM) {
      return [{ id: "1", uom: form.defaultUOM, conversionFactor: "1" }];
    }
    return [{ id: "1", uom: "Nos", conversionFactor: "1" }];
  });

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loadingUoms, setLoadingUoms] = useState(false);

  useEffect(() => {
    const fetchUoms = async () => {
      setLoadingUoms(true);
      try {
        const response = await api.get("/uom");
        if (response.data.success === 1) {
          setUoms(response.data.data.records || []);
        }
      } catch (err) {
        console.error('Error fetching UOMs:', err);
        toast.error('Failed to load UOMs');
      } finally {
        setLoadingUoms(false);
      }
    };
    fetchUoms();
  }, []);

  // Update rows when form.defaultUOM changes
  useEffect(() => {
    if (form.defaultUOM && rows.length > 0) {
      // Only update if the first row doesn't have a UOM or is empty
      if (!rows[0].uom || rows[0].uom === "") {
        setRows([{ id: rows[0].id, uom: form.defaultUOM, conversionFactor: "1" }]);
      }
    }
  }, [form.defaultUOM]);

  const uomOptions = uoms
    .filter(uom => uom.enabled === 1)
    .map(uom => ({
      label: uom.uom_name + (uom.symbol ? ` (${uom.symbol})` : ''),
      value: uom.uom_name
    }));

  const getUOMLabel = (value: string) => {
    const option = uomOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleUOMChange = (rowId: string, value: string) => {
    setRows(rows.map(row =>
      row.id === rowId ? { ...row, uom: value } : row
    ));
    // Exit edit mode after selection
    setEditingRowId(null);
  };

  const handleConversionChange = (rowId: string, value: string) => {
    setRows(rows.map(row =>
      row.id === rowId ? { ...row, conversionFactor: value } : row
    ));
  };

  const handleRowClick = (rowId: string) => {
    setEditingRowId(rowId);
  };

  const handleAddRow = () => {
    const newRow = makeRow(["uom", "conversionFactor"]);
    setRows([...rows, newRow]);
    // Automatically enter edit mode for the new row
    setEditingRowId(newRow.id);
  };

  // Determine if we're in view mode (when the item is disabled)
  const isViewMode = form?.disabled === true;

  // Check if we should show view mode for a specific row
  const shouldShowViewMode = (rowId: string) => {
    // If the item is disabled, always show view mode
    if (isViewMode) return true;
    // If this row is being edited, show dropdown
    if (editingRowId === rowId) return false;
    // For the first row with default UOM, show view mode
    const rowIndex = rows.findIndex(r => r.id === rowId);
    if (rowIndex === 0 && form.defaultUOM) return true;
    // For other rows, show view mode if they have a value
    const row = rows.find(r => r.id === rowId);
    return row && row.uom && row.uom !== "";
  };

  return (
    <>
      <section className="itf-section">
        <SectionTitle>UOM Conversion Details</SectionTitle>
        <p className="itf-hint" style={{ marginBottom: 14 }}>
          Define alternate units for this item. Eg: 1 Box = 12 Nos, set conversion factor as 12.
          <a href="#" className="itf-link"> Learn more →</a>
        </p>
        <InlineTable
          columns={[
            { key: "uom", label: "UOM" },
            { key: "conversionFactor", label: "Conversion Factor" },
          ]}
          rows={rows}
          onAddRow={handleAddRow}
          onRemoveRow={(id) => {
            // Don't allow removing the last row
            if (rows.length > 1) {
              setRows(rows.filter((r) => r.id !== id));
              if (editingRowId === id) setEditingRowId(null);
            }
          }}
          renderCell={(row, col) => {
            if (col === "uom") {
              const showView = shouldShowViewMode(row.id);
              
              if (showView) {
                return (
                  <div 
                    className="itf-view-text itf-clickable-view"
                    onClick={() => {
                      // Allow editing by clicking on view mode (if not in view-only mode)
                      if (!isViewMode) {
                        setEditingRowId(row.id);
                      }
                    }}
                    style={{ cursor: isViewMode ? 'default' : 'pointer' }}
                  >
                    {row.uom ? getUOMLabel(row.uom) : "—"}
                    
                  </div>
                );
              }
              
              return (
                <SelectInput
                  value={row.uom || ""}
                  onChange={(v) => handleUOMChange(row.id, v)}
                  options={uomOptions}
                  loading={loadingUoms}
                  placeholder="Search for a UOM..."
                />
              );
            }
            if (col === "conversionFactor") {
              const showView = shouldShowViewMode(row.id);
              
              if (showView) {
                return (
                  <div 
                    className="itf-view-text itf-clickable-view"
                    onClick={() => {
                      if (!isViewMode) {
                        setEditingRowId(row.id);
                      }
                    }}
                    style={{ cursor: isViewMode ? 'default' : 'pointer' }}
                  >
                    {row.conversionFactor || "—"}
                  </div>
                );
              }
              
              return (
                <input
                  className="itf-cell-input"
                  value={row.conversionFactor || ""}
                  onChange={(e) => handleConversionChange(row.id, e.target.value)}
                  placeholder="Enter conversion factor"
                  type="number"
                  step="0.001"
                  onBlur={() => {
                    // Exit edit mode when clicking away, but only if the row has a value
                    if (row.uom && row.uom !== "") {
                      setEditingRowId(null);
                    }
                  }}
                  autoFocus
                />
              );
            }
            return null;
          }}
        />
      </section>
    </>
  );
}


function TaxTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [taxes, setTaxes] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <CheckField
          id="ineligibleITC" checked={form.ineligibleITC ?? false}
          onChange={(v) => s("ineligibleITC", v)} label="Is Ineligible for Input Tax Credit"
        />

        <div style={{ marginTop: 20 }}>
          <SectionTitle>Taxes</SectionTitle>
          <p className="itf-hint" style={{ marginBottom: 12 }}>Will also apply for variants</p>
          <InlineTable
            columns={[
              { key: "itemTaxTemplate", label: "Item Tax Template", required: true },
              { key: "taxCategory", label: "Tax Category" },
              { key: "validFrom", label: "Valid From" },
              { key: "minNetRate", label: "Minimum Net Rate" },
              { key: "maxNetRate", label: "Maximum Net Rate" },
            ]}
            rows={taxes}
            onAddRow={() => setTaxes([...taxes, makeRow(["itemTaxTemplate","taxCategory","validFrom","minNetRate","maxNetRate"])])}
            onRemoveRow={(id) => setTaxes(taxes.filter((r) => r.id !== id))}
            renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
          />
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Purchase Tax Withholding Category">
              <TextInput value={form.purchaseTaxWithholding ?? ""} onChange={(v) => s("purchaseTaxWithholding", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Sales Tax Withholding Category">
              <TextInput value={form.salesTaxWithholding ?? ""} onChange={(v) => s("salesTaxWithholding", v)} />
            </Field>
          </div>
        </div>
      </section>
    </>
  );
}

function InventoryTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [barcodes, setBarcodes] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <SectionTitle>Stock Levels</SectionTitle>
        <div className="itf-empty-state">No Stock Available Currently</div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Inventory Valuation</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Valuation Method">
              <SelectInput 
                value={form.valuationMethod ?? ""} 
                onChange={(v) => s("valuationMethod", v)} 
                options={[
                  { label: "FIFO", value: "FIFO" },
                  { label: "Moving Average", value: "Moving Average" },
                  { label: "LIFO", value: "LIFO" }
                ]}
              />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Valuation Rate">
              <TextInput value={form.valuationRate ?? "0.00"} onChange={(v) => s("valuationRate", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Inventory Settings</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="End of Life">
              <TextInput value={form.endOfLife ?? "31-12-2099"} onChange={(v) => s("endOfLife", v)} />
            </Field>
            <Field label="Default Material Request Type">
              <SelectInput 
                value={form.matReqType ?? "Purchase"} 
                onChange={(v) => s("matReqType", v)} 
                options={[
                  { label: "Purchase", value: "Purchase" },
                  { label: "Manufacture", value: "Manufacture" },
                  { label: "Transfer", value: "Transfer" },
                  { label: "Customer Provided", value: "Customer Provided" }
                ]}
              />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Warranty Period (in days)">
              <TextInput value={form.warrantyPeriod ?? ""} onChange={(v) => s("warrantyPeriod", v)} />
            </Field>
            <Field label="Weight Per Unit">
              <TextInput value={form.weightPerUnit ?? "0.000"} onChange={(v) => s("weightPerUnit", v)} />
            </Field>
            <Field label="Weight UOM">
              <TextInput value={form.weightUOM ?? ""} onChange={(v) => s("weightUOM", v)} />
            </Field>
            <CheckField
              id="allowNegStock" checked={form.allowNegStock ?? false}
              onChange={(v) => s("allowNegStock", v)} label="Allow Negative Stock"
              hint="Allow stock to go below zero for this item."
            />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Barcodes</SectionTitle>
        <Field label="Barcodes">
          <InlineTable
            columns={[
              { key: "barcode", label: "Barcode", required: true },
              { key: "barcodeType", label: "Barcode Type" },
              { key: "uom", label: "UOM" },
            ]}
            rows={barcodes}
            onAddRow={() => setBarcodes([...barcodes, makeRow(["barcode","barcodeType","uom"])])}
            onRemoveRow={(id) => setBarcodes(barcodes.filter((r) => r.id !== id))}
            renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
          />
        </Field>
      </section>
    </>
  );
}

function PurchasingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [suppliers, setSuppliers] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Default Purchase Unit of Measure">
              <TextInput value={form.purchaseUOM ?? ""} onChange={(v) => s("purchaseUOM", v)} />
            </Field>
            <Field label="Minimum Order Qty" hint="Minimum quantity should be as per Stock UOM">
              <TextInput value={form.minOrderQty ?? "0.000"} onChange={(v) => s("minOrderQty", v)} />
            </Field>
            <Field label="Safety Stock" hint="Minimum stock level to maintain as a buffer.">
              <TextInput value={form.safetyStock ?? "0.000"} onChange={(v) => s("safetyStock", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Lead Time in days" hint="Average time taken by the supplier to deliver">
              <TextInput value={form.leadTime ?? "0"} onChange={(v) => s("leadTime", v)} />
            </Field>
            <Field label="Last Purchase Rate" hint="The rate at which this item was last purchased.">
              <TextInput value={form.lastPurchaseRate ?? "0"} onChange={(v) => s("lastPurchaseRate", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Supplier Details</SectionTitle>
        <CheckField
          id="dropShip" checked={form.dropShip ?? false}
          onChange={(v) => s("dropShip", v)} label="Delivered by Supplier (Drop Ship)"
          hint="Enable for drop shipping - supplier delivers directly to the customer."
        />
        <div style={{ marginTop: 16 }}>
          <Field label="Item Supplier">
            <InlineTable
              columns={[
                { key: "supplier", label: "Supplier", required: true },
                { key: "supplierPartNumber", label: "Supplier Part Number" },
              ]}
              rows={suppliers}
              onAddRow={() => setSuppliers([...suppliers, makeRow(["supplier","supplierPartNumber"])])}
              onRemoveRow={(id) => setSuppliers(suppliers.filter((r) => r.id !== id))}
              renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
            />
          </Field>
        </div>
      </section>
    </>
  );
}

function SalesTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [customers, setCustomers] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Default Sales Unit of Measure">
              <TextInput value={form.salesUOM ?? ""} onChange={(v) => s("salesUOM", v)} />
            </Field>
            <CheckField
              id="grantCommission" checked={form.grantCommission ?? true}
              onChange={(v) => s("grantCommission", v)} label="Grant Commission"
            />
          </div>
          <div className="itf-col">
            <Field label="Max Discount (%)" hint="Maximum discount % allowed when selling this item.">
              <TextInput value={form.maxDiscount ?? "0.000"} onChange={(v) => s("maxDiscount", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Customer Details</SectionTitle>
        <Field label="Customer Items">
          <InlineTable
            columns={[
              { key: "customerName", label: "Customer Name" },
              { key: "customerGroup", label: "Customer Group" },
              { key: "refCode", label: "Ref Code", required: true },
            ]}
            rows={customers}
            onAddRow={() => setCustomers([...customers, makeRow(["customerName","customerGroup","refCode"])])}
            onRemoveRow={(id) => setCustomers(customers.filter((r) => r.id !== id))}
            renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
          />
        </Field>
      </section>
    </>
  );
}

function ManufacturingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField
              id="includeInMfg" checked={form.includeInMfg ?? true}
              onChange={(v) => s("includeInMfg", v)} label="Include Item In Manufacturing"
              hint="Enable for raw material items used in BOM."
            />
            <CheckField
              id="isSubcontracted" checked={form.isSubcontracted ?? false}
              onChange={(v) => s("isSubcontracted", v)} label="Is Subcontracted Item"
              hint="Enable if a vendor manufactures this item for you."
            />
          </div>
          <div className="itf-col">
            <Field label="Production Capacity">
              <TextInput value={form.productionCapacity ?? "0"} onChange={(v) => s("productionCapacity", v)} />
            </Field>
          </div>
        </div>
      </section>
    </>
  );
}

function QualityTab() {
  return (
    <>
      <section className="itf-section">
        <SectionTitle>Quality</SectionTitle>
        <div className="itf-empty-state">No quality inspection templates configured.</div>
      </section>
    </>
  );
}

function PricingTab() {
  return (
    <>
      <section className="itf-section">
        <SectionTitle>Item Prices</SectionTitle>
        <p className="itf-hint" style={{ marginBottom: 16 }}>All active prices for this item across buying and selling price lists.</p>
        <div className="itf-empty-box">
          <p className="itf-empty-box-text">No active item prices found.</p>
          <button className="itf-add-price-btn">+ Add Price</button>
        </div>
      </section>
    </>
  );
}

function ConnectionsTab() {
  const groups = [
    { label: "Groups", items: ["BOM", "Product Bundle", "Item Alternative"] },
    { label: "Pricing", items: ["Item Price", "Pricing Rule"] },
    { label: "Sell", items: ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"] },
  ];
  const groups2 = [
    { label: "Buy", items: ["Material Request", "Supplier Quotation", "Request for Quotation", "Purchase Order", "Purchase Receipt", "Purchase Invoice"] },
    { label: "Manufacture", items: ["Production Plan", "Work Order", "Item Manufacturer"] },
    { label: "Traceability", items: ["Serial No", "Batch"] },
  ];
  const stockMovement = ["Stock Entry", "Stock Reconciliation"];
  const leadTime = ["Item Lead Time"];

  return (
    <>
      <section className="itf-section">
        <div className="itf-conn-activity-header">
          <span className="itf-section-title" style={{ margin: 0 }}>Activity</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </div>
        <div className="itf-heatmap">
          {["JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR","APR","MAY","JUN"].map((m) => (
            <div key={m} className="itf-heatmap-col">
              <div className="itf-heatmap-month">{m}</div>
              {["Mon","","Wed","","Fri"].map(( i) => (
                <div key={i} className="itf-heatmap-row">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="itf-heatmap-cell" />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="itf-hint" style={{ marginTop: 8 }}>This is based on stock movement. See Stock Ledger for details</p>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          {groups.map((g) => (
            <div key={g.label} className="itf-conn-group">
              <div className="itf-conn-group-title">{g.label}</div>
              {g.items.map((item) => (
                <div key={item} className="itf-conn-item">
                  <span>{item}</span>
                  <button className="itf-conn-add">+</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          {groups2.map((g) => (
            <div key={g.label} className="itf-conn-group">
              <div className="itf-conn-group-title">{g.label}</div>
              {g.items.map((item) => (
                <div key={item} className="itf-conn-item">
                  <span>{item}</span>
                  <button className="itf-conn-add">+</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          <div className="itf-conn-group">
            <div className="itf-conn-group-title">Stock Movement</div>
            {stockMovement.map((item) => (
              <div key={item} className="itf-conn-item">
                <span>{item}</span>
                <button className="itf-conn-add">+</button>
              </div>
            ))}
          </div>
          <div className="itf-conn-group">
            <div className="itf-conn-group-title">Lead Time</div>
            {leadTime.map((item) => (
              <div key={item} className="itf-conn-item">
                <span>{item}</span>
                <button className="itf-conn-add">+</button>
              </div>
            ))}
          </div>
          <div className="itf-conn-group" />
        </div>
      </section>
    </>
  );
}

/* ── Main Component ─────────────────────────── */

export default function ItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useAdminTheme();
  
  const isNew = id === "new" || !id;
  const itemCode = isNew ? "" : decodeURIComponent(id ?? "");
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const tabs = [
    { id: 0, name: 'Details', icon: <FaTag size={14} /> },
    { id: 1, name: 'Accounting', icon: <FaDollarSign size={14} /> },
    { id: 2, name: 'UOM', icon: <FaCube size={14} /> },
    { id: 3, name: 'Tax', icon: <FaList size={14} /> },
    { id: 4, name: 'Inventory', icon: <FaBoxes size={14} /> },
    { id: 5, name: 'Purchasing', icon: <FaTruck size={14} /> },
    { id: 6, name: 'Sales', icon: <FaShoppingCart size={14} /> },
    { id: 7, name: 'Manufacturing', icon: <FaIndustry size={14} /> },
    { id: 8, name: 'Quality', icon: <FaClipboardCheck size={14} /> },
    { id: 9, name: 'Pricing', icon: <FaDollarSign size={14} /> },
    { id: 10, name: 'Connections', icon: <FaLink size={14} /> },
  ];

  // Get data from location state (from ItemList)
  const itemData = location.state?.itemData as ItemData | undefined;
  const prefillData = location.state?.prefill as any | undefined;

  const [form, setFormRaw] = useState({
    itemName: "",
    itemCode: "",
    itemGroup: "",
    hsnSac: "",
    defaultUOM: "Nos",
    disabled: false,
    maintainStock: true,
    isFixedAsset: false,
    allowSales: true,
    allowPurchase: true,
    allowAltItem: false,
    isCustomerProvided: false,
    hasVariants: false,
    overDelivery: "0.000",
    overBilling: "0.000",
    grantCommission: true,
    includeInMfg: true,
    isSubcontracted: false,
    productionCapacity: "0",
    brand: "",
    description: "",
    valuationMethod: "FIFO",
    valuationRate: "0.00",
  });

  const setForm = (f: any) => { setFormRaw(f); setIsDirty(true); };

  // Fetch item data if editing
  useEffect(() => {
    if (!isNew && itemCode) {
      // If we have data from location state, use it
      if (itemData) {
        setFormRaw({
          itemName: itemData.item_name || "",
          itemCode: itemData.item_code || "",
          itemGroup: itemData.item_group || "",
          hsnSac: itemData.hsn_sac || "",
          defaultUOM: itemData.stock_uom || "Nos",
          disabled: itemData.disabled === 1,
          maintainStock: itemData.is_stock_item === 1,
          isFixedAsset: itemData.is_fixed_asset === 1,
          allowSales: itemData.is_sales_item === 1,
          allowPurchase: itemData.is_purchase_item === 1,
          allowAltItem: false,
          isCustomerProvided: false,
          hasVariants: false,
          overDelivery: "0.000",
          overBilling: "0.000",
          grantCommission: true,
          includeInMfg: true,
          isSubcontracted: false,
          productionCapacity: "0",
          brand: itemData.brand || "",
          description: itemData.description || "",
          valuationMethod: itemData.valuation_method || "FIFO",
          valuationRate: "0.00",
        });
        setIsDirty(false);
      } else {
        // Fetch from API if no location state
        fetchItemData();
      }
    } else if (isNew && prefillData) {
      // Prefill from quick add
      setFormRaw({
        itemName: prefillData.itemName || "",
        itemCode: prefillData.itemCode || "",
        itemGroup: prefillData.itemGroup || "",
        hsnSac: prefillData.hsnSac || "",
        defaultUOM: prefillData.defaultUOM || "Nos",
        disabled: false,
        maintainStock: prefillData.maintainStock ?? true,
        isFixedAsset: prefillData.isFixedAsset ?? false,
        allowSales: true,
        allowPurchase: true,
        allowAltItem: false,
        isCustomerProvided: false,
        hasVariants: false,
        overDelivery: "0.000",
        overBilling: "0.000",
        grantCommission: true,
        includeInMfg: true,
        isSubcontracted: false,
        productionCapacity: "0",
        brand: "",
        description: "",
        valuationMethod: "FIFO",
        valuationRate: "0.00",
      });
    }
  }, [isNew, itemCode, itemData, prefillData]);

  const fetchItemData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/item/${itemCode}`);
      if (response.data.success === 1) {
        const data = response.data.data;
        setFormRaw({
          itemName: data.item_name || "",
          itemCode: data.item_code || "",
          itemGroup: data.item_group || "",
          hsnSac: data.hsn_sac || "",
          defaultUOM: data.stock_uom || "Nos",
          disabled: data.disabled === 1,
          maintainStock: data.is_stock_item === 1,
          isFixedAsset: data.is_fixed_asset === 1,
          allowSales: data.is_sales_item === 1,
          allowPurchase: data.is_purchase_item === 1,
          allowAltItem: false,
          isCustomerProvided: false,
          hasVariants: false,
          overDelivery: "0.000",
          overBilling: "0.000",
          grantCommission: true,
          includeInMfg: true,
          isSubcontracted: false,
          productionCapacity: "0",
          brand: data.brand || "",
          description: data.description || "",
          valuationMethod: data.valuation_method || "FIFO",
          valuationRate: "0.00",
        });
        setIsDirty(false);
      }
    } catch (err) {
      console.error('Error fetching item:', err);
      toast.error('Failed to load item data');
    } finally {
      setLoading(false);
    }
  };

  const tabProps = { form, setForm };

  // ─── Validation ──────────────────────────────────────
  const getAllValidationErrors = (): ValidationError[] => {
    const allErrors: ValidationError[] = [];

    // Tab 0 — Details
    if (!form.itemName.trim())
      allErrors.push({ field: 'itemName', label: 'Item Name', message: 'Item name is required', tabIndex: 0 });
    if (!form.itemGroup.trim())
      allErrors.push({ field: 'itemGroup', label: 'Item Group', message: 'Item group is required', tabIndex: 0 });
    if (!form.defaultUOM.trim())
      allErrors.push({ field: 'defaultUOM', label: 'Default UOM', message: 'Default unit of measure is required', tabIndex: 0 });

    return allErrors;
  };

  const getTabErrorCount = (tabId: number): number => {
    return getAllValidationErrors().filter(e => e.tabIndex === tabId).length;
  };

  const jumpToTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    setShowValidationSummary(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <DetailsTab {...tabProps} />;
      case 1: return <AccountingTab {...tabProps} />;
      case 2: return <UOMTab {...tabProps} />;
      case 3: return <TaxTab {...tabProps} />;
      case 4: return <InventoryTab {...tabProps} />;
      case 5: return <PurchasingTab {...tabProps} />;
      case 6: return <SalesTab {...tabProps} />;
      case 7: return <ManufacturingTab {...tabProps} />;
      case 8: return <QualityTab />;
      case 9: return <PricingTab />;
      case 10: return <ConnectionsTab />;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const allErrors = getAllValidationErrors();
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setShowValidationSummary(true);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        item_code: form.itemCode || form.itemName.toUpperCase().replace(/\s+/g, '-'),
        item_name: form.itemName.trim(),
        item_group: form.itemGroup.trim(),
        stock_uom: form.defaultUOM.trim(),
        description: form.description || form.itemName.trim(),
        is_stock_item: form.maintainStock ? 1 : 0,
        is_sales_item: form.allowSales ? 1 : 0,
        is_purchase_item: form.allowPurchase ? 1 : 0,
        brand: form.brand || null,
        valuation_method: form.valuationMethod || "FIFO",
        disabled: form.disabled ? 1 : 0,
        is_fixed_asset: form.isFixedAsset ? 1 : 0,
        hsn_sac: form.hsnSac || null,
      };

      let response;
      if (isNew) {
        response = await api.post('/item', payload);
      } else {
        response = await api.put(`/item/${itemCode}`, payload);
      }

      if (response.data && response.data.success === 1) {
        setIsDirty(false);
        toast.success(isNew ? 'Item created successfully!' : 'Item updated successfully!');
        navigate('/item-list');
      } else {
        toast.error(response.data?.message || 'Failed to save item');
      }
    } catch (err: any) {
      console.error('Error saving item:', err);
      if (err.response?.status === 409) {
        toast.error('An item with this code already exists');
      } else {
        toast.error(err.response?.data?.message || 'Failed to save item');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const allValidationErrors = getAllValidationErrors();
  const hasAnyErrors = allValidationErrors.length > 0;

  if (loading) {
    return (
      <div className={`itf-page ${theme}`}>
        <div className="itf-loading-state">
          <FaSpinner className="spinning" size={32} />
          <p>Loading item data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`itf-page ${theme}`}>
      {/* Validation Summary Modal */}
      {showValidationSummary && validationErrors.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowValidationSummary(false)}>
          <div className="validation-summary-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderBottomColor: '#fbbf24' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                <FaExclamationTriangle /> Missing Required Fields
              </h2>
              <button className="modal-close" onClick={() => setShowValidationSummary(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Please fill in the following required fields before submitting:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {validationErrors.map((error, idx) => (
                  <div
                    key={idx}
                    className="validation-error-item"
                    onClick={() => jumpToTab(error.tabIndex)}
                  >
                    <div className="error-header">
                      <FaTimesCircle style={{ color: '#ef4444', flexShrink: 0 }} />
                      <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{error.label}</strong>
                      <span className="error-tab">
                        Tab {error.tabIndex + 1}: {tabs[error.tabIndex].name}
                      </span>
                    </div>
                    <div className="error-message">{error.message}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '10px 12px', background: '#fef3c7', borderRadius: '8px', fontSize: '11px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaInfoCircle style={{ flexShrink: 0 }} />
                Click on any error to jump to that section
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowValidationSummary(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="itf-topbar">
        <div className="itf-breadcrumb">
          <button onClick={() => navigate('/item-list')} className="itf-back-btn">
            <FaArrowLeft size={12} /> Back
          </button>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-link" onClick={() => navigate("/item-list")}>Stock</span>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-link" onClick={() => navigate("/item-list")}>Item</span>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-current">{isNew ? "New Item" : form.itemName || itemCode}</span>
          {!isNew && !form.disabled && <span className="itf-status-pill enabled">Enabled</span>}
          {!isNew && form.disabled && <span className="itf-status-pill disabled">Disabled</span>}

          {hasAnyErrors && (
            <div className="itf-error-badge">
              <FaExclamationTriangle size={11} />
              {allValidationErrors.length} missing field(s)
            </div>
          )}
        </div>
        <div className="itf-topbar-right">
          {!isNew && (
            <>
              <button className="itf-btn-outline">View
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="itf-btn-outline">Duplicate</button>
              <button className="itf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="itf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="itf-btn-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </button>
            </>
          )}
          <button className="itf-btn-save" onClick={handleSave} disabled={submitting}>
            {submitting && <FaSpinner className="spinning" />}
            <FaSave size={12} /> Save
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="itf-tab-bar">
        <div className="itf-tabs-container">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const errorCount = getTabErrorCount(tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                className={`itf-tab ${isActive ? 'itf-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="itf-tab-content">
                  <div className={`itf-tab-icon ${isActive ? 'itf-tab-icon-active' : ''}`}>
                    {tab.icon}
                    {errorCount > 0 && !isActive && (
                      <span className="itf-tab-error-badge">{errorCount}</span>
                    )}
                  </div>
                  <span className="itf-tab-label">{tab.name}</span>
                </div>
                {isActive && <div className="itf-tab-indicator" />}
              </button>
            );
          })}
        </div>
        <div className="itf-tab-bar-actions">
          <button className="itf-btn-icon" title="Edit"><FaEdit size={12} /></button>
          <button className="itf-btn-icon" title="Print">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
          <button className="itf-btn-icon" title="Favourite">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="itf-body">
        <div className="itf-main">
          {renderTab()}
        </div>

        {/* Right sidebar - only for existing items */}
        {!isNew && (
          <aside className="itf-sidebar">
            <div className="itf-doc-avatar">{form.itemName.charAt(0).toUpperCase() || 'I'}</div>
            <div className="itf-doc-name">{form.itemName || itemCode}</div>
            <div className="itf-doc-id">{form.itemCode || itemCode}</div>

            <div className="itf-sidebar-actions">
              <button className="itf-sidebar-action">
                <SidebarIcon label="Assign" />
                Assign
                <span className="itf-sidebar-plus">+</span>
              </button>
              <button className="itf-sidebar-action">
                <SidebarIcon label="Attachments" />
                Attachments
                <span className="itf-sidebar-plus">+</span>
              </button>
              <button className="itf-sidebar-action">
                <SidebarIcon label="Tags" />
                Tags
                <span className="itf-sidebar-plus">+</span>
              </button>
              <button className="itf-sidebar-action">
                <SidebarIcon label="Share" />
                Share
                <span className="itf-sidebar-plus">+</span>
              </button>
            </div>

            <div className="itf-sidebar-meta">
              <div className="itf-meta-row"><span className="itf-meta-label">Last Edited By</span><span className="itf-meta-val">You</span></div>
              <div className="itf-meta-time">Just now</div>
              <div className="itf-meta-row" style={{ marginTop: 12 }}><span className="itf-meta-label">Created By</span><span className="itf-meta-val">You</span></div>
              <div className="itf-meta-time">Just now</div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function SidebarIcon({ label }: { label: string }) {
  const icons: Record<string, React.ReactNode> = {
    Assign: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Attachments: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
    Tags: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    Share: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  };
  return <>{icons[label]}</>;
}