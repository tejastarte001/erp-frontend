import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
} from "lucide-react";
import "./Stockentry.css";

const STOCK_ENTRY_TYPES = [
  "Disassemble",
  "Manufacture",
  "Material Consumption for Manufacture",
  "Material Issue",
  "Material Receipt",
  "Material Transfer",
  "Material Transfer for Manufacture",
  "Receive from Customer",
  "Repack",
  "Send to Subcontractor",
];

const WAREHOUSES = [
  "All Warehouses - T",
  "Finished Goods - T",
  "Goods In Transit - T",
  "Stores - T",
  "Work In Progress - T",
];

const ID_OPERATORS = ["Equals", "Like"];
const SORT_FIELDS = ["Created On", "Last Updated On", "ID", "Stock Entry Type"];
const FILTER_FIELDS = [
  "ID",
  "Stock Entry Type",
  "Default Source Warehouse",
  "Default Target Warehouse",
  "Company",
  "Series",
];
const FILTER_OPERATORS = ["Equals", "Not Equals", "Like", "In", "Not In"];

interface ColumnFilterProps {
  label: string;
  accent: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ label, accent, icon, isOpen, onToggle, children }) => (
  <div className="col-filter-wrap">
    <button
      className={`col-filter ${isOpen ? "col-filter--open" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onToggle}
    >
      <span className="col-filter__dot" />
      <span className="col-filter__label">{label}</span>
      {icon}
    </button>
    {isOpen && children}
  </div>
);

interface SelectMenuProps {
  items: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  createLabel?: string;
  showAdvancedSearch?: boolean;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ items, selected, onSelect, createLabel, showAdvancedSearch }) => (
  <div className="menu menu--list">
    {items.map((item) => (
      <div
        className={`menu__item ${selected === item ? "menu__item--active" : ""}`}
        key={item}
        onClick={() => onSelect(item)}
      >
        {selected === item && <Check size={14} className="menu__check" />}
        <span>{item}</span>
      </div>
    ))}
    {(createLabel || showAdvancedSearch) && (
      <div className="menu__footer">
        {createLabel && (
          <div className="menu__item menu__item--action menu__item--create">
            <Plus size={14} className="menu__item--action-icon" />
            <span>{createLabel}</span>
          </div>
        )}
        {showAdvancedSearch && (
          <div className="menu__item menu__item--action menu__item--search">
            <Search size={14} className="menu__item--action-icon" />
            <span>Advanced Search</span>
          </div>
        )}
      </div>
    )}
  </div>
);

const Stockentry: React.FC = () => {
  const navigate = useNavigate();

  const [listViewOpen, setListViewOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [idOpOpen, setIdOpOpen] = useState(false);
  const [idOperator, setIdOperator] = useState("Like");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [targetOpen, setTargetOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterField, setFilterField] = useState("ID");
  const [filterOperator, setFilterOperator] = useState("Equals");
  const [filterValue, setFilterValue] = useState("");
  const [filterFieldOpen, setFilterFieldOpen] = useState(false);
  const [filterOperatorOpen, setFilterOperatorOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortField, setSortField] = useState("Created On");
  const [sortAsc, setSortAsc] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => {
    setListViewOpen(false); setSavedFiltersOpen(false); setMoreOpen(false);
    setIdOpOpen(false); setTypeDropdownOpen(false); setSourceOpen(false);
    setTargetOpen(false); setFilterPanelOpen(false); setFilterFieldOpen(false);
    setFilterOperatorOpen(false); setSortOpen(false);
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    closeAll();
    setter(!current);
  };

  const applyFilters = () => { setAppliedFilters(filterValue.trim() ? 1 : 0); setFilterPanelOpen(false); };
  const clearFilters = () => { setFilterField("ID"); setFilterOperator("Equals"); setFilterValue(""); setAppliedFilters(0); setFilterPanelOpen(false); };

  return (
    <div className="se-page" ref={rootRef}>
      <div className="se-header">
        <div className="se-breadcrumb">
          <button className="se-breadcrumb__home" title="Home"><Home size={15} /></button>
          <span className="se-breadcrumb__sep">/</span>
          <span className="se-breadcrumb__crumb">Stock</span>
          <span className="se-breadcrumb__sep">/</span>
          <span className="se-breadcrumb__crumb se-breadcrumb__crumb--active">Stock Entry</span>
        </div>

        <div className="se-actions">
          <div className="dropdown">
            <button className="pill pill--blue" onClick={() => toggle(setListViewOpen, listViewOpen)}>
              <span className="pill__icon"><FileStack size={14} /></span>
              List View
              <ChevronDown size={14} className="pill__chev" />
            </button>
            {listViewOpen && (
              <div className="menu menu--sm">
                {["List View", "Report View", "Kanban", "Calendar", "Gantt"].map((v) => (
                  <div className="menu__item" key={v}>
                    {v === "List View" && <Check size={14} className="menu__check" />}
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="pill pill--violet" onClick={() => toggle(setSavedFiltersOpen, savedFiltersOpen)}>
              Saved Filters
              <ChevronDown size={14} className="pill__chev" />
            </button>
            {savedFiltersOpen && (
              <div className="menu menu--sm">
                <div className="menu__empty">No saved filters yet</div>
              </div>
            )}
          </div>

          <button className="icon-btn icon-btn--teal" title="Refresh"><RefreshCw size={16} /></button>

          <div className="dropdown">
            <button className="icon-btn icon-btn--slate" onClick={() => toggle(setMoreOpen, moreOpen)} title="More options">
              <MoreHorizontal size={16} />
            </button>
            {moreOpen && (
              <div className="menu menu--sm menu--right">
                {["Import", "Export", "Settings", "Reload"].map((v) => (
                  <div className="menu__item" key={v}><span>{v}</span></div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={() => navigate("/stock-entry/new")}>
            <Plus size={16} />
            Add Stock Entry
          </button>
        </div>
      </div>

      <div className="se-toolbar">
        <div className="se-columns">
          <div className="col-filter-wrap">
            <div className="col-filter id-filter" style={{ "--accent": "var(--c-id)" } as React.CSSProperties}>
              <span className="col-filter__dot" />
              <span className="col-filter__label">ID</span>
              <button className="id-filter__op-btn" title="Filter operator" onClick={(e) => { e.stopPropagation(); toggle(setIdOpOpen, idOpOpen); }}>
                <span className={idOperator === "Like" ? "id-filter__approx" : ""}>{idOperator === "Like" ? "\u2248" : "="}</span>
              </button>
            </div>
            {idOpOpen && (
              <div className="menu menu--narrow id-op-menu">
                {ID_OPERATORS.map((op) => (
                  <div className={`menu__item ${idOperator === op ? "menu__item--active" : ""}`} key={op} onClick={() => { setIdOperator(op); setIdOpOpen(false); }}>
                    {idOperator === op && <Check size={14} className="menu__check" />}
                    <span>{op}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ColumnFilter label={selectedType ?? "Stock Entry Type"} accent="var(--c-type)" isOpen={typeDropdownOpen} onToggle={() => toggle(setTypeDropdownOpen, typeDropdownOpen)} icon={<ChevronDown size={14} className="col-filter__chev" />}>
            <div className="menu menu--list">
              {STOCK_ENTRY_TYPES.map((type) => (
                <div className={`menu__item ${selectedType === type ? "menu__item--active" : ""}`} key={type} onClick={() => { setSelectedType(type); setTypeDropdownOpen(false); }}>
                  {selectedType === type && <Check size={14} className="menu__check" />}
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </ColumnFilter>

          <ColumnFilter label={selectedSource ?? "Default Source Warehouse"} accent="var(--c-source)" isOpen={sourceOpen} onToggle={() => toggle(setSourceOpen, sourceOpen)} icon={<ChevronDown size={14} className="col-filter__chev" />}>
            <SelectMenu items={WAREHOUSES} selected={selectedSource} onSelect={(v) => { setSelectedSource(v); setSourceOpen(false); }} createLabel="Create a new Warehouse" showAdvancedSearch />
          </ColumnFilter>

          <ColumnFilter label={selectedTarget ?? "Default Target Warehouse"} accent="var(--c-target)" isOpen={targetOpen} onToggle={() => toggle(setTargetOpen, targetOpen)} icon={<ChevronDown size={14} className="col-filter__chev" />}>
            <SelectMenu items={WAREHOUSES} selected={selectedTarget} onSelect={(v) => { setSelectedTarget(v); setTargetOpen(false); }} createLabel="Create a new Warehouse" showAdvancedSearch />
          </ColumnFilter>
        </div>

        <div className="se-controls">
          <div className="dropdown">
            <button className={`filter-btn ${appliedFilters > 0 ? "filter-btn--active" : ""} ${filterPanelOpen ? "filter-btn--open" : ""}`} onClick={() => toggle(setFilterPanelOpen, filterPanelOpen)}>
              <FilterIcon size={14} />
              Filter
              {appliedFilters > 0 && <span className="filter-btn__badge">{appliedFilters}</span>}
            </button>
            {appliedFilters > 0 && (
              <button className="filter-clear" title="Clear filters" onClick={(e) => { e.stopPropagation(); clearFilters(); }}>
                <X size={14} />
              </button>
            )}
            {filterPanelOpen && (
              <div className="filter-panel">
                <div className="filter-row">
                  <div className="dropdown filter-row__field">
                    <button className="filter-select" onClick={() => toggle(setFilterFieldOpen, filterFieldOpen)}>
                      {filterField}<ChevronDown size={13} />
                    </button>
                    {filterFieldOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_FIELDS.map((f) => (
                          <div className={`menu__item ${filterField === f ? "menu__item--active" : ""}`} key={f} onClick={() => { setFilterField(f); setFilterFieldOpen(false); }}>
                            {filterField === f && <Check size={14} className="menu__check" />}
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown filter-row__op">
                    <button className="filter-select" onClick={() => toggle(setFilterOperatorOpen, filterOperatorOpen)}>
                      {filterOperator}<ChevronDown size={13} />
                    </button>
                    {filterOperatorOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_OPERATORS.map((op) => (
                          <div className={`menu__item ${filterOperator === op ? "menu__item--active" : ""}`} key={op} onClick={() => { setFilterOperator(op); setFilterOperatorOpen(false); }}>
                            {filterOperator === op && <Check size={14} className="menu__check" />}
                            <span>{op}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input className="filter-input" placeholder="Value" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                  <button className="filter-remove" title="Remove filter" onClick={() => setFilterValue("")}><X size={14} /></button>
                </div>

                <div className="filter-panel__footer">
                  <button className="link-btn">+ Add a Filter</button>
                  <div className="filter-panel__footer-actions">
                    <button className="btn-ghost" onClick={clearFilters}>Clear Filters</button>
                    <button className="btn-dark" onClick={applyFilters}>Apply Filters</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="sort-btn" onClick={() => toggle(setSortOpen, sortOpen)}>
              <ArrowUpDown size={14} className={`sort-btn__icon ${sortAsc ? "sort-btn__icon--asc" : ""}`} onClick={(e) => { e.stopPropagation(); setSortAsc((s) => !s); }} />
              {sortField}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="menu menu--list menu--narrow menu--right">
                {SORT_FIELDS.map((f) => (
                  <div className={`menu__item ${sortField === f ? "menu__item--active" : ""}`} key={f} onClick={() => { setSortField(f); setSortOpen(false); }}>
                    {sortField === f && <Check size={14} className="menu__check" />}
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="se-empty">
        <div className="se-empty__icon"><FileStack size={32} /></div>
        <p className="se-empty__title">You haven&rsquo;t created a Stock Entry yet</p>
        <button className="btn-primary btn-primary--lg" onClick={() => navigate("/stock-entry/new")}>
          <Plus size={16} />
          Create your first Stock Entry
        </button>
      </div>
    </div>
  );
};

export default Stockentry;