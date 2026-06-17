import React, { useEffect, useRef, useState } from "react";
import {
  Home,
  ChevronDown,
  RefreshCw,
  MoreHorizontal,
  Plus,
  Filter as FilterIcon,
  X,
  ArrowUpDown,
  FileStack,
  Check,
  MessageCircle,
  Heart,
} from "lucide-react";
import "./BOMPage.css";
import NewBOMPage from "./Newbompage";

// ─── Constants ────────────────────────────────────────────────────────────────

const BOM_ITEMS = [
  "Table",
  "Chair",
  "Desk",
  "Shelf",
  "Cabinet",
];

const SORT_FIELDS = ["Created On", "Last Updated On", "ID", "Item to Manufacture"];

const FILTER_FIELDS = [
  "ID",
  "Item to Manufacture",
  "Is Active",
  "Is Default",
  "Company",
  "Series",
];

const FILTER_OPERATORS = ["Equals", "Not Equals", "Like", "In", "Not In"];

const ID_OPERATORS = ["Equals", "Like"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BOMRow {
  id: string;
  status: "Draft" | "Active" | "Disabled";
  itemToManufacture: string;
  isActive: boolean;
  isDefault: boolean;
  totalCost: string;
  hasVariants: boolean;
  createdOn: string;
  comments: number;
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const BOM_DATA: BOMRow[] = [
  {
    id: "BOM-46-001",
    status: "Draft",
    itemToManufacture: "Table2",
    isActive: true,
    isDefault: true,
    totalCost: "₹ 0.00",
    hasVariants: false,
    createdOn: "1d ago",
    comments: 0,
  },
  {
    id: "BOM-chair-001",
    status: "Draft",
    itemToManufacture: "Chair",
    isActive: true,
    isDefault: true,
    totalCost: "₹ 0.00",
    hasVariants: false,
    createdOn: "1d ago",
    comments: 0,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ColumnFilterProps {
  label: string;
  accent: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  showChevron?: boolean;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  label,
  accent,
  isOpen,
  onToggle,
  children,
  showChevron = true,
}) => (
  <div className="col-filter-wrap">
    <button
      className={`col-filter ${isOpen ? "col-filter--open" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onToggle}
    >
      <span className="col-filter__dot" />
      <span className="col-filter__label">{label}</span>
      {showChevron && <ChevronDown size={13} className="col-filter__chev" />}
    </button>
    {isOpen && children}
  </div>
);

interface SelectMenuProps {
  items: string[];
  selected: string | null;
  onSelect: (v: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ items, selected, onSelect }) => (
  <div className="menu menu--list">
    {items.map((item) => (
      <div
        key={item}
        className={`menu__item ${selected === item ? "menu__item--active" : ""}`}
        onClick={() => onSelect(item)}
      >
        {selected === item ? (
          <Check size={14} className="menu__check" />
        ) : (
          <span style={{ width: 14 }} />
        )}
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const CheckBadge: React.FC<{ checked: boolean }> = ({ checked }) => (
  <div className={`check-badge ${checked ? "check-badge--on" : ""}`}>
    {checked && <Check size={12} color="#fff" strokeWidth={3} />}
  </div>
);

const ToggleDot: React.FC<{ on: boolean }> = ({ on }) => (
  <div className={`toggle-dot ${on ? "toggle-dot--on" : ""}`} />
);

// ─── Main component ───────────────────────────────────────────────────────────

const BOMPage: React.FC = () => {
  const [showNewBOM, setShowNewBOM] = useState(false);

  // view / meta dropdowns
  const [listViewOpen, setListViewOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // column filters
  const [idOpOpen, setIdOpOpen] = useState(false);
  const [idOperator, setIdOperator] = useState("Like");
  const [itemOpen, setItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeOpen, setActiveOpen] = useState(false);
  const [selectedActive, setSelectedActive] = useState<string | null>(null);

  // filter panel
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterField, setFilterField] = useState("ID");
  const [filterOperator, setFilterOperator] = useState("Equals");
  const [filterValue, setFilterValue] = useState("");
  const [filterFieldOpen, setFilterFieldOpen] = useState(false);
  const [filterOperatorOpen, setFilterOperatorOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);

  // sort
  const [sortOpen, setSortOpen] = useState(false);
  const [sortField, setSortField] = useState("Created On");
  const [sortAsc, setSortAsc] = useState(false);

  // pagination
  const [pageSize, setPageSize] = useState(20);

  // selected rows
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const rootRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => {
    setListViewOpen(false);
    setSavedFiltersOpen(false);
    setMoreOpen(false);
    setIdOpOpen(false);
    setItemOpen(false);
    setActiveOpen(false);
    setFilterPanelOpen(false);
    setFilterFieldOpen(false);
    setFilterOperatorOpen(false);
    setSortOpen(false);
  };

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean
  ) => {
    closeAll();
    setter(!current);
  };

  const applyFilters = () => {
    setAppliedFilters(filterValue.trim() ? 1 : 0);
    setFilterPanelOpen(false);
  };

  const clearFilters = () => {
    setFilterField("ID");
    setFilterOperator("Equals");
    setFilterValue("");
    setAppliedFilters(0);
    setFilterPanelOpen(false);
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected =
    BOM_DATA.length > 0 && selectedRows.size === BOM_DATA.length;

  const toggleAll = () => {
    setSelectedRows(allSelected ? new Set() : new Set(BOM_DATA.map((r) => r.id)));
  };

  return (
    <>
      {showNewBOM && <NewBOMPage onBack={() => setShowNewBOM(false)} />}
      {!showNewBOM && (
    <div className="bom-page" ref={rootRef}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bom-header">
        <div className="bom-breadcrumb">
          <button className="bom-breadcrumb__home" title="Home">
            <Home size={14} />
          </button>
          <span className="bom-breadcrumb__sep">/</span>
          <span className="bom-breadcrumb__crumb">Manufacturing</span>
          <span className="bom-breadcrumb__sep">/</span>
          <span className="bom-breadcrumb__crumb bom-breadcrumb__crumb--active">
            Bill of Materials
          </span>
        </div>

        <div className="bom-actions">
          {/* List View */}
          <div className="dropdown">
            <button
              className="pill pill--blue"
              onClick={() => toggle(setListViewOpen, listViewOpen)}
            >
              <span className="pill__icon">
                <FileStack size={14} />
              </span>
              List View
              <ChevronDown size={14} className="pill__chev" />
            </button>
            {listViewOpen && (
              <div className="menu menu--sm">
                {["List View", "Report View", "Kanban", "Calendar", "Gantt"].map(
                  (v) => (
                    <div className="menu__item" key={v}>
                      {v === "List View" && (
                        <Check size={14} className="menu__check" />
                      )}
                      <span>{v}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Saved Filters */}
          <div className="dropdown">
            <button
              className="pill pill--violet"
              onClick={() => toggle(setSavedFiltersOpen, savedFiltersOpen)}
            >
              Saved Filters
              <ChevronDown size={14} className="pill__chev" />
            </button>
            {savedFiltersOpen && (
              <div className="menu menu--sm">
                <div className="menu__empty">No saved filters yet</div>
              </div>
            )}
          </div>

          <button className="icon-btn icon-btn--teal" title="Refresh">
            <RefreshCw size={15} />
          </button>

          {/* More */}
          <div className="dropdown">
            <button
              className="icon-btn icon-btn--slate"
              onClick={() => toggle(setMoreOpen, moreOpen)}
              title="More options"
            >
              <MoreHorizontal size={15} />
            </button>
            {moreOpen && (
              <div className="menu menu--sm menu--right">
                {["Import", "Export", "Settings", "Reload"].map((v) => (
                  <div className="menu__item" key={v}>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowNewBOM(true)}
          >
            <Plus size={15} />
            Add BOM
          </button>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="bom-toolbar">
        <div className="bom-columns">
          {/* ID column filter */}
          <div className="col-filter-wrap">
            <div
              className="col-filter id-filter"
              style={{ "--accent": "var(--c-id)" } as React.CSSProperties}
            >
              <span className="col-filter__dot" />
              <span className="col-filter__label">ID</span>
              <button
                className="id-filter__op-btn"
                title="Filter operator"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(setIdOpOpen, idOpOpen);
                }}
              >
                <span className={idOperator === "Like" ? "id-filter__approx" : ""}>
                  {idOperator === "Like" ? "≈" : "="}
                </span>
              </button>
            </div>
            {idOpOpen && (
              <div className="menu menu--narrow id-op-menu">
                {ID_OPERATORS.map((op) => (
                  <div
                    key={op}
                    className={`menu__item ${idOperator === op ? "menu__item--active" : ""}`}
                    onClick={() => {
                      setIdOperator(op);
                      setIdOpOpen(false);
                    }}
                  >
                    {idOperator === op ? (
                      <Check size={14} className="menu__check" />
                    ) : (
                      <span style={{ width: 14 }} />
                    )}
                    <span>{op}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item to Manufacture */}
          <ColumnFilter
            label={selectedItem ?? "Item to Manufacture"}
            accent="var(--c-item)"
            isOpen={itemOpen}
            onToggle={() => toggle(setItemOpen, itemOpen)}
          >
            <SelectMenu
              items={BOM_ITEMS}
              selected={selectedItem}
              onSelect={(v) => {
                setSelectedItem(v);
                setItemOpen(false);
              }}
            />
          </ColumnFilter>

          {/* Is Active */}
          <ColumnFilter
            label={selectedActive ?? "Is Active"}
            accent="var(--c-active)"
            isOpen={activeOpen}
            onToggle={() => toggle(setActiveOpen, activeOpen)}
          >
            <SelectMenu
              items={["Yes", "No"]}
              selected={selectedActive}
              onSelect={(v) => {
                setSelectedActive(v);
                setActiveOpen(false);
              }}
            />
          </ColumnFilter>
        </div>

        {/* Filter + Sort */}
        <div className="bom-controls">
          <div className="dropdown">
            <button
              className={`filter-btn ${appliedFilters > 0 ? "filter-btn--active" : ""} ${filterPanelOpen ? "filter-btn--open" : ""}`}
              onClick={() => toggle(setFilterPanelOpen, filterPanelOpen)}
            >
              <FilterIcon size={13} />
              Filter
              {appliedFilters > 0 && (
                <span className="filter-btn__badge">{appliedFilters}</span>
              )}
            </button>
            {appliedFilters > 0 && (
              <button
                className="filter-clear"
                title="Clear filters"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}
              >
                <X size={13} />
              </button>
            )}

            {filterPanelOpen && (
              <div className="filter-panel">
                <div className="filter-row">
                  {/* Field */}
                  <div className="dropdown filter-row__field">
                    <button
                      className="filter-select"
                      onClick={() => toggle(setFilterFieldOpen, filterFieldOpen)}
                    >
                      {filterField}
                      <ChevronDown size={13} />
                    </button>
                    {filterFieldOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_FIELDS.map((f) => (
                          <div
                            key={f}
                            className={`menu__item ${filterField === f ? "menu__item--active" : ""}`}
                            onClick={() => {
                              setFilterField(f);
                              setFilterFieldOpen(false);
                            }}
                          >
                            {filterField === f ? (
                              <Check size={14} className="menu__check" />
                            ) : (
                              <span style={{ width: 14 }} />
                            )}
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Operator */}
                  <div className="dropdown filter-row__op">
                    <button
                      className="filter-select"
                      onClick={() =>
                        toggle(setFilterOperatorOpen, filterOperatorOpen)
                      }
                    >
                      {filterOperator}
                      <ChevronDown size={13} />
                    </button>
                    {filterOperatorOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_OPERATORS.map((op) => (
                          <div
                            key={op}
                            className={`menu__item ${filterOperator === op ? "menu__item--active" : ""}`}
                            onClick={() => {
                              setFilterOperator(op);
                              setFilterOperatorOpen(false);
                            }}
                          >
                            {filterOperator === op ? (
                              <Check size={14} className="menu__check" />
                            ) : (
                              <span style={{ width: 14 }} />
                            )}
                            <span>{op}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    className="filter-input"
                    placeholder="Value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                  <button
                    className="filter-remove"
                    title="Remove filter"
                    onClick={() => setFilterValue("")}
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="filter-panel__footer">
                  <button className="link-btn">+ Add a Filter</button>
                  <div className="filter-panel__footer-actions">
                    <button className="btn-ghost" onClick={clearFilters}>
                      Clear Filters
                    </button>
                    <button className="btn-dark" onClick={applyFilters}>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="dropdown">
            <button
              className="sort-btn"
              onClick={() => toggle(setSortOpen, sortOpen)}
            >
              <ArrowUpDown
                size={14}
                className={`sort-btn__icon ${sortAsc ? "sort-btn__icon--asc" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSortAsc((s) => !s);
                }}
              />
              {sortField}
              <ChevronDown size={13} />
            </button>
            {sortOpen && (
              <div className="menu menu--list menu--narrow menu--right">
                {SORT_FIELDS.map((f) => (
                  <div
                    key={f}
                    className={`menu__item ${sortField === f ? "menu__item--active" : ""}`}
                    onClick={() => {
                      setSortField(f);
                      setSortOpen(false);
                    }}
                  >
                    {sortField === f ? (
                      <Check size={14} className="menu__check" />
                    ) : (
                      <span style={{ width: 14 }} />
                    )}
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="bom-table-wrap">
        <table className="bom-table">
          <thead>
            <tr>
              <th className="cb-col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th>ID</th>
              <th>Status</th>
              <th>Item to Manufacture</th>
              <th>Is Active</th>
              <th>Is Default</th>
              <th>Total Cost</th>
              <th>Has Variants</th>
              <th>Created On</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {BOM_DATA.map((row) => (
              <tr key={row.id}>
                <td className="cb-col">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                <td>
                  <a
                    className="bom-id-link"
                    href={`/bom/${row.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("open bom", row.id);
                    }}
                  >
                    {row.id}
                  </a>
                </td>
                <td>
                  <span className="status-pill">{row.status}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{row.itemToManufacture}</td>
                <td>
                  <CheckBadge checked={row.isActive} />
                </td>
                <td>
                  <CheckBadge checked={row.isDefault} />
                </td>
                <td className="bom-cost">{row.totalCost}</td>
                <td>
                  <ToggleDot on={row.hasVariants} />
                </td>
                <td className="bom-muted">{row.createdOn}</td>
                <td className="meta-cell">
                  <div className="meta-inner">
                    <MessageCircle size={14} />
                    <span>{row.comments}</span>
                    <Heart size={14} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="bom-footer">
        <span className="bom-footer__count">{BOM_DATA.length} records</span>
        <div className="pagination-box">
          {[20, 100, 500, 2500].map((size) => (
            <button
              key={size}
              className={`page-size ${pageSize === size ? "page-size--active" : ""}`}
              onClick={() => setPageSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default BOMPage;