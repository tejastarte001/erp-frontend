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
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import "./BOMPage.css";
import NewBOMPage from "./Newbompage";
import { useAdminTheme } from "../admin-theme/AdminThemeContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_FIELDS = ["Created On", "Last Updated On", "ID", "Item to Manufacture"];

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

const CheckBadge: React.FC<{ checked: boolean }> = ({ checked }) => (
  <div className={`bom-check-badge ${checked ? "bom-check-badge--on" : ""}`}>
    {checked && <Check size={12} color="#fff" strokeWidth={3} />}
  </div>
);

const ToggleDot: React.FC<{ on: boolean }> = ({ on }) => (
  <div className={`bom-toggle-dot ${on ? "bom-toggle-dot--on" : ""}`} />
);

// ─── Main component ───────────────────────────────────────────────────────────

const BOMPage: React.FC = () => {
  const { theme } = useAdminTheme();
  const [showNewBOM, setShowNewBOM] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // view / meta dropdowns
  const [listViewOpen, setListViewOpen] = useState(false);
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  // sort
  const [sortOpen, setSortOpen] = useState(false);
  const [sortField, setSortField] = useState("Created On");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // selected rows
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const rootRef = useRef<HTMLDivElement>(null);

  // Filter data
  const filteredData = BOM_DATA.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.itemToManufacture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && item.isActive) ||
                         (statusFilter === 'draft' && item.status === 'Draft');
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalFilteredItems = filteredData.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  
  const paginatedData = filteredData.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  const getStartIndex = () => (validCurrentPage - 1) * itemsPerPage + 1;
  const getEndIndex = () => Math.min(validCurrentPage * itemsPerPage, totalFilteredItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, validCurrentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(validCurrentPage + 1);
  const goToPrevPage = () => goToPage(validCurrentPage - 1);

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  // Stats
  const totalBOMs = BOM_DATA.length;
  const activeBOMs = BOM_DATA.filter(b => b.isActive).length;
  const draftBOMs = BOM_DATA.filter(b => b.status === 'Draft').length;

  const stats = [
    { title: 'Total BOMs', value: totalBOMs, icon: <FileStack size={20} />, color: '#6366f1' },
    { title: 'Active', value: activeBOMs, icon: <Check size={20} />, color: '#10b981' },
    { title: 'Draft', value: draftBOMs, icon: <FileStack size={20} />, color: '#f59e0b' },
    { title: 'Total Cost', value: '₹ 0.00', icon: <FileStack size={20} />, color: '#3b82f6' },
  ];

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
    setSortOpen(false);
  };

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean
  ) => {
    closeAll();
    setter(!current);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected =
    paginatedData.length > 0 && selectedRows.size === paginatedData.length;

  const toggleAll = () => {
    setSelectedRows(allSelected ? new Set() : new Set(paginatedData.map((r) => r.id)));
  };

  const handleView = (row: BOMRow) => {
    console.log("View BOM", row.id);
  };

  const handleEdit = (row: BOMRow) => {
    console.log("Edit BOM", row.id);
  };

  const handleDelete = (row: BOMRow) => {
    console.log("Delete BOM", row.id);
  };

  return (
    <>
      {showNewBOM && <NewBOMPage onBack={() => setShowNewBOM(false)} />}
      {!showNewBOM && (
        <div className={`bom-page ${theme}`} ref={rootRef}>
          {/* ── Header ─────────────────────────────────────────────────────── */}


          {/* ── Search and Filter Bar ─────────────────────────────────────── */}
          <div className="bom-filter-bar">
            <div className="bom-filter-left">
              <div className="bom-search-wrapper">
                <Search className="bom-search-icon" size={14} />
                <input
                  type="text"
                  placeholder="Search BOMs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bom-search-input"
                />
                {searchTerm && (
                  <button className="bom-search-clear" onClick={() => setSearchTerm('')}>
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="bom-filter-right">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bom-filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
              <button className="bom-filter-btn">
                <FilterIcon size={12} />
                Filter
              </button>
              <button className="bom-sort-btn" onClick={() => toggle(setSortOpen, sortOpen)}>
                <ArrowUpDown size={12} />
                {sortField}
                <ChevronDown size={12} />
                {sortOpen && (
                  <div className="bom-menu bom-menu--list bom-menu--narrow bom-menu--right">
                    {SORT_FIELDS.map((f) => (
                      <div
                        key={f}
                        className={`bom-menu__item ${sortField === f ? "bom-menu__item--active" : ""}`}
                        onClick={() => {
                          setSortField(f);
                          setSortOpen(false);
                        }}
                      >
                        {sortField === f ? (
                          <Check size={14} className="bom-menu__check" />
                        ) : (
                          <span style={{ width: 14 }} />
                        )}
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </button>
              <button className="bom-btn-primary" onClick={() => setShowNewBOM(true)}>
                <Plus size={12} />
                Add BOM
              </button>
            </div>
          </div>

          {/* ── Active filters indicator ──────────────────────────────────── */}
          {(searchTerm || statusFilter !== 'all') && (
            <div className="bom-active-filters">
              <FilterIcon size={12} style={{ color: 'var(--primary-color)' }} />
              <span>Active filters:</span>
              {searchTerm && (
                <span><strong>Search:</strong> "{searchTerm}"</span>
              )}
              {statusFilter !== 'all' && (
                <span><strong>Status:</strong> {statusFilter === 'active' ? 'Active' : 'Draft'}</span>
              )}
              <button 
                onClick={clearFilters}
                className="bom-clear-filters"
              >
                <X size={10} /> Clear All
              </button>
            </div>
          )}

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <div className="bom-table-wrap">
            <table className="bom-table">
              <thead>
                <tr>
                  <th className="bom-th-check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="bom-checkbox"
                    />
                  </th>
                  <th className="bom-th">ID</th>
                  <th className="bom-th">Status</th>
                  <th className="bom-th">Item to Manufacture</th>
                  <th className="bom-th">Is Active</th>
                  <th className="bom-th">Is Default</th>
                  <th className="bom-th">Total Cost</th>
                  <th className="bom-th">Has Variants</th>
                  <th className="bom-th bom-th-meta">
                    <span className="bom-count-label">{totalFilteredItems} of {totalBOMs}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="bom-empty-state">
                      <div className="bom-empty-content">
                        <FileStack size={48} />
                        <p>No BOMs found</p>
                        <span>Try adjusting your search criteria</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr
                      key={row.id}
                      className={`bom-tr ${selectedRows.has(row.id) ? "bom-tr-selected" : ""}`}
                    >
                      <td className="bom-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="bom-checkbox"
                        />
                      </td>
                      <td className="bom-td bom-td-id">
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
                      <td className="bom-td">
                        <span className="bom-status-pill">{row.status}</span>
                      </td>
                      <td className="bom-td" style={{ fontWeight: 500 }}>{row.itemToManufacture}</td>
                      <td className="bom-td">
                        <CheckBadge checked={row.isActive} />
                      </td>
                      <td className="bom-td">
                        <CheckBadge checked={row.isDefault} />
                      </td>
                      <td className="bom-td bom-cost">{row.totalCost}</td>
                      <td className="bom-td">
                        <ToggleDot on={row.hasVariants} />
                      </td>
                      <td className="bom-td bom-td-meta">
                        <span className="bom-ago">{row.createdOn}</span>
                        <span className="bom-dot">·</span>
                        <div className="bom-action-buttons">
                          <button 
                            className="bom-action-btn bom-action-view" 
                            onClick={(e) => { e.stopPropagation(); handleView(row); }}
                            title="View"
                          >
                            <Eye size={12} />
                          </button>
                          <button 
                            className="bom-action-btn bom-action-edit" 
                            onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button 
                            className="bom-action-btn bom-action-delete" 
                            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          <div className="bom-pagination">
            <div className="bom-pagination-left">
              <span className="bom-pagination-label">Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bom-page-size-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="bom-pagination-label">entries</span>
            </div>
            <div className="bom-pagination-center">
              <button 
                onClick={goToFirstPage} 
                disabled={validCurrentPage === 1 || totalFilteredItems === 0} 
                className="bom-page-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"/>
                  <polyline points="18 17 13 12 18 7"/>
                </svg>
              </button>
              <button 
                onClick={goToPrevPage} 
                disabled={validCurrentPage === 1 || totalFilteredItems === 0} 
                className="bom-page-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              {totalFilteredItems > 0 && getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`bom-page-btn ${validCurrentPage === page ? 'bom-page-btn-active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={goToNextPage} 
                disabled={validCurrentPage === totalPages || totalFilteredItems === 0} 
                className="bom-page-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button 
                onClick={goToLastPage} 
                disabled={validCurrentPage === totalPages || totalFilteredItems === 0} 
                className="bom-page-btn"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"/>
                  <polyline points="6 17 11 12 6 7"/>
                </svg>
              </button>
            </div>
            <div className="bom-pagination-right">
              <span className="bom-pagination-info">
                {totalFilteredItems > 0 ? (
                  `Showing ${getStartIndex()} to ${getEndIndex()} of ${totalFilteredItems} entries`
                ) : (
                  'No entries to show'
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BOMPage;