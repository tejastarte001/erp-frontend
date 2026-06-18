import React, { useEffect, useRef, useState, useMemo } from "react";
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
  
  Heart,
} from "lucide-react";
import "./JobCardManagement.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_FIELDS = ["Created On", "Last Updated On", "ID", "Work Order", "Operation"];

const FILTER_FIELDS = [
  "ID",
  "Work Order",
  "Operation",
  "Workstation",
  "Status",
  "Company",
  "Series",
];

const FILTER_OPERATORS = ["Equals", "Not Equals", "Like", "In", "Not In"];

const ID_OPERATORS = ["Equals", "Like"];

const STATUS_OPTIONS = [
  "Open",
  "Work In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
];

const OPERATION_OPTIONS = [
  "Assembly",
  "Welding",
  "Painting",
  "Cutting",
  "Inspection",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobCard {
  id: number;
  job_card_id: string;
  status: "Open" | "Work In Progress" | "Completed" | "On Hold" | "Cancelled";
  work_order: string;
  operation: string;
  workstation: string;
  qty_to_manufacture: number;
  total_completed_qty: number;
  created_on: string;
  is_favorite?: boolean;
}

// ─── Sample data ──────────────────────────────────────────────────────────────

const JOB_CARD_DATA: JobCard[] = [
  {
    id: 1,
    job_card_id: "PO-JOB-00001",
    status: "Open",
    work_order: "MFG-WO-00012",
    operation: "Assembly",
    workstation: "Station A",
    qty_to_manufacture: 10,
    total_completed_qty: 0,
    created_on: "2025-06-17",
  },
  {
    id: 2,
    job_card_id: "PO-JOB-00002",
    status: "Work In Progress",
    work_order: "MFG-WO-00013",
    operation: "Welding",
    workstation: "Station B",
    qty_to_manufacture: 5,
    total_completed_qty: 2,
    created_on: "2025-06-17",
  },
];

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Open:               { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Work In Progress": { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  Completed:          { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  "On Hold":          { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
  Cancelled:          { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
};

const relativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  const m = Math.floor(diffDays / 30);
  return m < 12 ? `${m}mo ago` : `${Math.floor(m / 12)}y ago`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ColumnFilterProps {
  label: string;
  accent: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ label, accent, isOpen, onToggle, children }) => (
  <div className="col-filter-wrap">
    <button
      className={`col-filter ${isOpen ? "col-filter--open" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onToggle}
    >
      <span className="col-filter__dot" />
      <span className="col-filter__label">{label}</span>
      <ChevronDown size={13} className="col-filter__chev" />
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
        {selected === item ? <Check size={14} className="menu__check" /> : <span style={{ width: 14 }} />}
        <span>{item}</span>
      </div>
    ))}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const JobCardManagement: React.FC = () => {
  const navigate = useNavigate();
  const [jobCards, setJobCards] = useState<JobCard[]>(JOB_CARD_DATA);

  // view / meta dropdowns
  const [listViewOpen, setListViewOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // column filters
  const [idOpOpen, setIdOpOpen] = useState(false);
  const [idOperator, setIdOperator] = useState("Like");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [operationOpen, setOperationOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

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
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => {
    setListViewOpen(false);
    setSavedFiltersOpen(false);
    setMoreOpen(false);
    setIdOpOpen(false);
    setStatusOpen(false);
    setOperationOpen(false);
    setFilterPanelOpen(false);
    setFilterFieldOpen(false);
    setFilterOperatorOpen(false);
    setSortOpen(false);
    setOpenMenuId(null);
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
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

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = JOB_CARD_DATA.length > 0 && selectedRows.size === jobCards.length;
  const toggleAll = () => {
    setSelectedRows(allSelected ? new Set() : new Set(jobCards.map((r) => r.id)));
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setJobCards((prev) => prev.map((jc) => jc.id === id ? { ...jc, is_favorite: !jc.is_favorite } : jc));
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (!window.confirm("Delete this job card?")) return;
    setJobCards((prev) => prev.filter((jc) => jc.id !== id));
  };

  const visibleCards = useMemo(() => {
    let data = [...jobCards];
    if (selectedStatus) data = data.filter((jc) => jc.status === selectedStatus);
    if (selectedOperation) data = data.filter((jc) => jc.operation === selectedOperation);
    return data.slice(0, pageSize);
  }, [jobCards, selectedStatus, selectedOperation, pageSize]);

  return (
    <div className="jcm-page" ref={rootRef}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="jcm-header">
        <div className="jcm-breadcrumb">
          <button className="jcm-breadcrumb__home" title="Home">
            <Home size={14} />
          </button>
          <span className="jcm-breadcrumb__sep">/</span>
          <span className="jcm-breadcrumb__crumb">Manufacturing</span>
          <span className="jcm-breadcrumb__sep">/</span>
          <span className="jcm-breadcrumb__crumb jcm-breadcrumb__crumb--active">Job Card</span>
        </div>

        <div className="jcm-actions">
          {/* List View */}
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

          {/* Saved Filters */}
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

          <button className="icon-btn icon-btn--teal" title="Refresh"><RefreshCw size={15} /></button>

          {/* More */}
          <div className="dropdown">
            <button className="icon-btn icon-btn--slate" onClick={() => toggle(setMoreOpen, moreOpen)} title="More options">
              <MoreHorizontal size={15} />
            </button>
            {moreOpen && (
              <div className="menu menu--sm menu--right">
                {["Import", "Export", "Settings", "Reload"].map((v) => (
                  <div className="menu__item" key={v}><span>{v}</span></div>
                ))}
              </div>
            )}
          </div>

          <button className="btn-primary" onClick={() => navigate("/job-cards/new")}>
            <Plus size={15} /> Add Job Card
          </button>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="jcm-toolbar">
        <div className="jcm-columns">
          {/* ID filter */}
          <div className="col-filter-wrap">
            <div className="col-filter id-filter" style={{ "--accent": "var(--c-id)" } as React.CSSProperties}>
              <span className="col-filter__dot" />
              <span className="col-filter__label">ID</span>
              <button
                className="id-filter__op-btn"
                title="Filter operator"
                onClick={(e) => { e.stopPropagation(); toggle(setIdOpOpen, idOpOpen); }}
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
                    onClick={() => { setIdOperator(op); setIdOpOpen(false); }}
                  >
                    {idOperator === op ? <Check size={14} className="menu__check" /> : <span style={{ width: 14 }} />}
                    <span>{op}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status filter */}
          <ColumnFilter
            label={selectedStatus ?? "Status"}
            accent="var(--c-status)"
            isOpen={statusOpen}
            onToggle={() => toggle(setStatusOpen, statusOpen)}
          >
            <SelectMenu
              items={STATUS_OPTIONS}
              selected={selectedStatus}
              onSelect={(v) => { setSelectedStatus(v); setStatusOpen(false); }}
            />
          </ColumnFilter>

          {/* Operation filter */}
          <ColumnFilter
            label={selectedOperation ?? "Operation"}
            accent="var(--c-operation)"
            isOpen={operationOpen}
            onToggle={() => toggle(setOperationOpen, operationOpen)}
          >
            <SelectMenu
              items={OPERATION_OPTIONS}
              selected={selectedOperation}
              onSelect={(v) => { setSelectedOperation(v); setOperationOpen(false); }}
            />
          </ColumnFilter>
        </div>

        {/* Filter + Sort */}
        <div className="jcm-controls">
          <div className="dropdown">
            <button
              className={`filter-btn ${appliedFilters > 0 ? "filter-btn--active" : ""} ${filterPanelOpen ? "filter-btn--open" : ""}`}
              onClick={() => toggle(setFilterPanelOpen, filterPanelOpen)}
            >
              <FilterIcon size={13} />
              Filter
              {appliedFilters > 0 && <span className="filter-btn__badge">{appliedFilters}</span>}
            </button>
            {appliedFilters > 0 && (
              <button className="filter-clear" title="Clear filters" onClick={(e) => { e.stopPropagation(); clearFilters(); }}>
                <X size={13} />
              </button>
            )}

            {filterPanelOpen && (
              <div className="filter-panel">
                <div className="filter-row">
                  <div className="dropdown filter-row__field">
                    <button className="filter-select" onClick={() => toggle(setFilterFieldOpen, filterFieldOpen)}>
                      {filterField}
                      <ChevronDown size={13} />
                    </button>
                    {filterFieldOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_FIELDS.map((f) => (
                          <div
                            key={f}
                            className={`menu__item ${filterField === f ? "menu__item--active" : ""}`}
                            onClick={() => { setFilterField(f); setFilterFieldOpen(false); }}
                          >
                            {filterField === f ? <Check size={14} className="menu__check" /> : <span style={{ width: 14 }} />}
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown filter-row__op">
                    <button className="filter-select" onClick={() => toggle(setFilterOperatorOpen, filterOperatorOpen)}>
                      {filterOperator}
                      <ChevronDown size={13} />
                    </button>
                    {filterOperatorOpen && (
                      <div className="menu menu--list menu--narrow">
                        {FILTER_OPERATORS.map((op) => (
                          <div
                            key={op}
                            className={`menu__item ${filterOperator === op ? "menu__item--active" : ""}`}
                            onClick={() => { setFilterOperator(op); setFilterOperatorOpen(false); }}
                          >
                            {filterOperator === op ? <Check size={14} className="menu__check" /> : <span style={{ width: 14 }} />}
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
                  <button className="filter-remove" title="Remove filter" onClick={() => setFilterValue("")}>
                    <X size={13} />
                  </button>
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

          {/* Sort */}
          <div className="dropdown">
            <button className="sort-btn" onClick={() => toggle(setSortOpen, sortOpen)}>
              <ArrowUpDown
                size={14}
                className={`sort-btn__icon ${sortAsc ? "sort-btn__icon--asc" : ""}`}
                onClick={(e) => { e.stopPropagation(); setSortAsc((s) => !s); }}
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
                    onClick={() => { setSortField(f); setSortOpen(false); }}
                  >
                    {sortField === f ? <Check size={14} className="menu__check" /> : <span style={{ width: 14 }} />}
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div className="jcm-table-wrap">
        <table className="jcm-table">
          <thead>
            <tr>
              <th className="cb-col">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th>Job Card ID</th>
              <th>Status</th>
              <th>Work Order</th>
              <th>Operation</th>
              <th>Workstation</th>
              <th>Qty (Done/Total)</th>
              <th>Created On</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleCards.length === 0 ? (
              <tr>
                <td colSpan={9} className="jcm-empty-cell">
                  <div className="jcm-empty-icon">📋</div>
                  <div className="jcm-empty-text">No job cards found</div>
                  <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/job-cards/new")}>
                    <Plus size={13} /> Create your first Job Card
                  </button>
                </td>
              </tr>
            ) : (
              visibleCards.map((jc) => {
                const sc = STATUS_COLORS[jc.status] ?? STATUS_COLORS.Open;
                return (
                  <tr key={jc.id} className="jcm-row" onClick={() => navigate(`/job-cards/${jc.id}`, { state: { jobCard: jc } })}>
                    <td className="cb-col" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedRows.has(jc.id)} onChange={() => toggleRow(jc.id)} />
                    </td>
                    <td>
                      <a className="jcm-id-link" href={`/job-cards/${jc.id}`} onClick={(e) => e.preventDefault()}>
                        {jc.job_card_id}
                      </a>
                    </td>
                    <td>
                      <span
                        className="jcm-status-pill"
                        style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                      >
                        {jc.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{jc.work_order || "—"}</td>
                    <td className="jcm-muted">{jc.operation || "—"}</td>
                    <td className="jcm-muted">{jc.workstation || "—"}</td>
                    <td className="jcm-qty">
                      <span className="jcm-qty__done">{jc.total_completed_qty}</span>
                      <span className="jcm-qty__sep">/</span>
                      <span>{jc.qty_to_manufacture}</span>
                    </td>
                    <td className="jcm-muted jcm-time">{relativeTime(jc.created_on)}</td>
                    <td className="meta-cell" onClick={(e) => e.stopPropagation()}>
                      <div className="meta-inner">
                        <span
                          className={`jcm-fav ${jc.is_favorite ? "jcm-fav--on" : ""}`}
                          onClick={(e) => toggleFavorite(e, jc.id)}
                        >
                          <Heart size={14} />
                        </span>
                        <span className="jcm-ellipsis" onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === jc.id ? null : jc.id); }}>
                          ···
                        </span>
                        {openMenuId === jc.id && (
                          <div className="jcm-row-menu">
                            <div className="jcm-row-menu__item" onClick={() => { setOpenMenuId(null); navigate(`/job-cards/${jc.id}`, { state: { jobCard: jc } }); }}>Edit</div>
                            <div className="jcm-row-menu__item jcm-row-menu__item--danger" onClick={(e) => handleDelete(e, jc.id)}>Delete</div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="jcm-footer">
        <span className="jcm-footer__count">{visibleCards.length} records</span>
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
  );
};

export default JobCardManagement;