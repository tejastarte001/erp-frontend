import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaEye,
  FaEdit,
  FaTrash,
  FaBoxes,
  FaTags,
  FaList,
  FaCheckCircle,
  FaTimesCircle,
  FaBox,
} from 'react-icons/fa';
import ItemQuickAdd from "./Itemquickadd";
import "./ItemList.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface Item {
  id: string;
  itemName: string;
  status: "Enabled" | "Disabled";
  itemGroup: string;
  uom: string;
  itemType: string;
  purpose: string;
  ago: string;
  comments: number;
}

const MOCK_ITEMS: Item[] = [
  { id: "Table-001",  itemName: "Table",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "2 m",  comments: 0 },
  { id: "Door1",      itemName: "Door1",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "now",  comments: 0 },
  { id: "Table-002",  itemName: "Table",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "17 m", comments: 0 },
  { id: "chair-001",  itemName: "chair",  status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "21 m", comments: 0 },
  { id: "23",         itemName: "23",     status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "22 m", comments: 0 },
  { id: "chair-002",  itemName: "chair",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "24 m", comments: 0 },
  { id: "354",        itemName: "354",    status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "1 h",  comments: 0 },
];

export default function ItemList() {
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [hasVariants, setHasVariants] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const items = MOCK_ITEMS;

  // Filter data based on search and status
  const filteredData = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && item.status === 'Enabled') ||
                         (statusFilter === 'disabled' && item.status === 'Disabled');
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalEnabled = items.filter(item => item.status === 'Enabled').length;
  const totalDisabled = items.filter(item => item.status === 'Disabled').length;
  const totalGroups = [...new Set(items.map(item => item.itemGroup))].length;

  const stats = [
    { title: 'Total Items', value: items.length, icon: <FaBoxes />, color: '#6366f1' },
    { title: 'Enabled', value: totalEnabled, icon: <FaCheckCircle />, color: '#10b981' },
    { title: 'Disabled', value: totalDisabled, icon: <FaTimesCircle />, color: '#ef4444' },
    { title: 'Item Groups', value: totalGroups, icon: <FaTags />, color: '#f59e0b' },
  ];

  const toggleAll = () => {
    if (allChecked) { setSelected(new Set()); }
    else { setSelected(new Set(paginatedData.map((r) => r.id))); }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === paginatedData.length);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className={`itl-page ${theme}`}>
      {/* Stats Cards */}
      <div className="itl-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="itl-stat-card" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)` }}>
            <div className="itl-stat-icon">{stat.icon}</div>
            <div className="itl-stat-content">
              <p className="itl-stat-title">{stat.title}</p>
              <p className="itl-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="itl-filter-bar">
        <div className="itl-filter-left">
          <div className="itl-search-wrapper">
            <FaSearch className="itl-search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="itl-search-input"
            />
            {searchTerm && (
              <button className="itl-search-clear" onClick={() => setSearchTerm('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="itl-filter-right">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="itl-filter-select"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <button className="itl-filter-btn">
            <FaFilter size={12} />
            Filter
          </button>
          <button className="itl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="itl-btn-primary" onClick={() => setShowModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="itl-active-filters">
          <FaFilter size={12} style={{ color: 'var(--primary-color)' }} />
          <span style={{ color: 'var(--text-primary)' }}>Active filters:</span>
          {searchTerm && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Search:</strong> "{searchTerm}"
            </span>
          )}
          {statusFilter !== 'all' && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Status:</strong> {statusFilter}
            </span>
          )}
          <button 
            onClick={clearFilters}
            className="itl-clear-filters"
          >
            <FaTimes size={10} /> Clear All
          </button>
        </div>
      )}

      {/* Has Variants */}
      <div className="itl-has-variants-bar">
        <input type="checkbox" id="hasVariants" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="itl-checkbox" />
        <label htmlFor="hasVariants" className="itl-has-variants-label">Has Variants</label>
      </div>

      {/* Table */}
      <div className="itl-table-wrap">
        <table className="itl-table">
          <thead>
            <tr>
              <th className="itl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="itl-checkbox" />
              </th>
              <th className="itl-th">Item Name</th>
              <th className="itl-th">Status</th>
              <th className="itl-th">Item Group</th>
              <th className="itl-th">UOM</th>
              <th className="itl-th">Item Type</th>
              <th className="itl-th">Purpose</th>
              <th className="itl-th itl-th-meta">
                <span className="itl-count-label">{totalItems} of {items.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="itl-empty-state">
                  <div className="itl-empty-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>No items found</p>
                    <span>Try adjusting your search criteria</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`itl-tr ${selected.has(row.id) ? "itl-tr-selected" : ""}`}
                  onClick={() => navigate(`/item/${encodeURIComponent(row.id)}`)}
                >
                  <td className="itl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="itl-checkbox" />
                  </td>
                  <td className="itl-td itl-td-name">{row.itemName}</td>
                  <td className="itl-td">
                    <span className={`itl-status-badge itl-status-${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                  <td className="itl-td">{row.itemGroup}</td>
                  <td className="itl-td">{row.uom}</td>
                  <td className="itl-td">{row.itemType}</td>
                  <td className="itl-td">{row.purpose}</td>
                  <td className="itl-td itl-td-meta">
                    <span className="itl-ago">{row.ago}</span>
                    <button className="itl-meta-btn" onClick={(e) => e.stopPropagation()}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {row.comments}
                    </button>
                    <span className="itl-dot">·</span>
                    <button className="itl-meta-btn" onClick={(e) => e.stopPropagation()}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="itl-pagination">
          <div className="itl-pagination-left">
            <span className="itl-pagination-label">Show:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="itl-page-size-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="itl-pagination-label">entries</span>
          </div>
          <div className="itl-pagination-center">
            <button 
              onClick={goToFirstPage} 
              disabled={currentPage === 1} 
              className="itl-page-btn"
            >
              <FaAngleDoubleLeft size={12} />
            </button>
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage === 1} 
              className="itl-page-btn"
            >
              <FaChevronLeft size={12} />
            </button>
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`itl-page-btn ${currentPage === page ? 'itl-page-btn-active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages} 
              className="itl-page-btn"
            >
              <FaChevronRight size={12} />
            </button>
            <button 
              onClick={goToLastPage} 
              disabled={currentPage === totalPages} 
              className="itl-page-btn"
            >
              <FaAngleDoubleRight size={12} />
            </button>
          </div>
          <div className="itl-pagination-right">
            <span className="itl-pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </span>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showModal && (
        <ItemQuickAdd
          onClose={() => setShowModal(false)}
          onEditFull={(data) => {
            setShowModal(false);
            navigate("/item/new", { state: { prefill: data } });
          }}
        />
      )}
    </div>
  );
}