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
  FaWarehouse,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaCheck,
} from 'react-icons/fa';
import "./WarehouseList.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface Warehouse {
  id: string;
  name: string;
  status: "Enabled" | "Disabled";
  company: string;
  account: string;
  isGroup: boolean;
  createdOn: string;
}

interface WarehouseFormData {
  name: string;
  company: string;
  account: string;
  isGroup: boolean;
}

const MOCK_WAREHOUSES: Warehouse[] = [
  { id: "1001s", name: "Goods In Transit-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1002s", name: "Finished Goods-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1003s", name: "Work In Progress-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1004s", name: "Stores-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1005s", name: "All Warehouses-T", status: "Enabled", company: "Test", account: "Test", isGroup: true, createdOn: "1d" },
  { id: "1006s", name: "Main Warehouse", status: "Disabled", company: "Test", account: "Test", isGroup: false, createdOn: "2d" },
  { id: "1007s", name: "Secondary Warehouse", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "2d" },
  { id: "1008s", name: "Distribution Center", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "3d" },
  { id: "1009s", name: "Regional Warehouse", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "3d" },
  { id: "1010s", name: "Central Warehouse", status: "Disabled", company: "Test", account: "Test", isGroup: false, createdOn: "4d" },
];

const COMPANIES = ["Test", "ABC Corp", "XYZ Ltd"];
const ACCOUNTS = ["Test", "Main", "Secondary", "Distribution"];

