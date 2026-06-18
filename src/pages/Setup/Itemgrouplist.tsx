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
  FaFolder,
  FaFolderOpen,
  FaTags,
  FaChartPie,
} from 'react-icons/fa';
import "./ItemGroupList.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface ItemGroup {
  id: string;
  itemGroupName: string;
  parentItemGroup: string;
  isGroup: boolean;
  createdAgo: string;
  comments: number;
}

const MOCK_DATA: ItemGroup[] = [
  { id: "Consumable", itemGroupName: "Consumable", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Sub Assemblies", itemGroupName: "Sub Assemblies", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Services", itemGroupName: "Services", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Raw Material", itemGroupName: "Raw Material", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Products", itemGroupName: "Products", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "All Item Groups", itemGroupName: "All Item Groups", parentItemGroup: "All Item Groups", isGroup: true, createdAgo: "4 h", comments: 0 },
];

export default function ItemGroupList() {
  const navigate = useNavigate();
  const { theme } = useAdminTheme();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemGroup | null>(null);

  // Filter data based on search and status
  const filteredData = MOCK_DATA.filter(item => {
    const matchesSearch = item.itemGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'group' && item.isGroup) ||
                         (statusFilter === 'item' && !item.isGroup);
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalGroups = MOCK_DATA.filter(item => item.isGroup).length;
  const totalItemsCount = MOCK_DATA.filter(item => !item.isGroup).length;

  const stats = [
    { title: 'Total', value: MOCK_DATA.length, icon: <FaFolder />, color: '#6366f1' },
    { title: 'Parent Groups', value: totalGroups, icon: <FaFolderOpen />, color: '#10b981' },
    { title: 'Sub Items', value: totalItemsCount, icon: <FaTags />, color: '#f59e0b' },
    { title: 'Categories', value: Math.ceil(MOCK_DATA.length / 2), icon: <FaChartPie />, color: '#3b82f6' },
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

  const handleDelete = (item: ItemGroup) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log('Deleting:', selectedItem);
    setShowDeleteConfirm(false);
    setSelectedItem(null);
  };

  const handleEdit = (item: ItemGroup) => {
    navigate(`/item-group/${encodeURIComponent(item.id)}`);
  };

  const handleView = (item: ItemGroup) => {
    navigate(`/item-group/${encodeURIComponent(item.id)}`);
  };

  return (
    <div className={`igl-page ${theme}`}>
      {/* Stats Cards - Same as Reservations */}
      <div className="igl-stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="igl-stat-card" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}cc 100%)` }}>
            <div className="igl-stat-icon">{stat.icon}</div>
            <div className="igl-stat-content">
              <p className="igl-stat-title">{stat.title}</p>
              <p className="igl-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="igl-filter-bar">
        <div className="igl-filter-left">
          <div className="igl-search-wrapper">
            <FaSearch className="igl-search-icon" />
            <input
              type="text"
              placeholder="Search item groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="igl-search-input"
            />
            {searchTerm && (
              <button className="igl-search-clear" onClick={() => setSearchTerm('')}>
                <FaTimes size={12} />
              </button>
            )}
          </div>
        </div>
        <div className="igl-filter-right">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="igl-filter-select"
          >
            <option value="all">All Types</option>
            <option value="group">Parent Groups</option>
            <option value="item">Sub Items</option>
          </select>
          <button className="igl-filter-btn">
            <FaFilter size={12} />
            Filter
          </button>
          <button className="igl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="igl-btn-primary" onClick={() => navigate("/item-group/new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Item Group
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="igl-active-filters">
          <FaFilter size={12} style={{ color: 'var(--primary-color)' }} />
          <span style={{ color: 'var(--text-primary)' }}>Active filters:</span>
          {searchTerm && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Search:</strong> "{searchTerm}"
            </span>
          )}
          {statusFilter !== 'all' && (
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Type:</strong> {statusFilter === 'group' ? 'Parent Groups' : 'Sub Items'}
            </span>
          )}
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
            className="igl-clear-filters"
          >
            <FaTimes size={10} /> Clear All
          </button>
        </div>
      )}

      {/* Table */}
      <div className="igl-table-wrap">
        <table className="igl-table">
          <thead>
            <tr>
              <th className="igl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="igl-checkbox" />
              </th>
              <th className="igl-th">ID</th>
              <th className="igl-th">Item Group Name</th>
              <th className="igl-th">Parent Item Group</th>
              <th className="igl-th">Type</th>
              <th className="igl-th igl-th-right">
                <span className="igl-count-label">{totalItems} of {MOCK_DATA.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #9ca3af)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="igl-empty-state">
                  <div className="igl-empty-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>No item groups found</p>
                    <span>Try adjusting your search criteria</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`igl-tr ${selected.has(row.id) ? "igl-tr-selected" : ""}`}
                >
                  <td className="igl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="igl-checkbox" />
                  </td>
                  <td className="igl-td igl-td-id">{row.id}</td>
                  <td className="igl-td">{row.itemGroupName}</td>
                  <td className="igl-td">{row.parentItemGroup}</td>
                  <td className="igl-td">
                    <span className={`igl-type-badge ${row.isGroup ? 'igl-type-group' : 'igl-type-item'}`}>
                      {row.isGroup ? 'Parent Group' : 'Sub Item'}
                    </span>
                  </td>
                  <td className="igl-td igl-td-meta">
                    <span className="igl-ago">{row.createdAgo}</span>
                    <button className="igl-comment-btn" onClick={(e) => e.stopPropagation()}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {row.comments}
                    </button>
                    <span className="igl-dot">·</span>
                    <div className="igl-action-buttons">
                      <button 
                        className="igl-action-btn igl-action-view" 
                        onClick={(e) => { e.stopPropagation(); handleView(row); }}
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button 
                        className="igl-action-btn igl-action-edit" 
                        onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button 
                        className="igl-action-btn igl-action-delete" 
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
        <div className="igl-pagination">
          <div className="igl-pagination-left">
            <span className="igl-pagination-label">Show:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="igl-page-size-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="igl-pagination-label">entries</span>
          </div>
          <div className="igl-pagination-center">
            <button 
              onClick={goToFirstPage} 
              disabled={currentPage === 1} 
              className="igl-page-btn"
            >
              <FaAngleDoubleLeft size={12} />
            </button>
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage === 1} 
              className="igl-page-btn"
            >
              <FaChevronLeft size={12} />
            </button>
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`igl-page-btn ${currentPage === page ? 'igl-page-btn-active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages} 
              className="igl-page-btn"
            >
              <FaChevronRight size={12} />
            </button>
            <button 
              onClick={goToLastPage} 
              disabled={currentPage === totalPages} 
              className="igl-page-btn"
            >
              <FaAngleDoubleRight size={12} />
            </button>
          </div>
          <div className="igl-pagination-right">
            <span className="igl-pagination-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedItem && (
        <div className="igl-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="igl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="igl-modal-header">
              <h3>Confirm Delete</h3>
              <button className="igl-modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="igl-modal-body">
              <p>Are you sure you want to delete this item group?</p>
              <p className="igl-modal-item-name"><strong>{selectedItem.itemGroupName}</strong></p>
              <p className="igl-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="igl-modal-footer">
              <button className="igl-modal-btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="igl-modal-btn-delete" onClick={confirmDelete}>
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}