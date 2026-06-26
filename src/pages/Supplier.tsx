import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaFilter, 
  FaCheckCircle, FaTimesCircle, FaPhone, FaEnvelope,
  FaBuilding, FaStar, FaStarHalfAlt,
 FaTimes, FaSave, FaSpinner, FaCopy} from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  supplierCode: string;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  gstin: string;
  pan: string;
  supplierGroup: string;
  paymentTerms: string;
  creditLimit: number;
  rating: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export default function Supplier() {
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
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      supplierCode: 'SUP-001',
      supplierName: 'ABC Manufacturing Co.',
      contactPerson: 'John Doe',
      email: 'john@abcmfg.com',
      phone: '+91-9876543210',
      address: '123, Industrial Estate, MIDC',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      gstin: '27AABCU1234D1Z1',
      pan: 'AABCU1234D',
      supplierGroup: 'Raw Materials',
      paymentTerms: 'Net 30',
      creditLimit: 500000,
      rating: 4.5,
      status: 'Active',
      currency: 'INR',
      createdAt: '2026-06-20T10:00:00Z',
      updatedAt: '2026-06-20T10:00:00Z'
    },
    {
      id: '2',
      supplierCode: 'SUP-002',
      supplierName: 'XYZ Electronics Ltd.',
      contactPerson: 'Jane Smith',
      email: 'jane@xyzelec.com',
      phone: '+91-8765432109',
      address: '456, Tech Park, Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560100',
      gstin: '29BXYZU5678E1Z1',
      pan: 'BXYZU5678E',
      supplierGroup: 'Electronic Components',
      paymentTerms: 'Net 15',
      creditLimit: 300000,
      rating: 3.8,
      status: 'Active',
      currency: 'USD',
      createdAt: '2026-06-19T10:00:00Z',
      updatedAt: '2026-06-19T10:00:00Z'
    },
    {
      id: '3',
      supplierCode: 'SUP-003',
      supplierName: 'PQR Packaging Solutions',
      contactPerson: 'Robert Johnson',
      email: 'robert@pqrpack.com',
      phone: '+91-7654321098',
      address: '789, Packaging Park',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411001',
      gstin: '27CPQRU9012F1Z1',
      pan: 'CPQRU9012F',
      supplierGroup: 'Packaging',
      paymentTerms: 'Net 45',
      creditLimit: 200000,
      rating: 4.2,
      status: 'Inactive',
      currency: 'INR',
      createdAt: '2026-06-18T10:00:00Z',
      updatedAt: '2026-06-18T10:00:00Z'
    },
    {
      id: '4',
      supplierCode: 'SUP-004',
      supplierName: 'LMN Chemicals',
      contactPerson: 'Mary Williams',
      email: 'mary@lmnchem.com',
      phone: '+91-6543210987',
      address: '321, Chemical Zone',
      city: 'Vapi',
      state: 'Gujarat',
      country: 'India',
      pincode: '396191',
      gstin: '24DLMN3456G1Z1',
      pan: 'DLMN3456G',
      supplierGroup: 'Chemicals',
      paymentTerms: 'Net 30',
      creditLimit: 400000,
      rating: 4.8,
      status: 'Active',
      currency: 'USD',
      createdAt: '2026-06-17T10:00:00Z',
      updatedAt: '2026-06-17T10:00:00Z'
    },
    {
      id: '5',
      supplierCode: 'SUP-005',
      supplierName: 'DEF Logistics',
      contactPerson: 'David Brown',
      email: 'david@deflog.com',
      phone: '+91-5432109876',
      address: '654, Transport Nagar',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001',
      gstin: '07EDEF7890H1Z1',
      pan: 'EDEF7890H',
      supplierGroup: 'Logistics',
      paymentTerms: 'Net 60',
      creditLimit: 150000,
      rating: 3.5,
      status: 'Suspended',
      currency: 'INR',
      createdAt: '2026-06-16T10:00:00Z',
      updatedAt: '2026-06-16T10:00:00Z'
    }
  ]);

  const [formData, setFormData] = useState({
    supplierCode: '',
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    gstin: '',
    pan: '',
    supplierGroup: '',
    paymentTerms: 'Net 30',
    creditLimit: 0,
    rating: 0,
    status: 'Active' as const,
    currency: 'INR'
  });

  const supplierGroups = ['Raw Materials', 'Electronic Components', 'Packaging', 'Chemicals', 'Logistics', 'Office Supplies', 'Services'];
  const paymentTerms = ['Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt'];
  const countries = ['India', 'USA', 'UK', 'Germany', 'China', 'Japan'];
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];
  const statusOptions = ['Active', 'Inactive', 'Suspended'];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.supplierCode.toLowerCase().includes(filterText.toLowerCase()) ||
                         s.supplierName.toLowerCase().includes(filterText.toLowerCase()) ||
                         s.contactPerson.toLowerCase().includes(filterText.toLowerCase()) ||
                         s.email.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesGroup = selectedGroup === 'All' || s.supplierGroup === selectedGroup;
    const matchesCountry = selectedCountry === 'All' || s.country === selectedCountry;
    return matchesSearch && matchesStatus && matchesGroup && matchesCountry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'Suspended': return 'status-suspended';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <FaCheckCircle size={10} />;
      case 'Inactive': return <FaTimesCircle size={10} />;
      case 'Suspended': return <FaTimesCircle size={10} />;
      default: return null;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} size={12} color="#f59e0b" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" size={12} color="#f59e0b" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} size={12} color="#d1d5db" />);
    }
    return stars;
  };

  const handleCreate = () => {
    setFormData({
      supplierCode: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      supplierName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      gstin: '',
      pan: '',
      supplierGroup: '',
      paymentTerms: 'Net 30',
      creditLimit: 0,
      rating: 0,
      status: 'Active',
      currency: 'INR'
    });
    navigate('/supplier/new');
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      supplierCode: supplier.supplierCode,
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      country: supplier.country,
      pincode: supplier.pincode,
      gstin: supplier.gstin,
      pan: supplier.pan,
      supplierGroup: supplier.supplierGroup,
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit,
      rating: supplier.rating,
      status: supplier.status,
      currency: supplier.currency
    });
    setShowEditModal(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  const handleUpdate = () => {
    if (!selectedSupplier) return;
    setLoading(true);
    
    setTimeout(() => {
      setSuppliers(prev => 
        prev.map(s => s.id === selectedSupplier.id ? { ...s, ...formData, updatedAt: new Date().toISOString() } : s)
      );
      setShowEditModal(false);
      setLoading(false);
      toast.success('Supplier updated successfully!');
    }, 1000);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSupplier) return;
    setLoading(true);
    
    setTimeout(() => {
      setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      setShowDeleteModal(false);
      setLoading(false);
      toast.success('Supplier deleted successfully!');
    }, 1000);
  };

  const handleDuplicate = (supplier: Supplier) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: String(suppliers.length + 1),
      supplierCode: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
      supplierName: `${supplier.supplierName} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSuppliers(prev => [...prev, newSupplier]);
    toast.success('Supplier duplicated successfully!');
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
  const totalCreditLimit = suppliers.reduce((sum, s) => sum + s.creditLimit, 0);

  return (
    <div className={`supplier-page ${theme}-theme}`}>
      <style>{`
        /* ── Page Container ─────────────────────────────────────── */
        .supplier-page {
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

        .supplier-page::-webkit-scrollbar { width: 4px; }
        .supplier-page::-webkit-scrollbar-track { background: transparent; }
        .supplier-page::-webkit-scrollbar-thumb { background: var(--border-color, #e5e7eb); border-radius: 2px; }

        /* ── Header ──────────────────────────────────────────────── */
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

        /* ── Compact Stats ────────────────────────────────────────── */
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

        .stat-active {
          color: #10b981;
        }

        .stat-inactive {
          color: #6b7280;
        }

        .stat-suspended {
          color: #ef4444;
        }

        .stat-divider {
          width: 1px;
          height: 20px;
          background: var(--border-color, #e5e7eb);
        }

        /* ── Search Bar ───────────────────────────────────────────── */
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

        /* ── Expandable Filters ───────────────────────────────────── */
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

        /* ── Supplier Table ─────────────────────────────────────── */
        .supplier-container {
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

        .supplier-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          min-width: 900px;
        }

        .supplier-table thead {
          background: var(--layout-bg, #f8f9fa);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .supplier-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .supplier-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color, #f3f4f6);
          color: var(--text-primary, #374151);
        }

        .supplier-row {
          transition: background 0.15s ease;
        }

        .supplier-row:hover {
          background: var(--nav-hover, #f9fafb);
        }

        .code-cell {
          font-weight: 600;
          color: var(--primary-color, #6366f1);
          font-size: 12px;
        }

        .name-cell {
          font-weight: 500;
          color: var(--text-primary, #1f2433);
        }

        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .contact-cell .contact-name {
          font-weight: 500;
        }

        .contact-cell .contact-detail {
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .group-badge {
          display: inline-block;
          padding: 2px 10px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .rating-cell {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-cell .rating-value {
          font-weight: 600;
          font-size: 12px;
          color: var(--text-primary, #1f2433);
        }

        .credit-cell {
          font-weight: 500;
          color: var(--text-primary, #1f2433);
        }

        /* ── Status Badge ────────────────────────────────────────── */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 500;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-suspended {
          background: #fee2e2;
          color: #991b1b;
        }

        /* ── Action Group ──────────────────────────────────────────── */
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

        /* ── Empty State ───────────────────────────────────────────── */
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

        /* ── Footer ────────────────────────────────────────────────── */
        .list-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 4px 0 4px;
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
          flex-shrink: 0;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          gap: 12px;
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

        /* ── MODALS ────────────────────────────────────────────────── */
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .view-modal { max-width: 650px; }
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

        /* ── View Modal ────────────────────────────────────────────── */
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
          min-width: 90px;
        }

        .view-row span {
          color: var(--text-primary, #1f2433);
        }

        /* ── Delete Modal ──────────────────────────────────────────── */
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

        /* ── Responsive ───────────────────────────────────────────── */
        @media (max-width: 768px) {
          .supplier-page { padding: 12px 16px; }
          .page-header { flex-direction: column; align-items: stretch; }
          .header-actions { flex-wrap: wrap; justify-content: flex-end; }
          .search-bar { flex-direction: column; align-items: stretch; }
          .filter-wrapper { justify-content: space-between; }
          .expandable-filters { flex-direction: column; align-items: stretch; }
          .supplier-table { min-width: 700px; }
          .modal-container { max-width: 100%; margin: 10px; }
          .modal-footer { flex-direction: column; }
          .modal-footer button { width: 100%; justify-content: center; }
          .view-grid { grid-template-columns: 1fr; }
          .compact-stats { flex-wrap: wrap; gap: 8px; padding: 8px 12px; }
          .stat-divider { display: none; }
        }

        @media (max-width: 480px) {
          .supplier-page { padding: 8px 12px; }
          .supplier-table { font-size: 12px; min-width: 600px; }
          .supplier-table th, .supplier-table td { padding: 6px 10px; }
          .action-group { gap: 0; }
          .action-btn { width: 24px; height: 24px; }
        }

        /* ─── Dark Theme ─────────────────────────────────────────── */
        .dark-theme .supplier-page { background: var(--layout-bg, #0f172a); }
        .dark-theme .page-title { color: var(--text-primary, #f8fafc); }
        .dark-theme .badge { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-secondary, #94a3b8); }
        .dark-theme .search-wrapper { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .search-input { color: var(--text-primary, #f8fafc); }
        .dark-theme .search-input::placeholder { color: var(--text-secondary, #64748b); }
        .dark-theme .filter-toggle { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-secondary, #94a3b8); }
        .dark-theme .filter-toggle:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .expandable-filters { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .filter-group select { background: var(--input-bg, #0f172a); border-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .supplier-container { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .supplier-table thead { background: var(--layout-bg, #0f172a); }
        .dark-theme .supplier-table th { color: var(--text-secondary, #94a3b8); border-bottom-color: var(--border-color, #334155); }
        .dark-theme .supplier-table td { border-bottom-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .supplier-row:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .code-cell { color: var(--primary-color, #818cf8); }
        .dark-theme .name-cell { color: var(--text-primary, #f8fafc); }
        .dark-theme .group-badge { background: rgba(99,102,241,0.2); color: var(--primary-color, #818cf8); }
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
        .dark-theme .status-active { background: rgba(16,185,129,0.2); color: #34d399; }
        .dark-theme .status-inactive { background: rgba(107,114,128,0.2); color: #9ca3af; }
        .dark-theme .status-suspended { background: rgba(239,68,68,0.2); color: #f87171; }
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
        .dark-theme .contact-cell .contact-detail { color: var(--text-secondary, #94a3b8); }
        .dark-theme .rating-cell .rating-value { color: var(--text-primary, #f8fafc); }
        .dark-theme .credit-cell { color: var(--text-primary, #f8fafc); }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Suppliers</h1>
          <span className="badge">{suppliers.length}</span>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreate}>
            <FaPlus size={12} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="compact-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalSuppliers}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Active</span>
          <span className="stat-value stat-active">{activeSuppliers}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Credit Limit</span>
          <span className="stat-value">₹{totalCreditLimit.toLocaleString()}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Groups</span>
          <span className="stat-value">{supplierGroups.length}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by code, name, contact or email..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={12} /> Filter
          </button>
          <span className="result-count">{filteredSuppliers.length} of {suppliers.length}</span>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="expandable-filters">
          <div className="filter-group">
            <label>Supplier Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="All">All Groups</option>
              {supplierGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="All">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Payment Terms</label>
            <select>
              <option value="all">All</option>
              {paymentTerms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button className="apply-filters">Apply</button>
        </div>
      )}

      {/* Supplier List */}
      <div className="supplier-container">
        {filteredSuppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaBuilding size={48} />
            </div>
            <h3>No suppliers found</h3>
            <p>Create your first supplier to get started</p>
            <button className="btn-primary" onClick={handleCreate}>
              <FaPlus size={12} /> Add Supplier
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Supplier Name</th>
                  <th>Contact</th>
                  <th>Group</th>
                  <th>Rating</th>
                  <th>Credit Limit</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="supplier-row">
                    <td className="code-cell">{supplier.supplierCode}</td>
                    <td className="name-cell">{supplier.supplierName}</td>
                    <td>
                      <div className="contact-cell">
                        <span className="contact-name">{supplier.contactPerson}</span>
                        <span className="contact-detail">
                          <FaPhone size={10} /> {supplier.phone}
                        </span>
                        <span className="contact-detail">
                          <FaEnvelope size={10} /> {supplier.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="group-badge">{supplier.supplierGroup}</span>
                    </td>
                    <td>
                      <div className="rating-cell">
                        {renderStars(supplier.rating)}
                        <span className="rating-value">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="credit-cell">{supplier.currency} {supplier.creditLimit.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(supplier.status)}`}>
                        {getStatusIcon(supplier.status)}
                        {supplier.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button 
                          className="action-btn view" 
                          title="View"
                          onClick={() => handleView(supplier)}
                        >
                          <FaEye size={12} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Edit"
                          onClick={() => handleEdit(supplier)}
                        >
                          <FaEdit size={12} />
                        </button>
                        <button 
                          className="action-btn copy" 
                          title="Duplicate"
                          onClick={() => handleDuplicate(supplier)}
                        >
                          <FaCopy size={12} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Delete"
                          onClick={() => handleDelete(supplier)}
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
        <span>{filteredSuppliers.length} of {suppliers.length} suppliers</span>
        <div className="footer-actions">
          <span className="conversion-badge">
            <FaBuilding size={11} /> {activeSuppliers} active
          </span>
        </div>
      </div>

      {/* ====== VIEW MODAL ====== */}
      {showViewModal && selectedSupplier && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedSupplier.supplierCode} - {selectedSupplier.supplierName}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-grid">
                <div className="view-section">
                  <h4>Basic Information</h4>
                  <div className="view-row"><label>Code:</label><span>{selectedSupplier.supplierCode}</span></div>
                  <div className="view-row"><label>Name:</label><span>{selectedSupplier.supplierName}</span></div>
                  <div className="view-row"><label>Group:</label><span>{selectedSupplier.supplierGroup}</span></div>
                  <div className="view-row"><label>Status:</label><span className={`status-badge ${getStatusColor(selectedSupplier.status)}`}>{selectedSupplier.status}</span></div>
                </div>
                <div className="view-section">
                  <h4>Contact Details</h4>
                  <div className="view-row"><label>Contact:</label><span>{selectedSupplier.contactPerson}</span></div>
                  <div className="view-row"><label>Email:</label><span>{selectedSupplier.email}</span></div>
                  <div className="view-row"><label>Phone:</label><span>{selectedSupplier.phone}</span></div>
                </div>
                <div className="view-section full-width">
                  <h4>Address</h4>
                  <div className="view-row"><label>Address:</label><span>{selectedSupplier.address}</span></div>
                  <div className="view-row"><label>City:</label><span>{selectedSupplier.city}</span></div>
                  <div className="view-row"><label>State:</label><span>{selectedSupplier.state}</span></div>
                  <div className="view-row"><label>Country:</label><span>{selectedSupplier.country}</span></div>
                  <div className="view-row"><label>Pincode:</label><span>{selectedSupplier.pincode}</span></div>
                </div>
                <div className="view-section">
                  <h4>Tax Details</h4>
                  <div className="view-row"><label>GSTIN:</label><span>{selectedSupplier.gstin}</span></div>
                  <div className="view-row"><label>PAN:</label><span>{selectedSupplier.pan}</span></div>
                </div>
                <div className="view-section">
                  <h4>Financial Details</h4>
                  <div className="view-row"><label>Payment Terms:</label><span>{selectedSupplier.paymentTerms}</span></div>
                  <div className="view-row"><label>Credit Limit:</label><span>{selectedSupplier.currency} {selectedSupplier.creditLimit.toLocaleString()}</span></div>
                  <div className="view-row"><label>Rating:</label><span>{selectedSupplier.rating} ⭐</span></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => handleEdit(selectedSupplier)}>
                <FaEdit size={12} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== EDIT MODAL ====== */}
      {showEditModal && selectedSupplier && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Supplier</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Supplier Name *</label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Supplier Group</label>
                  <select
                    value={formData.supplierGroup}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierGroup: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  >
                    <option value="">Select Group</option>
                    {supplierGroups.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  >
                    {paymentTerms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Credit Limit</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #6b7280)' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    style={{ padding: '8px 12px', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px', fontSize: '13px', background: 'var(--input-bg, #ffffff)', color: 'var(--text-primary, #374151)' }}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
      {showDeleteModal && selectedSupplier && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Supplier</h2>
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
                You are about to delete <strong>{selectedSupplier.supplierName}</strong>
              </p>
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