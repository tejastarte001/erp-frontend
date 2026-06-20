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
  FaBuilding,
  FaSitemap,
  FaCheckCircle,
  FaBoxes,
  FaPlus,
} from 'react-icons/fa';
import "./CompanyList.css";
import { useAdminTheme } from '../admin-theme/AdminThemeContext';

interface Company {
  id: string;
  defaultCurrency: string;
  country: string;
  isGroup: boolean;
  enablePerpetualInventory: boolean;
  createdOn: string;
}

const MOCK_COMPANIES: Company[] = [
  {
    id: "Test",
    defaultCurrency: "INR",
    country: "India",
    isGroup: false,
    enablePerpetualInventory: true,
    createdOn: "13h",
  },
];

export default function CompanyList() {
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const [companies] = useState<Company[]>(MOCK_COMPANIES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Company | null>(null);

  // Filter data based on search and group type
  const filteredData = companies.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.defaultCurrency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === 'all' ||
                         (groupFilter === 'group' && item.isGroup) ||
                         (groupFilter === 'standalone' && !item.isGroup);
    return matchesSearch && matchesGroup;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalGroup = companies.filter(item => item.isGroup).length;
  const totalStandalone = companies.filter(item => !item.isGroup).length;
  const totalPerpetual = companies.filter(item => item.enablePerpetualInventory).length;

  const stats = [
    { title: 'Total Companies', value: companies.length, icon: <FaBuilding />, color: '#6366f1' },
    { title: 'Group Companies', value: totalGroup, icon: <FaSitemap />, color: '#f59e0b' },
    { title: 'Standalone', value: totalStandalone, icon: <FaCheckCircle />, color: '#10b981' },
    { title: 'Perpetual Inventory', value: totalPerpetual, icon: <FaBoxes />, color: '#3b82f6' },
  ];

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedData.map((r) => r.id)));
    }
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

  const handleDelete = (item: Company) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting:', selectedItem);
    setShowDeleteConfirm(false);
    setSelectedItem(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setGroupFilter('all');
  };

  return (
    <div className={`cl-page ${theme}`}>
      {/* Stats Cards */}
      <div className="cl-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="cl-stat-card" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)` }}>
            <div className="cl-stat-icon">{stat.icon}</div>
            <div className="cl-stat-content">
              <p className="cl-stat-title">{stat.title}</p>
              <p className="cl-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="cl-filter-bar">
        <div className="cl-filter-left">
          <div className="cl-search-wrapper">
            <FaSearch className="cl-search-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cl-search-input"
            />
            {searchTerm && (
              <button className="cl-search-clear" onClick={() => setSearchTerm('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="cl-filter-right">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="cl-filter-select"
          >
            <option value="all">All Companies</option>
            <option value="group">Group</option>
            <option value="standalone">Standalone</option>
          </select>
          <button className="cl-filter-btn">
            <FaFilter size={12} />
            Filter
          </button>
          <button className="cl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="cl-btn-primary" onClick={() => navigate("/company/new")}>
            <FaPlus size={12} />
            Add Company
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || groupFilter !== 'all') && (
        <div className="cl-active-filters">
          <FaFilter size={12} style={{ color: 'var(--primary-color)' }} />
          <span style={{ color: 'var(--text-primary)' }}>Active filters:</span>
          {searchTerm && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Search:</strong> "{searchTerm}"
            </span>
          )}
          {groupFilter !== 'all' && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Type:</strong> {groupFilter}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="cl-clear-filters"
          >
            <FaTimes size={10} /> Clear All
          </button>
        </div>
      )}

      {/* Table */}
      <div className="cl-table-wrap">
        <table className="cl-table">
          <thead>
            <tr>
              <th className="cl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="cl-checkbox" />
              </th>
              <th className="cl-th">ID</th>
              <th className="cl-th">Default Currency</th>
              <th className="cl-th">Country</th>
              <th className="cl-th cl-th-bool">Is Group</th>
              <th className="cl-th cl-th-bool">Enable Perpetual Inventory</th>
              <th className="cl-th cl-th-meta">
                <span className="cl-count-label">{totalItems} of {companies.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="cl-empty-state">
                  <div className="cl-empty-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"/>
                    </svg>
                    <p>No companies found</p>
                    <span>Try adjusting your search criteria</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`cl-tr ${selected.has(row.id) ? "cl-tr-selected" : ""}`}
                  onClick={() => navigate(`/company/${encodeURIComponent(row.id)}`)}
                >
                  <td className="cl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="cl-checkbox" />
                  </td>
                  <td className="cl-td cl-td-name">{row.id}</td>
                  <td className="cl-td">{row.defaultCurrency}</td>
                  <td className="cl-td">{row.country}</td>
                  <td className="cl-td cl-td-bool">
                    <input type="checkbox" checked={row.isGroup} disabled className="cl-checkbox cl-checkbox-readonly" />
                  </td>
                  <td className="cl-td cl-td-bool">
                    <input type="checkbox" checked={row.enablePerpetualInventory} disabled className="cl-checkbox cl-checkbox-readonly" />
                  </td>
                  <td className="cl-td cl-td-meta">
                    <span className="cl-ago">{row.createdOn}</span>
                    <span className="cl-dot">·</span>
                    <div className="cl-action-buttons">
                      <button
                        className="cl-action-btn cl-action-view"
                        onClick={(e) => { e.stopPropagation(); navigate(`/company/${encodeURIComponent(row.id)}`); }}
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        className="cl-action-btn cl-action-edit"
                        onClick={(e) => { e.stopPropagation(); navigate(`/company/${encodeURIComponent(row.id)}`); }}
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        className="cl-action-btn cl-action-delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="cl-pagination">
          <div className="cl-pagination-left">
            <span className="cl-pagination-label">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="cl-page-size-select"
            >
              <option value={20}>20</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={2500}>2500</option>
            </select>
            <span className="cl-pagination-label">entries</span>
          </div>
          <div className="cl-pagination-center">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="cl-page-btn"
            >
              <FaAngleDoubleLeft size={12} />
            </button>
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="cl-page-btn"
            >
              <FaChevronLeft size={12} />
            </button>
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`cl-page-btn ${currentPage === page ? 'cl-page-btn-active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="cl-page-btn"
            >
              <FaChevronRight size={12} />
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="cl-page-btn"
            >
              <FaAngleDoubleRight size={12} />
            </button>
          </div>
          <div className="cl-pagination-right">
            <span className="cl-pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedItem && (
        <div className="cl-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cl-modal-header">
              <h3>Confirm Delete</h3>
              <button className="cl-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="cl-modal-body">
              <p>Are you sure you want to delete this company?</p>
              <p className="cl-modal-item-name"><strong>{selectedItem.id}</strong></p>
              <p className="cl-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="cl-modal-footer">
              <button className="cl-modal-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="cl-modal-btn-delete" onClick={confirmDelete}>
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}