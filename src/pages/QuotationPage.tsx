import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilePdf, 
  FaFilter, FaCheckCircle, FaClock, FaTimesCircle,
  FaPrint, FaFileAlt, FaExternalLinkAlt, 
  FaChartLine, FaTimes,  FaSave, FaSpinner,
   FaEnvelope,
} from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import toast from 'react-hot-toast';
import './QuotationPage.css';

interface QuotationItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  customer: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  validTill: string;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
  currency: string;
  items: QuotationItem[];
  notes: string;
  termsConditions: string;
}

export default function Quotation() {
  const navigate = useNavigate();
  
  let theme = 'light';
  try {
    const context = useAdminTheme();
    theme = context.theme;
  } catch (error) {
    console.log('Using default light theme');
  }

  const [filterText, setFilterText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);

  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: '1',
      quotationNumber: 'QT-2026-001',
      customer: 'CUST-001',
      customerName: 'ABC Corporation',
      customerEmail: 'info@abccorp.com',
      customerPhone: '+91-9876543210',
      customerAddress: '123, Business Park, Mumbai, Maharashtra - 400001',
      date: '2026-06-19',
      validTill: '2026-07-19',
      totalAmount: 25000,
      status: 'Sent',
      currency: 'INR',
      notes: 'Urgent delivery required',
      termsConditions: 'Payment within 30 days',
      items: [
        { id: '1', itemCode: 'ITEM-001', itemName: 'Product A', quantity: 10, rate: 1000, amount: 10000 },
        { id: '2', itemCode: 'ITEM-002', itemName: 'Product B', quantity: 5, rate: 3000, amount: 15000 }
      ]
    },
    {
      id: '2',
      quotationNumber: 'QT-2026-002',
      customer: 'CUST-002',
      customerName: 'XYZ Industries',
      customerEmail: 'contact@xyzind.com',
      customerPhone: '+91-8765432109',
      customerAddress: '456, Industrial Area, Pune, Maharashtra - 411001',
      date: '2026-06-18',
      validTill: '2026-07-18',
      totalAmount: 45000,
      status: 'Accepted',
      currency: 'USD',
      notes: '',
      termsConditions: 'Standard terms apply',
      items: [
        { id: '1', itemCode: 'ITEM-003', itemName: 'Product C', quantity: 3, rate: 15000, amount: 45000 }
      ]
    },
    {
      id: '3',
      quotationNumber: 'QT-2026-003',
      customer: 'CUST-003',
      customerName: 'PQR Enterprises',
      customerEmail: 'info@pqr.com',
      customerPhone: '+91-7654321098',
      customerAddress: '789, Commercial Complex, Delhi - 110001',
      date: '2026-06-15',
      validTill: '2026-07-15',
      totalAmount: 12000,
      status: 'Draft',
      currency: 'INR',
      notes: 'Draft quote - pending review',
      termsConditions: 'Subject to management approval',
      items: [
        { id: '1', itemCode: 'ITEM-004', itemName: 'Product D', quantity: 12, rate: 1000, amount: 12000 }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Sent': return 'status-sent';
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      case 'Expired': return 'status-expired';
      case 'Converted': return 'status-converted';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <FaFileAlt size={10} />;
      case 'Sent': return <FaEnvelope size={10} />;
      case 'Accepted': return <FaCheckCircle size={10} />;
      case 'Rejected': return <FaTimesCircle size={10} />;
      case 'Expired': return <FaClock size={10} />;
      case 'Converted': return <FaExternalLinkAlt size={10} />;
      default: return null;
    }
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.quotationNumber.toLowerCase().includes(filterText.toLowerCase()) ||
                         q.customerName.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || q.status === selectedStatus;
    const matchesCurrency = selectedCurrency === 'All' || q.currency === selectedCurrency;
    return matchesSearch && matchesStatus && matchesCurrency;
  });

  const getStatusCount = (status: string) => {
    return quotations.filter(q => q.status === status).length;
  };

  const totalAmount = quotations.reduce((sum, q) => sum + q.totalAmount, 0);
  const acceptedAmount = quotations.filter(q => q.status === 'Accepted').reduce((sum, q) => sum + q.totalAmount, 0);
  const conversionRate = totalAmount > 0 ? Math.round((acceptedAmount / totalAmount) * 100) : 0;

  // View Quotation
  const handleView = (quote: Quotation) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  // Edit Quotation
  const handleEdit = (quote: Quotation) => {
    setSelectedQuote(quote);
    setShowEditModal(true);
  };

  // Update Quotation
  const handleUpdate = () => {
    if (!selectedQuote) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setQuotations(prev => 
        prev.map(q => q.id === selectedQuote.id ? selectedQuote : q)
      );
      setShowEditModal(false);
      setLoading(false);
      toast.success('Quotation updated successfully!');
    }, 1000);
  };

  // Delete Quotation
  const handleDelete = () => {
    if (!selectedQuote) return;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setQuotations(prev => prev.filter(q => q.id !== selectedQuote.id));
      setShowDeleteModal(false);
      setLoading(false);
      toast.success('Quotation deleted successfully!');
    }, 1000);
  };

  // PDF View
  const handlePdfView = (quote: Quotation) => {
    setSelectedQuote(quote);
    setShowPdfModal(true);
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!selectedQuote) return;
    const { name, value } = e.target;
    setSelectedQuote(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle edit item changes
  const handleEditItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
    if (!selectedQuote) return;
    const updatedItems = [...selectedQuote.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      const qty = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const rate = field === 'rate' ? Number(value) : updatedItems[index].rate;
      updatedItems[index].amount = qty * rate;
    }
    
    const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    setSelectedQuote({ ...selectedQuote, items: updatedItems, totalAmount: total });
  };

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Expired', label: 'Expired' }
  ];

  return (
    <div className={`quotation-page ${theme}-theme`}>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Quotations</h1>
          <span className="badge">{quotations.length}</span>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={() => window.print()} title="Print">
            <FaPrint size={14} />
          </button>
          <button className="btn-primary" onClick={() => navigate('/quotation/new')}>
            <FaPlus size={12} /> New Quote
          </button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="compact-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Accepted</span>
          <span className="stat-value stat-accepted">₹{acceptedAmount.toLocaleString()}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Conversion</span>
          <span className="stat-value stat-rate">{conversionRate}%</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value stat-pending">{getStatusCount('Sent') + getStatusCount('Draft')}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search quotes or customers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
          {filterText && (
            <button className="clear-btn" onClick={() => setFilterText('')}>×</button>
          )}
        </div>
        <div className="filter-wrapper">
          <select 
            className="status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({getStatusCount(opt.value === 'All' ? 'All' : opt.value)})
              </option>
            ))}
          </select>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={12} />
          </button>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="expandable-filters">
          <div className="filter-group">
            <label>Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="All">All Currencies</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range">
              <input type="date" placeholder="From" />
              <span>to</span>
              <input type="date" placeholder="To" />
            </div>
          </div>
          <button className="apply-filters">Apply</button>
        </div>
      )}

      {/* Quotations List */}
      <div className="quotes-list">
        {filteredQuotations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaFileAlt size={40} />
            </div>
            <h3>No quotations yet</h3>
            <p>Create your first quotation</p>
            <button className="btn-primary" onClick={() => navigate('/quotation/new')}>
              <FaPlus size={12} /> New Quotation
            </button>
          </div>
        ) : (
          <div className="quotes-table-wrapper">
            <table className="quotes-table">
              <thead>
                <tr>
                  <th>Quote</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((quote) => (
                  <tr key={quote.id} className="quote-row">
                    <td>
                      <span className="quote-number">{quote.quotationNumber}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{quote.customerName}</span>
                        <span className="customer-code">{quote.customer}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">
                        {new Date(quote.date).toLocaleDateString()}
                      </span>
                      <span className="valid-cell">
                        Valid: {new Date(quote.validTill).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {quote.status}
                      </span>
                    </td>
                    <td className="text-right amount-cell">
                      <span className="currency">{quote.currency}</span>
                      {quote.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <div className="action-group">
                        <button 
                          className="action-btn view" 
                          title="View"
                          onClick={() => handleView(quote)}
                        >
                          <FaEye size={12} />
                        </button>
                        <button 
                          className="action-btn pdf" 
                          title="PDF"
                          onClick={() => handlePdfView(quote)}
                        >
                          <FaFilePdf size={12} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(quote)}
                        >
                          <FaEdit size={12} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="list-footer">
        <span>{filteredQuotations.length} of {quotations.length} quotes</span>
        <div className="footer-actions">
          <span className="conversion-badge">
            <FaChartLine size={11} /> {conversionRate}% conversion
          </span>
        </div>
      </div>

      {/* ====== VIEW MODAL ====== */}
      {showViewModal && selectedQuote && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedQuote.quotationNumber}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body view-body">
              <div className="view-grid">
                <div className="view-section">
                  <h4>Customer Details</h4>
                  <div className="view-row"><label>Name:</label><span>{selectedQuote.customerName}</span></div>
                  <div className="view-row"><label>Code:</label><span>{selectedQuote.customer}</span></div>
                  <div className="view-row"><label>Email:</label><span>{selectedQuote.customerEmail || 'N/A'}</span></div>
                  <div className="view-row"><label>Phone:</label><span>{selectedQuote.customerPhone || 'N/A'}</span></div>
                  <div className="view-row"><label>Address:</label><span>{selectedQuote.customerAddress || 'N/A'}</span></div>
                </div>
                <div className="view-section">
                  <h4>Quote Details</h4>
                  <div className="view-row"><label>Status:</label><span className={`status-badge ${getStatusColor(selectedQuote.status)}`}>{selectedQuote.status}</span></div>
                  <div className="view-row"><label>Date:</label><span>{new Date(selectedQuote.date).toLocaleDateString()}</span></div>
                  <div className="view-row"><label>Valid Till:</label><span>{new Date(selectedQuote.validTill).toLocaleDateString()}</span></div>
                  <div className="view-row"><label>Currency:</label><span>{selectedQuote.currency}</span></div>
                  <div className="view-row"><label>Total:</label><span className="view-total">{selectedQuote.currency} {selectedQuote.totalAmount.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="view-section full-width">
                <h4>Items</h4>
                <table className="view-items-table">
                  <thead>
                    <tr><th>Code</th><th>Name</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>{selectedQuote.currency} {item.rate}</td>
                        <td>{selectedQuote.currency} {item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={4} className="total-label">Total</td><td className="total-amount">{selectedQuote.currency} {selectedQuote.totalAmount}</td></tr>
                  </tfoot>
                </table>
              </div>
              {selectedQuote.notes && (
                <div className="view-section full-width">
                  <h4>Notes</h4>
                  <p>{selectedQuote.notes}</p>
                </div>
              )}
              {selectedQuote.termsConditions && (
                <div className="view-section full-width">
                  <h4>Terms & Conditions</h4>
                  <p>{selectedQuote.termsConditions}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => handlePdfView(selectedQuote)}>
                <FaFilePdf size={12} /> PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== EDIT MODAL ====== */}
      {showEditModal && selectedQuote && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit {selectedQuote.quotationNumber}</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body edit-body">
              <div className="edit-form">
                <div className="edit-grid">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={selectedQuote.customerName}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Customer Code</label>
                    <input
                      type="text"
                      name="customer"
                      value={selectedQuote.customer}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={selectedQuote.customerEmail}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="customerPhone"
                      value={selectedQuote.customerPhone}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="customerAddress"
                      value={selectedQuote.customerAddress}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={selectedQuote.date}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Valid Till</label>
                    <input
                      type="date"
                      name="validTill"
                      value={selectedQuote.validTill}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={selectedQuote.status}
                      onChange={handleEditChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Expired">Expired</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      name="currency"
                      value={selectedQuote.currency}
                      onChange={handleEditChange}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <h4>Items</h4>
                <div className="edit-items-table-wrapper">
                  <table className="edit-items-table">
                    <thead>
                      <tr><th>Code</th><th>Name</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {selectedQuote.items.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="text"
                              value={item.itemCode}
                              onChange={(e) => handleEditItemChange(index, 'itemCode', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => handleEditItemChange(index, 'itemName', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleEditItemChange(index, 'quantity', Number(e.target.value))}
                              min="1"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleEditItemChange(index, 'rate', Number(e.target.value))}
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="amount-cell">{selectedQuote.currency} {item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr><td colSpan={4} className="total-label">Total</td><td className="total-amount">{selectedQuote.currency} {selectedQuote.totalAmount.toFixed(2)}</td></tr>
                    </tfoot>
                  </table>
                </div>

                <div className="edit-grid">
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={selectedQuote.notes}
                      onChange={handleEditChange}
                      rows={2}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Terms & Conditions</label>
                    <textarea
                      name="termsConditions"
                      value={selectedQuote.termsConditions}
                      onChange={handleEditChange}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate} disabled={loading}>
                {loading && <FaSpinner className="spinning" />}
                <FaSave size={12} /> Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== DELETE MODAL ====== */}
      {showDeleteModal && selectedQuote && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Quotation</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body delete-body">
              <div className="delete-icon">
                <FaTrash size={48} />
              </div>
              <h3>Are you sure?</h3>
              <p>
                You are about to delete <strong>{selectedQuote.quotationNumber}</strong> for 
                <strong> {selectedQuote.customerName}</strong>.
              </p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete} disabled={loading}>
                {loading && <FaSpinner className="spinning" />}
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== PDF MODAL ====== */}
      {showPdfModal && selectedQuote && (
        <div className="modal-overlay" onClick={() => setShowPdfModal(false)}>
          <div className="modal-container pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedQuote.quotationNumber} - PDF Preview</h2>
              <button className="modal-close" onClick={() => setShowPdfModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body pdf-body">
              {/* PDF Content */}
              <div className="pdf-content">
                <div className="pdf-header">
                  <div className="pdf-title">QUOTATION</div>
                  <div className="pdf-number">{selectedQuote.quotationNumber}</div>
                </div>
                
                <div className="pdf-company">
                  <h2>Manufacturing ERP</h2>
                  <p>123, Business Park, Mumbai, Maharashtra - 400001</p>
                  <p>Phone: +91-9876543210 | Email: info@manufacturingerp.com</p>
                </div>

                <div className="pdf-customer">
                  <div className="pdf-section-title">Customer Details</div>
                  <div className="pdf-row"><strong>Name:</strong> {selectedQuote.customerName}</div>
                  <div className="pdf-row"><strong>Code:</strong> {selectedQuote.customer}</div>
                  <div className="pdf-row"><strong>Email:</strong> {selectedQuote.customerEmail || 'N/A'}</div>
                  <div className="pdf-row"><strong>Phone:</strong> {selectedQuote.customerPhone || 'N/A'}</div>
                  <div className="pdf-row"><strong>Address:</strong> {selectedQuote.customerAddress || 'N/A'}</div>
                </div>

                <div className="pdf-dates">
                  <div className="pdf-row"><strong>Date:</strong> {new Date(selectedQuote.date).toLocaleDateString()}</div>
                  <div className="pdf-row"><strong>Valid Till:</strong> {new Date(selectedQuote.validTill).toLocaleDateString()}</div>
                  <div className="pdf-row"><strong>Status:</strong> {selectedQuote.status}</div>
                  <div className="pdf-row"><strong>Currency:</strong> {selectedQuote.currency}</div>
                </div>

                <table className="pdf-items-table">
                  <thead>
                    <tr><th>Item Code</th><th>Item Name</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    {selectedQuote.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantity}</td>
                        <td>{selectedQuote.currency} {item.rate}</td>
                        <td>{selectedQuote.currency} {item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr><td colSpan={4} className="pdf-total-label">Total Amount</td><td className="pdf-total-amount">{selectedQuote.currency} {selectedQuote.totalAmount}</td></tr>
                  </tfoot>
                </table>

                {selectedQuote.notes && (
                  <div className="pdf-notes">
                    <div className="pdf-section-title">Notes</div>
                    <p>{selectedQuote.notes}</p>
                  </div>
                )}

                {selectedQuote.termsConditions && (
                  <div className="pdf-terms">
                    <div className="pdf-section-title">Terms & Conditions</div>
                    <p>{selectedQuote.termsConditions}</p>
                  </div>
                )}

                <div className="pdf-footer">
                  <p>This is a computer-generated quotation. No signature required.</p>
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPdfModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => {
                toast.success('PDF downloaded successfully!');
                setShowPdfModal(false);
              }}>
                <FaFilePdf size={12} /> Download PDF
              </button>
              <button className="btn-primary" onClick={() => {
                toast.success('PDF sent to email!');
                setShowPdfModal(false);
              }}>
                <FaEnvelope size={12} /> Email PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}