export default function WarehouseList() {
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const [warehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    company: "",
    account: "",
    isGroup: false,
  });

  // Filter data based on search and status
  const filteredData = warehouses.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && item.status === 'Enabled') ||
                         (statusFilter === 'disabled' && item.status === 'Disabled');
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Ensure current page is valid when data changes
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }
  
  const paginatedData = filteredData.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  // Stats
  const totalEnabled = warehouses.filter(item => item.status === 'Enabled').length;
  const totalDisabled = warehouses.filter(item => item.status === 'Disabled').length;
  const totalCompanies = [...new Set(warehouses.map(item => item.company))].length;
  // const totalGroups = warehouses.filter(item => item.isGroup).length;

  const stats = [
    { title: 'Total Warehouses', value: warehouses.length, icon: <FaWarehouse />, color: '#6366f1' },
    { title: 'Enabled', value: totalEnabled, icon: <FaCheckCircle />, color: '#10b981' },
    { title: 'Disabled', value: totalDisabled, icon: <FaTimesCircle />, color: '#ef4444' },
    { title: 'Companies', value: totalCompanies, icon: <FaWarehouse />, color: '#f59e0b' },
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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const handleOpenModal = () => {
    setFormData({ name: "", company: "", account: "", isGroup: false });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", company: "", account: "", isGroup: false });
  };

  const handleSave = () => {
    if (formData.name.trim()) {
      navigate(`/warehouse/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  const handleEditFull = () => {
    if (formData.name.trim()) {
      navigate(`/warehouse/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  const handleDelete = (item: Warehouse) => {
    setSelectedWarehouse(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting:', selectedWarehouse);
    setShowDeleteConfirm(false);
    setSelectedWarehouse(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const getStartIndex = () => {
    return (validCurrentPage - 1) * itemsPerPage + 1;
  };

  const getEndIndex = () => {
    return Math.min(validCurrentPage * itemsPerPage, totalItems);
  };

  return (
    <div className={`wl-page ${theme}`}>
      {/* Stats Cards */}
      {/* <div className="wl-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="wl-stat-card" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)` }}>
            <div className="wl-stat-icon">{stat.icon}</div>
            <div className="wl-stat-content">
              <p className="wl-stat-title">{stat.title}</p>
              <p className="wl-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* Search and Filter Bar */}
      <div className="wl-filter-bar">
        <div className="wl-filter-left">
          <div className="wl-search-wrapper">
            <FaSearch className="wl-search-icon" />
            <input
              type="text"
              placeholder="Search Warehouses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="wl-search-input"
            />
            {searchTerm && (
              <button className="wl-search-clear" onClick={() => setSearchTerm('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="wl-filter-right">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="wl-filter-select"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <button className="wl-filter-btn">
            <FaFilter size={12} />
            Filter
          </button>
          <button className="wl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="wl-btn-primary" onClick={handleOpenModal}>
            <FaPlus size={12} />
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="wl-active-filters">
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
            className="wl-clear-filters"
          >
            <FaTimes size={10} /> Clear All
          </button>
        </div>
      )}

      {/* Table */}
      <div className="wl-table-wrap">
        <table className="wl-table">
          <thead>
            <tr>
              <th className="wl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="wl-checkbox" />
              </th>
              <th className="wl-th">ID</th>
              <th className="wl-th">Warehouse Name</th>
              <th className="wl-th">Status</th>
              <th className="wl-th">Company</th>
              <th className="wl-th">Account</th>
              <th className="wl-th">Is Group</th>
              <th className="wl-th wl-th-meta">
                <span className="wl-count-label">{totalItems} of {warehouses.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="wl-empty-state">
                  <div className="wl-empty-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>No Warehouses found</p>
                    <span>Try adjusting your search criteria</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`wl-tr ${selected.has(row.id) ? "wl-tr-selected" : ""}`}
                  onClick={() => navigate(`/warehouse/${encodeURIComponent(row.name)}`)}
                >
                  <td className="wl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="wl-checkbox" />
                  </td>
                  <td className="wl-td">{row.id}</td>
                  <td className="wl-td wl-td-name">{row.name}</td>
                  <td className="wl-td">
                    <span className={`wl-status-badge wl-status-${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                  <td className="wl-td">{row.company}</td>
                  <td className="wl-td">{row.account}</td>
                  <td className="wl-td">{row.isGroup ? "Yes" : "No"}</td>
                  <td className="wl-td wl-td-meta">
                    <span className="wl-ago">{row.createdOn}</span>
                    <span className="wl-dot">·</span>
                    <div className="wl-action-buttons">
                      <button 
                        className="wl-action-btn wl-action-view" 
                        onClick={(e) => { e.stopPropagation(); navigate(`/warehouse/${encodeURIComponent(row.name)}`); }}
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button 
                        className="wl-action-btn wl-action-edit" 
                        onClick={(e) => { e.stopPropagation(); navigate(`/warehouse/${encodeURIComponent(row.name)}`); }}
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button 
                        className="wl-action-btn wl-action-delete" 
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

      {/* Pagination - Always visible */}
      <div className="wl-pagination">
        <div className="wl-pagination-left">
          <span className="wl-pagination-label">Show:</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="wl-page-size-select"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="wl-pagination-label">entries</span>
        </div>
        <div className="wl-pagination-center">
          <button 
            onClick={goToFirstPage} 
            disabled={currentPage === 1 || totalItems === 0} 
            className="wl-page-btn"
          >
            <FaAngleDoubleLeft size={12} />
          </button>
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1 || totalItems === 0} 
            className="wl-page-btn"
          >
            <FaChevronLeft size={12} />
          </button>
          {totalItems > 0 && getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`wl-page-btn ${currentPage === page ? 'wl-page-btn-active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || totalItems === 0} 
            className="wl-page-btn"
          >
            <FaChevronRight size={12} />
          </button>
          <button 
            onClick={goToLastPage} 
            disabled={currentPage === totalPages || totalItems === 0} 
            className="wl-page-btn"
          >
            <FaAngleDoubleRight size={12} />
          </button>
        </div>
        <div className="wl-pagination-right">
          <span className="wl-pagination-info">
            {totalItems > 0 ? (
              `Showing ${getStartIndex()} to ${getEndIndex()} of ${totalItems} entries`
            ) : (
              'No entries to show'
            )}
          </span>
        </div>
      </div>

      {/* New Warehouse Modal */}
      {showModal && (
        <div className="wl-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="wl-modal">
            <div className="wl-modal-header">
              <div className="wl-modal-header-left">
                <div className="wl-modal-icon">
                  <FaWarehouse size={16} />
                </div>
                <span className="wl-modal-title">New Warehouse</span>
              </div>
              <button className="wl-modal-close" onClick={handleCloseModal}>
                <FaTimes size={16} />
              </button>
            </div>

            <div className="wl-modal-body">
              <div className="wl-field">
                <label className="wl-label">Warehouse Name <span className="wl-req">*</span></label>
                <input
                  className="wl-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  placeholder="Enter warehouse name"
                />
              </div>

              <div className="wl-field">
                <label className="wl-label">Company</label>
                <select
                  className="wl-select"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                >
                  <option value="">Select company</option>
                  {COMPANIES.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              <div className="wl-field">
                <label className="wl-label">Account</label>
                <select
                  className="wl-select"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                >
                  <option value="">Select account</option>
                  {ACCOUNTS.map((account) => (
                    <option key={account} value={account}>{account}</option>
                  ))}
                </select>
              </div>

              <div className="wl-field">
                <label className="wl-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isGroup}
                    onChange={(e) => setFormData({ ...formData, isGroup: e.target.checked })}
                    className="wl-checkbox"
                  />
                  Is Group Warehouse
                </label>
              </div>
            </div>

            <div className="wl-modal-footer">
              <button className="wl-btn-edit-full" onClick={handleEditFull}>
                <FaEdit size={12} /> Edit Full Form
              </button>
              <button 
                className="wl-btn-save" 
                onClick={handleSave}
                disabled={!formData.name.trim()}
              >
                <FaCheck size={12} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedWarehouse && (
        <div className="wl-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="wl-modal wl-modal-delete">
            <div className="wl-modal-header">
              <span className="wl-modal-title">Confirm Delete</span>
              <button className="wl-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <FaTimes size={16} />
              </button>
            </div>
            <div className="wl-modal-body">
              <p>Are you sure you want to delete this warehouse?</p>
              <p className="wl-modal-item-name"><strong>{selectedWarehouse.name}</strong></p>
              <p className="wl-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="wl-modal-footer">
              <button className="wl-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="wl-btn-delete" onClick={confirmDelete}>
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}