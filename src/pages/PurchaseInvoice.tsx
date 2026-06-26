import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, 
  FaTimes, FaSpinner, FaCopy, FaEye,
  FaFileAlt, FaCalendarAlt, FaCheckCircle,
  FaTimesCircle, FaClock, FaExclamationTriangle,
  FaBuilding, FaBox, FaPaperPlane,
  FaDollarSign, FaPrint, FaFilePdf, FaEnvelope,
  FaCreditCard, FaReceipt
} from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import toast from 'react-hot-toast';

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierCode: string;
  purchaseOrder: string;
  status: 'Draft' | 'Submitted' | 'Partially Paid' | 'Fully Paid' | 'Overdue' | 'Cancelled';
  date: string;
  dueDate: string;
  currency: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  itemsCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function PurchaseInvoice() {
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
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [loading, setLoading] = useState(false);

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'PI-2026-001',
      supplier: 'ABC Manufacturing Co.',
      supplierCode: 'SUP-001',
      purchaseOrder: 'PO-2026-001',
      status: 'Partially Paid',
      date: '2026-06-20',
      dueDate: '2026-07-20',
      currency: 'INR',
      totalAmount: 175000,
      paidAmount: 75000,
      balanceAmount: 100000,
      itemsCount: 2,
      createdBy: 'Tejas Tarte',
      createdAt: '2026-06-20T10:00:00Z',
      updatedAt: '2026-06-20T10:00:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'PI-2026-002',
      supplier: 'XYZ Electronics Ltd.',
      supplierCode: 'SUP-002',
      purchaseOrder: 'PO-2026-002',
      status: 'Fully Paid',
      date: '2026-06-18',
      dueDate: '2026-07-18',
      currency: 'USD',
      totalAmount: 45000,
      paidAmount: 45000,
      balanceAmount: 0,
      itemsCount: 3,
      createdBy: 'Nirjala Bagal',
      createdAt: '2026-06-18T10:00:00Z',
      updatedAt: '2026-06-18T10:00:00Z'
    },
    {
      id: '3',
      invoiceNumber: 'PI-2026-003',
      supplier: 'PQR Packaging Solutions',
      supplierCode: 'SUP-003',
      purchaseOrder: 'PO-2026-003',
      status: 'Draft',
      date: '2026-06-22',
      dueDate: '2026-07-22',
      currency: 'INR',
      totalAmount: 120000,
      paidAmount: 0,
      balanceAmount: 120000,
      itemsCount: 2,
      createdBy: 'P S Kamthe',
      createdAt: '2026-06-22T10:00:00Z',
      updatedAt: '2026-06-22T10:00:00Z'
    }
  ]);

  const suppliers = ['ABC Manufacturing Co.', 'XYZ Electronics Ltd.', 'PQR Packaging Solutions'];
  const statusOptions = ['Draft', 'Submitted', 'Partially Paid', 'Fully Paid', 'Overdue', 'Cancelled'];

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(filterText.toLowerCase()) ||
                         inv.supplier.toLowerCase().includes(filterText.toLowerCase()) ||
                         inv.purchaseOrder.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || inv.status === selectedStatus;
    const matchesSupplier = selectedSupplier === 'All' || inv.supplier === selectedSupplier;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Submitted': return 'status-submitted';
      case 'Partially Paid': return 'status-partial';
      case 'Fully Paid': return 'status-paid';
      case 'Overdue': return 'status-overdue';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <FaFileAlt size={10} />;
      case 'Submitted': return <FaPaperPlane size={10} />;
      case 'Partially Paid': return <FaClock size={10} />;
      case 'Fully Paid': return <FaCheckCircle size={10} />;
      case 'Overdue': return <FaExclamationTriangle size={10} />;
      case 'Cancelled': return <FaTimesCircle size={10} />;
      default: return null;
    }
  };

  const handleCreate = () => {
    navigate('/purchase-invoice/new');
  };

  const handleEdit = (invoice: PurchaseInvoice) => {
    navigate(`/purchase-invoice/edit/${invoice.id}`);
  };

  const handleView = (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleDelete = (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedInvoice) return;
    setLoading(true);
    
    setTimeout(() => {
      setInvoices(prev => prev.filter(inv => inv.id !== selectedInvoice.id));
      setShowDeleteModal(false);
      setLoading(false);
      toast.success('Purchase Invoice deleted successfully!');
    }, 1000);
  };

  const handleDuplicate = (invoice: PurchaseInvoice) => {
    const newInvoice: PurchaseInvoice = {
      ...invoice,
      id: String(invoices.length + 1),
      invoiceNumber: `PI-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      status: 'Draft',
      paidAmount: 0,
      balanceAmount: invoice.totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
    toast.success('Purchase Invoice duplicated successfully!');
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'Fully Paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className={`purchase-invoice-page ${theme}-theme`}>
      <style>{`
        .purchase-invoice-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--layout-bg, #f5f7fb);
          padding: 16px 24px;
          gap: 12px;
          overflow-y: auto;
          font-family: -apple-system, "Inter", "Segoe UI", Roboto, sans-serif;
          color: var(--text-primary, #1f2433);
        }

        .purchase-invoice-page::-webkit-scrollbar { width: 4px; }
        .purchase-invoice-page::-webkit-scrollbar-track { background: transparent; }
        .purchase-invoice-page::-webkit-scrollbar-thumb { background: var(--border-color, #e5e7eb); border-radius: 2px; }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0;
        }

        .badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
          background: var(--card-bg, #ffffff);
          padding: 1px 10px;
          border-radius: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 16px;
          background: var(--primary-color, #6366f1);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary:hover {
          background: var(--primary-hover, #4f46e5);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          background: var(--card-bg, #ffffff);
          color: var(--text-primary, #1f2433);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover {
          background: var(--layout-bg, #f3f4f6);
        }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .compact-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 16px;
          background: var(--card-bg, #ffffff);
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          flex-shrink: 0;
        }

        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
          font-weight: 500;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
        }

        .stat-paid {
          color: #10b981;
        }

        .stat-overdue {
          color: #ef4444;
        }

        .stat-divider {
          width: 1px;
          height: 20px;
          background: var(--border-color, #e5e7eb);
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          padding: 0 12px;
          transition: all 0.15s ease;
          height: 34px;
        }

        .search-wrapper:focus-within {
          border-color: var(--primary-color, #6366f1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
        }

        .search-icon {
          color: var(--text-secondary, #9ca3af);
          font-size: 13px;
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          background: transparent;
          padding: 6px 10px;
          font-size: 13px;
          color: var(--text-primary, #374151);
          outline: none;
          flex: 1;
          min-width: 120px;
        }

        .search-input::placeholder {
          color: var(--text-secondary, #9ca3af);
        }

        .clear-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: var(--border-color, #e5e7eb);
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .clear-btn:hover {
          background: var(--text-secondary, #6b7280);
          color: white;
        }

        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          background: var(--card-bg, #ffffff);
          color: var(--text-secondary, #6b7280);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          height: 34px;
        }

        .filter-toggle:hover {
          background: var(--nav-hover, #f3f4f6);
        }

        .filter-toggle.active {
          border-color: var(--primary-color, #6366f1);
          color: var(--primary-color, #6366f1);
          background: color-mix(in srgb, var(--primary-color) 8%, transparent);
        }

        .result-count {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .expandable-filters {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          padding: 12px 16px;
          background: var(--card-bg, #ffffff);
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          animation: slideDown 0.2s ease;
          flex-wrap: wrap;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-group label {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
        }

        .filter-group select {
          padding: 4px 10px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          font-size: 12px;
          background: var(--input-bg, #ffffff);
          color: var(--text-primary, #374151);
          outline: none;
          height: 30px;
        }

        .filter-group select:focus {
          border-color: var(--primary-color, #6366f1);
        }

        .apply-filters {
          padding: 4px 16px;
          background: var(--primary-color, #6366f1);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          height: 30px;
          transition: all 0.15s ease;
        }

        .apply-filters:hover {
          background: var(--primary-hover, #4f46e5);
        }

        .invoice-container {
          flex: 1;
          min-height: 0;
          background: var(--card-bg, #ffffff);
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
          height: 100%;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 1000px;
        }

        .invoice-table thead {
          background: var(--layout-bg, #f8f9fa);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .invoice-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .invoice-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color, #f3f4f6);
          color: var(--text-primary, #374151);
        }

        .invoice-row {
          transition: background 0.15s ease;
        }

        .invoice-row:hover {
          background: var(--nav-hover, #f9fafb);
        }

        .number-cell {
          font-weight: 600;
          color: var(--primary-color, #6366f1);
          font-size: 12px;
        }

        .supplier-cell {
          font-weight: 500;
          color: var(--text-primary, #1f2433);
        }

        .po-cell {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .date-cell {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }

        .amount-cell {
          font-weight: 600;
          color: var(--text-primary, #1f2433);
        }

        .paid-cell {
          font-weight: 500;
          color: #10b981;
        }

        .balance-cell {
          font-weight: 600;
          color: #f59e0b;
        }

        .balance-cell.overdue {
          color: #ef4444;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .status-draft {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-submitted {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-partial {
          background: #fef3c7;
          color: #92400e;
        }

        .status-paid {
          background: #d1fae5;
          color: #065f46;
        }

        .status-overdue {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-cancelled {
          background: #f3f4f6;
          color: #6b7280;
        }

        .action-group {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
          background: transparent;
          color: var(--text-secondary, #6b7280);
        }

        .action-btn:hover {
          background: var(--nav-hover, #f3f4f6);
        }

        .action-btn.view:hover { color: var(--primary-color, #6366f1); }
        .action-btn.edit:hover { color: #f59e0b; }
        .action-btn.copy:hover { color: #8b5cf6; }
        .action-btn.delete:hover { color: #ef4444; background: #fef2f2; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
          text-align: center;
        }

        .empty-icon {
          color: var(--text-secondary, #9ca3af);
          margin-bottom: 12px;
        }

        .empty-state h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0 0 4px 0;
        }

        .empty-state p {
          font-size: 13px;
          color: var(--text-secondary, #6b7280);
          margin: 0 0 16px 0;
        }

        .list-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 4px 0 4px;
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
          flex-shrink: 0;
        }

        .conversion-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
          color: var(--primary-color, #6366f1);
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: var(--card-bg, #ffffff);
          border-radius: 12px;
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .view-modal { max-width: 700px; }
        .delete-modal { max-width: 420px; }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          flex-shrink: 0;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0;
        }

        .modal-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          font-size: 20px;
          transition: all 0.15s ease;
        }

        .modal-close:hover {
          background: var(--nav-hover, #f3f4f6);
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 12px 20px;
          border-top: 1px solid var(--border-color, #e5e7eb);
          flex-shrink: 0;
        }

        .view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .view-section {
          padding: 12px;
          background: var(--layout-bg, #f8f9fa);
          border-radius: 8px;
        }

        .view-section.full-width {
          grid-column: 1 / -1;
        }

        .view-section h4 {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-row {
          display: flex;
          padding: 3px 0;
          font-size: 13px;
        }

        .view-row label {
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
          min-width: 110px;
        }

        .view-row span {
          color: var(--text-primary, #1f2433);
        }

        .delete-body {
          text-align: center;
          padding: 32px 20px;
        }

        .delete-icon {
          color: #ef4444;
          margin-bottom: 16px;
        }

        .delete-body h3 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0 0 8px 0;
        }

        .delete-body p {
          font-size: 14px;
          color: var(--text-secondary, #6b7280);
          margin: 4px 0;
        }

        .delete-warning {
          color: #ef4444 !important;
          font-weight: 500;
          margin-top: 12px !important;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .purchase-invoice-page { padding: 12px 16px; }
          .page-header { flex-direction: column; align-items: stretch; }
          .header-actions { flex-wrap: wrap; justify-content: flex-end; }
          .search-bar { flex-direction: column; align-items: stretch; }
          .filter-wrapper { justify-content: space-between; }
          .invoice-table { min-width: 700px; }
          .modal-container { max-width: 100%; margin: 10px; }
          .modal-footer { flex-direction: column; }
          .modal-footer button { width: 100%; justify-content: center; }
          .view-grid { grid-template-columns: 1fr; }
          .compact-stats { flex-wrap: wrap; gap: 8px; padding: 8px 12px; }
          .stat-divider { display: none; }
        }

        @media (max-width: 480px) {
          .purchase-invoice-page { padding: 8px 12px; }
          .invoice-table { font-size: 12px; min-width: 600px; }
          .invoice-table th, .invoice-table td { padding: 6px 10px; }
          .action-group { gap: 0; }
          .action-btn { width: 24px; height: 24px; }
        }

        .dark-theme .purchase-invoice-page { background: var(--layout-bg, #0f172a); }
        .dark-theme .page-title { color: var(--text-primary, #f8fafc); }
        .dark-theme .badge { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-secondary, #94a3b8); }
        .dark-theme .search-wrapper { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .search-input { color: var(--text-primary, #f8fafc); }
        .dark-theme .search-input::placeholder { color: var(--text-secondary, #64748b); }
        .dark-theme .filter-toggle { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-secondary, #94a3b8); }
        .dark-theme .filter-toggle:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .expandable-filters { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .filter-group select { background: var(--input-bg, #0f172a); border-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .invoice-container { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .invoice-table thead { background: var(--layout-bg, #0f172a); }
        .dark-theme .invoice-table th { color: var(--text-secondary, #94a3b8); border-bottom-color: var(--border-color, #334155); }
        .dark-theme .invoice-table td { border-bottom-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .invoice-row:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .number-cell { color: var(--primary-color, #818cf8); }
        .dark-theme .supplier-cell { color: var(--text-primary, #f8fafc); }
        .dark-theme .po-cell { color: var(--text-secondary, #94a3b8); }
        .dark-theme .date-cell { color: var(--text-secondary, #94a3b8); }
        .dark-theme .amount-cell { color: var(--text-primary, #f8fafc); }
        .dark-theme .paid-cell { color: #34d399; }
        .dark-theme .balance-cell { color: #fbbf24; }
        .dark-theme .balance-cell.overdue { color: #f87171; }
        .dark-theme .action-btn { color: var(--text-secondary, #64748b); }
        .dark-theme .action-btn:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .modal-container { background: var(--card-bg, #1e293b); }
        .dark-theme .modal-header { border-bottom-color: var(--border-color, #334155); }
        .dark-theme .modal-header h2 { color: var(--text-primary, #f8fafc); }
        .dark-theme .modal-close { color: var(--text-secondary, #94a3b8); }
        .dark-theme .modal-close:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .modal-footer { border-top-color: var(--border-color, #334155); }
        .dark-theme .view-section { background: var(--layout-bg, #0f172a); }
        .dark-theme .view-row span { color: var(--text-primary, #f8fafc); }
        .dark-theme .btn-secondary { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .btn-secondary:hover { background: var(--layout-bg, #0f172a); }
        .dark-theme .btn-primary { background: var(--primary-color, #3b82f6); }
        .dark-theme .btn-primary:hover { background: var(--primary-hover, #2563eb); }
        .dark-theme .status-draft { background: rgba(107,114,128,0.2); color: #9ca3af; }
        .dark-theme .status-submitted { background: rgba(59,130,246,0.2); color: #60a5fa; }
        .dark-theme .status-partial { background: rgba(251,191,36,0.2); color: #fbbf24; }
        .dark-theme .status-paid { background: rgba(16,185,129,0.2); color: #34d399; }
        .dark-theme .status-overdue { background: rgba(239,68,68,0.2); color: #f87171; }
        .dark-theme .status-cancelled { background: rgba(107,114,128,0.2); color: #9ca3af; }
        .dark-theme .compact-stats { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .stat-value { color: var(--text-primary, #f8fafc); }
        .dark-theme .stat-divider { background: var(--border-color, #334155); }
        .dark-theme .empty-state h3 { color: var(--text-primary, #f8fafc); }
        .dark-theme .empty-state p { color: var(--text-secondary, #94a3b8); }
        .dark-theme .conversion-badge { background: rgba(99,102,241,0.15); color: var(--primary-color, #818cf8); }
        .dark-theme .result-count { color: var(--text-secondary, #94a3b8); }
        .dark-theme .list-footer { color: var(--text-secondary, #94a3b8); }
        .dark-theme .delete-body h3 { color: var(--text-primary, #f8fafc); }
        .dark-theme .delete-body p { color: var(--text-secondary, #94a3b8); }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Purchase Invoices</h1>
          <span className="badge">{invoices.length}</span>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            <FaPlus size={12} /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="compact-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalInvoices}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Paid</span>
          <span className="stat-value stat-paid">{paidInvoices}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Overdue</span>
          <span className="stat-value stat-overdue">{overdueInvoices}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Total Amount</span>
          <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by invoice #, supplier or PO..."
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
            className="filter-toggle"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="All">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={12} /> Filter
          </button>
          <span className="result-count">{filteredInvoices.length} of {invoices.length}</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="expandable-filters">
          <div className="filter-group">
            <label>Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              <option value="All">All Suppliers</option>
              {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Currency</label>
            <select>
              <option value="all">All Currencies</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <button className="apply-filters">Apply</button>
        </div>
      )}

      {/* Invoice List */}
      <div className="invoice-container">
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaReceipt size={48} />
            </div>
            <h3>No purchase invoices found</h3>
            <p>Create your first purchase invoice to get started</p>
            <button className="btn-primary" onClick={handleCreate}>
              <FaPlus size={12} /> New Invoice
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Supplier</th>
                  <th>PO #</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="invoice-row">
                    <td className="number-cell">{inv.invoiceNumber}</td>
                    <td className="supplier-cell">{inv.supplier}</td>
                    <td className="po-cell">{inv.purchaseOrder}</td>
                    <td className="date-cell">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="date-cell">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="amount-cell">{inv.currency} {inv.totalAmount.toLocaleString()}</td>
                    <td className="paid-cell">{inv.currency} {inv.paidAmount.toLocaleString()}</td>
                    <td className={`balance-cell ${inv.balanceAmount > 0 && new Date(inv.dueDate) < new Date() ? 'overdue' : ''}`}>
                      {inv.currency} {inv.balanceAmount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColor(inv.status)}`}>
                        {getStatusIcon(inv.status)}
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="action-btn view" title="View" onClick={() => handleView(inv)}>
                          <FaEye size={12} />
                        </button>
                        <button className="action-btn edit" title="Edit" onClick={() => handleEdit(inv)}>
                          <FaEdit size={12} />
                        </button>
                        <button className="action-btn copy" title="Duplicate" onClick={() => handleDuplicate(inv)}>
                          <FaCopy size={12} />
                        </button>
                        <button className="action-btn delete" title="Delete" onClick={() => handleDelete(inv)}>
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
        <span>{filteredInvoices.length} of {invoices.length} invoices</span>
        <div className="footer-actions">
          <span className="conversion-badge">
            <FaCheckCircle size={11} /> {paidInvoices} paid
          </span>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedInvoice.invoiceNumber}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-section">
                  <h4>Invoice Details</h4>
                  <div className="view-row"><label>Number:</label><span>{selectedInvoice.invoiceNumber}</span></div>
                  <div className="view-row"><label>Status:</label><span className={`status-badge ${getStatusColor(selectedInvoice.status)}`}>{selectedInvoice.status}</span></div>
                  <div className="view-row"><label>Date:</label><span>{new Date(selectedInvoice.date).toLocaleDateString()}</span></div>
                  <div className="view-row"><label>Due Date:</label><span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span></div>
                </div>
                <div className="view-section">
                  <h4>Supplier Details</h4>
                  <div className="view-row"><label>Supplier:</label><span>{selectedInvoice.supplier}</span></div>
                  <div className="view-row"><label>Code:</label><span>{selectedInvoice.supplierCode}</span></div>
                  <div className="view-row"><label>PO #:</label><span>{selectedInvoice.purchaseOrder}</span></div>
                </div>
                <div className="view-section full-width">
                  <h4>Financial Summary</h4>
                  <div className="view-row"><label>Total Amount:</label><span className="amount-cell">{selectedInvoice.currency} {selectedInvoice.totalAmount.toLocaleString()}</span></div>
                  <div className="view-row"><label>Paid Amount:</label><span className="paid-cell">{selectedInvoice.currency} {selectedInvoice.paidAmount.toLocaleString()}</span></div>
                  <div className="view-row"><label>Balance Amount:</label><span className="balance-cell">{selectedInvoice.currency} {selectedInvoice.balanceAmount.toLocaleString()}</span></div>
                  <div className="view-row"><label>Items:</label><span>{selectedInvoice.itemsCount} items</span></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => handleEdit(selectedInvoice)}>
                <FaEdit size={12} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Purchase Invoice</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body delete-body">
              <div className="delete-icon">
                <FaTrash size={48} />
              </div>
              <h3>Are you sure?</h3>
              <p>You are about to delete <strong>{selectedInvoice.invoiceNumber}</strong></p>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDeleteConfirm} disabled={loading}>
                {loading && <FaSpinner className="spinning" />}
                <FaTrash size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}