import { useState, useEffect } from "react";
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
  FaRuler,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaCheck,
} from 'react-icons/fa';
import "./UOMList.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';
import api from '../../services/api';

interface UOM {
  id: string;
  uom_name: string;
  symbol: string | null;
  common_code: string | null;
  category: string;
  enabled: number;
  must_be_whole_number: number;
  creation: string;
}

interface UOMFormData {
  name: string;
  category: string;
}

interface ApiResponse {
  success: number;
  data: {
    total: number;
    page: number;
    limit: number;
    records: UOM[];
  };
}

const CATEGORIES = [
  "Area",
  "Electric Current",
  "Electrical Charge",
  "Length",
  "Pressure",
  "Volume",
  "Weight",
  "Time",
  "Temperature",
  "Speed",
  "Frequency",
  "Frequency and Wavelength",
  "Force",
  "Energy",
  "Power",
  "Data",
  "Quantity",
];

export default function UOMList() {
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUOM, setSelectedUOM] = useState<UOM | null>(null);
  const [formData, setFormData] = useState<UOMFormData>({
    name: "",
    category: "",
  });

  // Fetch UOMs from API
  const fetchUOMs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      // Add search filter if present
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.append('enabled', statusFilter === 'enabled' ? '1' : '0');
      }

      const response = await api.get<ApiResponse>(`/uom?${params.toString()}`);
      
      if (response.data.success === 1) {
        setUoms(response.data.data.records);
        setTotalItems(response.data.data.total);
      } else {
        setError('Failed to fetch UOMs');
      }
    } catch (err) {
      console.error('Error fetching UOMs:', err);
      setError('An error occurred while fetching UOMs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    fetchUOMs();
  }, [currentPage, itemsPerPage, searchTerm, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  // Stats
  const totalEnabled = uoms.filter(item => item.enabled === 1).length;
  const totalDisabled = uoms.filter(item => item.enabled === 0).length;
  const totalCategories = [...new Set(uoms.map(item => item.category))].length;

  const stats = [
    { title: 'Total UOMs', value: totalItems, icon: <FaRuler />, color: '#6366f1' },
    { title: 'Enabled', value: totalEnabled, icon: <FaCheckCircle />, color: '#10b981' },
    { title: 'Disabled', value: totalDisabled, icon: <FaTimesCircle />, color: '#ef4444' },
    { title: 'Categories', value: totalCategories, icon: <FaRuler />, color: '#f59e0b' },
  ];

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(uoms.map((r) => r.id.toString())));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === uoms.length);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
    setFormData({ name: "", category: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", category: "" });
  };

  const handleSave = async () => {
    if (formData.name.trim()) {
      try {
        // Create new UOM
        const response = await api.post('/uom', {
          uom_name: formData.name,
          category: formData.category || undefined,
          symbol: '',
          common_code: '',
          enabled: 1,
          must_be_whole_number: 0
        });
        
        if (response.data.success === 1) {
          // Refresh the list
          fetchUOMs();
          handleCloseModal();
        }
      } catch (err) {
        console.error('Error creating UOM:', err);
        alert('Failed to create UOM');
      }
    }
  };

  const handleDelete = (item: UOM) => {
    setSelectedUOM(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedUOM) {
      try {
        const response = await api.delete(`/uom/${selectedUOM.id}`);
        if (response.data.success === 1) {
          setShowDeleteConfirm(false);
          setSelectedUOM(null);
          fetchUOMs(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting UOM:', err);
        alert('Failed to delete UOM');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const getStartIndex = () => {
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const getEndIndex = () => {
    return Math.min(currentPage * itemsPerPage, totalItems);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`uoml-page ${theme}`}>
      {/* Stats Cards */}
      <div className="uoml-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="uoml-stat-card" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)` }}>
            <div className="uoml-stat-icon">{stat.icon}</div>
            <div className="uoml-stat-content">
              <p className="uoml-stat-title">{stat.title}</p>
              <p className="uoml-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="uoml-filter-bar">
        <div className="uoml-filter-left">
          <div className="uoml-search-wrapper">
            <FaSearch className="uoml-search-icon" />
            <input
              type="text"
              placeholder="Search UOMs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="uoml-search-input"
            />
            {searchTerm && (
              <button className="uoml-search-clear" onClick={() => setSearchTerm('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="uoml-filter-right">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="uoml-filter-select"
          >
            <option value="all">All Status</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
          <button className="uoml-filter-btn">
            <FaFilter size={12} />
            Filter
          </button>
          <button className="uoml-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="uoml-btn-primary" onClick={handleOpenModal}>
            <FaPlus size={12} />
            Add UOM
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="uoml-active-filters">
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
            className="uoml-clear-filters"
          >
            <FaTimes size={10} /> Clear All
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="uoml-loading">
          <p>Loading UOMs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="uoml-error">
          <p>{error}</p>
          <button onClick={fetchUOMs} className="uoml-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Table - No scroll inside */}
      {!loading && !error && (
        <>
          <div className="uoml-table-wrap">
            <table className="uoml-table">
              <thead>
                <tr>
                  <th className="uoml-th-check">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="uoml-checkbox" />
                  </th>
                  <th className="uoml-th">ID</th>
                  <th className="uoml-th">UOM Name</th>
                  <th className="uoml-th">Symbol</th>
                  <th className="uoml-th">Status</th>
                  <th className="uoml-th">Category</th>
                  <th className="uoml-th uoml-th-meta">
                    <span className="uoml-count-label">{totalItems} total</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                {uoms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="uoml-empty-state">
                      <div className="uoml-empty-content">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <p>No UOMs found</p>
                        <span>Try adjusting your search criteria</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  uoms.map((row) => (
                    <tr
                      key={row.id}
                      className={`uoml-tr ${selected.has(row.id.toString()) ? "uoml-tr-selected" : ""}`}
                      onClick={() => navigate(`/uom/${encodeURIComponent(row.uom_name)}`)}
                    >
                      <td className="uoml-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id.toString()); }}>
                        <input type="checkbox" checked={selected.has(row.id.toString())} onChange={() => toggleRow(row.id.toString())} className="uoml-checkbox" />
                      </td>
                      <td className="uoml-td">{row.id}</td>
                      <td className="uoml-td uoml-td-name">{row.uom_name}</td>
                      <td className="uoml-td">{row.symbol || '-'}</td>
                      <td className="uoml-td">
                        <span className={`uoml-status-badge uoml-status-${row.enabled === 1 ? 'enabled' : 'disabled'}`}>
                          {row.enabled === 1 ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="uoml-td">{row.category}</td>
                      <td className="uoml-td uoml-td-meta">
                        <span className="uoml-ago">{formatDate(row.creation)}</span>
                        <span className="uoml-dot">·</span>
                        <div className="uoml-action-buttons">
                          <button 
                            className="uoml-action-btn uoml-action-view" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/uom/${encodeURIComponent(row.uom_name)}`); }}
                            title="View"
                          >
                            <FaEye size={12} />
                          </button>
                          <button 
                            className="uoml-action-btn uoml-action-edit" 
                            onClick={(e) => { e.stopPropagation(); navigate(`/uom/${encodeURIComponent(row.uom_name)}`); }}
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            className="uoml-action-btn uoml-action-delete" 
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
          <div className="uoml-pagination">
            <div className="uoml-pagination-left">
              <span className="uoml-pagination-label">Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="uoml-page-size-select"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="uoml-pagination-label">entries</span>
            </div>
            <div className="uoml-pagination-center">
              <button 
                onClick={goToFirstPage} 
                disabled={currentPage === 1 || totalItems === 0} 
                className="uoml-page-btn"
              >
                <FaAngleDoubleLeft size={12} />
              </button>
              <button 
                onClick={goToPrevPage} 
                disabled={currentPage === 1 || totalItems === 0} 
                className="uoml-page-btn"
              >
                <FaChevronLeft size={12} />
              </button>
              {totalItems > 0 && getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`uoml-page-btn ${currentPage === page ? 'uoml-page-btn-active' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages || totalItems === 0} 
                className="uoml-page-btn"
              >
                <FaChevronRight size={12} />
              </button>
              <button 
                onClick={goToLastPage} 
                disabled={currentPage === totalPages || totalItems === 0} 
                className="uoml-page-btn"
              >
                <FaAngleDoubleRight size={12} />
              </button>
            </div>
            <div className="uoml-pagination-right">
              <span className="uoml-pagination-info">
                {totalItems > 0 ? (
                  `Showing ${getStartIndex()} to ${getEndIndex()} of ${totalItems} entries`
                ) : (
                  'No entries to show'
                )}
              </span>
            </div>
          </div>
        </>
      )}

      {/* New UOM Modal */}
      {showModal && (
        <div className="uoml-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="uoml-modal">
            <div className="uoml-modal-header">
              <div className="uoml-modal-header-left">
                <div className="uoml-modal-icon">
                  <FaRuler size={16} />
                </div>
                <span className="uoml-modal-title">New UOM</span>
              </div>
              <button className="uoml-modal-close" onClick={handleCloseModal}>
                <FaTimes size={16} />
              </button>
            </div>

            <div className="uoml-modal-body">
              <div className="uoml-field">
                <label className="uoml-label">UOM Name <span className="uoml-req">*</span></label>
                <input
                  className="uoml-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  placeholder="Enter UOM name"
                />
              </div>

              <div className="uoml-field">
                <label className="uoml-label">Category</label>
                <select
                  className="uoml-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="uoml-modal-footer">
              <button className="uoml-btn-edit-full" onClick={() => {
                if (formData.name.trim()) {
                  navigate(`/uom/${encodeURIComponent(formData.name)}`);
                  handleCloseModal();
                }
              }}>
                <FaEdit size={12} /> Edit Full Form
              </button>
              <button 
                className="uoml-btn-save" 
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
      {showDeleteConfirm && selectedUOM && (
        <div className="uoml-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="uoml-modal uoml-modal-delete">
            <div className="uoml-modal-header">
              <span className="uoml-modal-title">Confirm Delete</span>
              <button className="uoml-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <FaTimes size={16} />
              </button>
            </div>
            <div className="uoml-modal-body">
              <p>Are you sure you want to delete this UOM?</p>
              <p className="uoml-modal-item-name"><strong>{selectedUOM.uom_name}</strong></p>
              <p className="uoml-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="uoml-modal-footer">
              <button className="uoml-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="uoml-btn-delete" onClick={confirmDelete}>
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}