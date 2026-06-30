import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilePdf, FaEnvelope,  FaFilter,  FaCheckCircle, FaClock, FaTimesCircle, FaPrint } from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import './SalesInvoice.css';

interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerName: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue' | 'Cancelled';
  currency: string;
  salesOrder: string;
  items: number;
}

export default function SalesInvoice() {
  const navigate = useNavigate();
  
  // Safe theme usage
  let theme = 'light';
  try {
    const context = useAdminTheme();
    theme = context.theme;
  } catch (error) {
    console.log('Using default light theme');
  }

  const [filterText, setFilterText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [invoices] = useState<SalesInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      customer: 'CUST-001',
      customerName: 'ABC Corporation',
      date: '2026-06-19',
      dueDate: '2026-07-19',
      totalAmount: 25000,
      paidAmount: 25000,
      status: 'Paid',
      currency: 'INR',
      salesOrder: 'SO-2026-001',
      items: 5
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      customer: 'CUST-002',
      customerName: 'XYZ Industries',
      date: '2026-06-18',
      dueDate: '2026-07-18',
      totalAmount: 45000,
      paidAmount: 25000,
      status: 'Partial',
      currency: 'USD',
      salesOrder: 'SO-2026-002',
      items: 3
    },
    {
      id: '3',
      invoiceNumber: 'INV-2026-003',
      customer: 'CUST-003',
      customerName: 'PQR Enterprises',
      date: '2026-06-15',
      dueDate: '2026-07-15',
      totalAmount: 12000,
      paidAmount: 0,
      status: 'Unpaid',
      currency: 'INR',
      salesOrder: 'SO-2026-003',
      items: 2
    },
    {
      id: '4',
      invoiceNumber: 'INV-2026-004',
      customer: 'CUST-004',
      customerName: 'LMN Solutions',
      date: '2026-05-20',
      dueDate: '2026-06-20',
      totalAmount: 32000,
      paidAmount: 0,
      status: 'Overdue',
      currency: 'INR',
      salesOrder: 'SO-2026-004',
      items: 4
    },
    {
      id: '5',
      invoiceNumber: 'INV-2026-005',
      customer: 'CUST-005',
      customerName: 'DEF Technologies',
      date: '2026-06-17',
      dueDate: '2026-07-17',
      totalAmount: 18000,
      paidAmount: 18000,
      status: 'Paid',
      currency: 'EUR',
      salesOrder: 'SO-2026-005',
      items: 6
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'status-paid';
      case 'Partial': return 'status-partial';
      case 'Unpaid': return 'status-unpaid';
      case 'Overdue': return 'status-overdue';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <FaCheckCircle size={12} />;
      case 'Partial': return <FaClock size={12} />;
      case 'Unpaid': return <FaTimesCircle size={12} />;
      case 'Overdue': return <FaClock size={12} />;
      case 'Cancelled': return <FaTimesCircle size={12} />;
      default: return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(filterText.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(filterText.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || invoice.status === selectedStatus;
    const matchesCurrency = selectedCurrency === 'All' || invoice.currency === selectedCurrency;
    const matchesDate = (!dateRange.start || invoice.date >= dateRange.start) &&
                       (!dateRange.end || invoice.date <= dateRange.end);
    return matchesSearch && matchesStatus && matchesCurrency && matchesDate;
  });

  const getStatusCount = (status: string) => {
    return invoices.filter(inv => inv.status === status).length;
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalUnpaid = totalAmount - totalPaid;

  return (
    <div className={`sales-invoice-page ${theme}-theme`}>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Sales Invoices</h1>
          <span className="invoice-count">{invoices.length} Invoices</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => window.print()}>
            <FaPrint size={14} /> Print
          </button>
          <button className="btn-primary" onClick={() => navigate('/sales-invoice/new')}>
            <FaPlus size={14} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card stat-total">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <div className="stat-label">Total Invoices</div>
            <div className="stat-value">{invoices.length}</div>
          </div>
        </div>
        <div className="stat-card stat-amount">
          <div className="stat-icon"><FaFilePdf /></div>
          <div className="stat-content">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">₹{totalAmount.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card stat-paid">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <div className="stat-label">Paid Amount</div>
            <div className="stat-value">₹{totalPaid.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card stat-unpaid">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-content">
            <div className="stat-label">Unpaid Amount</div>
            <div className="stat-value">₹{totalUnpaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Status Quick Filters */}
      <div className="status-filters">
        <button 
          className={`filter-pill ${selectedStatus === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('All')}
        >
          All ({invoices.length})
        </button>
        <button 
          className={`filter-pill status-paid ${selectedStatus === 'Paid' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Paid')}
        >
          <FaCheckCircle /> Paid ({getStatusCount('Paid')})
        </button>
        <button 
          className={`filter-pill status-partial ${selectedStatus === 'Partial' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Partial')}
        >
          <FaClock /> Partial ({getStatusCount('Partial')})
        </button>
        <button 
          className={`filter-pill status-unpaid ${selectedStatus === 'Unpaid' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Unpaid')}
        >
          <FaTimesCircle /> Unpaid ({getStatusCount('Unpaid')})
        </button>
        <button 
          className={`filter-pill status-overdue ${selectedStatus === 'Overdue' ? 'active' : ''}`}
          onClick={() => setSelectedStatus('Overdue')}
        >
          <FaClock /> Overdue ({getStatusCount('Overdue')})
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by invoice #, customer..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            className="filter-select"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            <option value="All">All Currencies</option>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input 
            type="date" 
            className="date-filter" 
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            placeholder="From"
          />
          <input 
            type="date" 
            className="date-filter" 
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            placeholder="To"
          />
          <button className="filter-btn">
            <FaFilter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="invoices-container">
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaFilePdf size={64} />
            </div>
            <h3 className="empty-title">No invoices found</h3>
            <p className="empty-subtitle">Create your first sales invoice to get started</p>
            <button className="btn-primary" onClick={() => navigate('/sales-invoice/new')}>
              <FaPlus size={14} /> Create Invoice
            </button>
          </div>
        ) : (
          <div className="invoices-table-wrapper">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="invoice-row">
                    <td>
                      <span className="invoice-number">{invoice.invoiceNumber}</span>
                      <span className="invoice-order-ref">SO: {invoice.salesOrder}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{invoice.customerName}</div>
                        <div className="customer-code">{invoice.customer}</div>
                      </div>
                    </td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>
                      <span className={new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid' ? 'overdue-date' : ''}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)} {invoice.status}
                      </span>
                    </td>
                    <td className="text-center">{invoice.items}</td>
                    <td className="amount-cell">{invoice.currency} {invoice.totalAmount.toLocaleString()}</td>
                    <td className="amount-cell paid-amount">{invoice.currency} {invoice.paidAmount.toLocaleString()}</td>
                    <td className="amount-cell balance-amount">
                      {invoice.currency} {(invoice.totalAmount - invoice.paidAmount).toLocaleString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <FaEye size={14} />
                        </button>
                        <button className="action-btn edit-btn" title="Edit">
                          <FaEdit size={14} />
                        </button>
                        <button className="action-btn pdf-btn" title="Download PDF">
                          <FaFilePdf size={14} />
                        </button>
                        <button className="action-btn email-btn" title="Send Email">
                          <FaEnvelope size={14} />
                        </button>
                        <button className="action-btn delete-btn" title="Delete">
                          <FaTrash size={14} />
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

      {/* Footer Stats */}
      <div className="table-footer">
        <div className="footer-info">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
        <div className="footer-summary">
          <span>Total: ₹{totalAmount.toLocaleString()}</span>
          <span>Paid: ₹{totalPaid.toLocaleString()}</span>
          <span className="unpaid-summary">Unpaid: ₹{totalUnpaid.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}