import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaSave, FaSpinner, FaInfoCircle, 
  FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaSearch, FaGlobe, FaTag, FaIdCard, FaCheckCircle,
  FaTimesCircle, FaTruck, FaAddressBook, FaCity
} from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import toast from 'react-hot-toast';
import './AddSupplier.css';

interface SupplierForm {
  gstin: string;
  supplierType: string;
  supplierName: string;
  gstCategory: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNo: string;
  isPrimaryAddress: boolean;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  isShippingAddress: boolean;
  city: string;
  state: string;
  country: string;
}

export default function AddSupplier() {
  const navigate = useNavigate();
  
  let theme = 'light';
  try {
    const context = useAdminTheme();
    theme = context.theme;
  } catch (error) {
    console.log('Using default light theme');
  }

  const [loading, setLoading] = useState(false);
  const [isGstAutofill, setIsGstAutofill] = useState(false);
  const [pincodeSuggestions, setPincodeSuggestions] = useState<string[]>([]);
  const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState<string[]>([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);

  const [formData, setFormData] = useState<SupplierForm>({
    gstin: '',
    supplierType: 'Company',
    supplierName: '',
    gstCategory: 'Unregistered',
    firstName: '',
    lastName: '',
    emailId: '',
    mobileNo: '',
    isPrimaryAddress: true,
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    isShippingAddress: true,
    city: '',
    state: '',
    country: 'India'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const supplierTypes = ['Company', 'Individual', 'Partnership', 'Proprietorship', 'LLP', 'Trust', 'Society'];
  const gstCategories = ['Unregistered', 'Registered', 'Composition', 'SEZ', 'Export Oriented'];
  const countries = ['India', 'USA', 'UK', 'Germany', 'China', 'Japan', 'UAE', 'Singapore'];

  // Sample pincode data for autofill
  const pincodeData: { [key: string]: { city: string; state: string; country: string } } = {
    '400001': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '400002': { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    '411001': { city: 'Pune', state: 'Maharashtra', country: 'India' },
    '411002': { city: 'Pune', state: 'Maharashtra', country: 'India' },
    '560001': { city: 'Bangalore', state: 'Karnataka', country: 'India' },
    '560002': { city: 'Bangalore', state: 'Karnataka', country: 'India' },
    '110001': { city: 'Delhi', state: 'Delhi', country: 'India' },
    '110002': { city: 'Delhi', state: 'Delhi', country: 'India' },
    '700001': { city: 'Kolkata', state: 'West Bengal', country: 'India' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    '500001': { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    '380001': { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
    '302001': { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
    '226001': { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
    '201301': { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
    '122001': { city: 'Gurgaon', state: 'Haryana', country: 'India' }
  };

  // Sample GSTIN data for autofill
  const gstinData: { [key: string]: { name: string; address: string; city: string; state: string; pincode: string } } = {
    '27AABCU1234D1Z1': {
      name: 'ABC Manufacturing Co.',
      address: '123, Industrial Estate, MIDC',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    '29BXYZU5678E1Z1': {
      name: 'XYZ Electronics Ltd.',
      address: '456, Tech Park, Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    '27CPQRU9012F1Z1': {
      name: 'PQR Packaging Solutions',
      address: '789, Packaging Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    }
  };

  // Handle GSTIN change - autofill party information
  const handleGstinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, gstin: value }));
    
    // Check if GSTIN exists in our mock data
    if (value.length === 15 && gstinData[value]) {
      const data = gstinData[value];
      setIsGstAutofill(true);
      setFormData(prev => ({
        ...prev,
        gstin: value,
        supplierName: data.name,
        addressLine1: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        country: 'India'
      }));
      toast.success('Party information autofilled from GSTIN!');
    } else if (value.length === 15) {
      setIsGstAutofill(false);
      toast.error('No party found with this GSTIN');
    }
  };

  // Handle pincode change - autofill address
  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, pincode: value }));
    
    // Show suggestions
    const suggestions = Object.keys(pincodeData).filter(p => p.startsWith(value));
    setPincodeSuggestions(suggestions);
    setShowPincodeSuggestions(suggestions.length > 0 && value.length > 0);

    // Autofill if exact match
    if (pincodeData[value]) {
      const data = pincodeData[value];
      setFormData(prev => ({
        ...prev,
        pincode: value,
        city: data.city,
        state: data.state,
        country: data.country
      }));
      setShowPincodeSuggestions(false);
      toast.success('Address autofilled from pincode!');
    }
  };

  const selectPincode = (pincode: string) => {
    const data = pincodeData[pincode];
    if (data) {
      setFormData(prev => ({
        ...prev,
        pincode: pincode,
        city: data.city,
        state: data.state,
        country: data.country
      }));
    }
    setShowPincodeSuggestions(false);
  };

  // State suggestions (for typeahead)
  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, state: value }));
    
    const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Gujarat', 'Tamil Nadu', 'West Bengal', 
                    'Telangana', 'Rajasthan', 'Uttar Pradesh', 'Haryana', 'Punjab', 'Kerala',
                    'Andhra Pradesh', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Chhattisgarh'];
    const suggestions = states.filter(s => s.toLowerCase().includes(value.toLowerCase()));
    setStateSuggestions(suggestions);
    setShowStateSuggestions(suggestions.length > 0 && value.length > 0);
  };

  const selectState = (state: string) => {
    setFormData(prev => ({ ...prev, state }));
    setShowStateSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email address';
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid phone number';
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Supplier Data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Supplier created successfully!');
      navigate('/supplier');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/supplier');
    }
  };

  return (
    <div className={`add-supplier-page ${theme}-theme}`}>
      <style>{`
        /* ── Page Container ─────────────────────────────────────── */
        .add-supplier-page {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--layout-bg, #f5f7fb);
          padding: 16px 24px;
          gap: 16px;
          overflow-y: auto;
          font-family: -apple-system, "Inter", "Segoe UI", Roboto, sans-serif;
          color: var(--text-primary, #1f2433);
        }

        .add-supplier-page::-webkit-scrollbar { width: 4px; }
        .add-supplier-page::-webkit-scrollbar-track { background: transparent; }
        .add-supplier-page::-webkit-scrollbar-thumb { background: var(--border-color, #e5e7eb); border-radius: 2px; }

        /* ── Header ──────────────────────────────────────────────── */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          flex-shrink: 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 6px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: var(--card-bg, #ffffff);
          color: var(--text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: var(--nav-hover, #f3f4f6);
          border-color: var(--primary-color, #6366f1);
          color: var(--primary-color, #6366f1);
        }

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
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

        /* ── Form Sections ────────────────────────────────────────── */
        .form-section {
          background: var(--card-bg, #ffffff);
          border-radius: 10px;
          padding: 16px 20px;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary, #1f2433);
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title .badge-info {
          font-size: 10px;
          font-weight: 400;
          color: var(--text-secondary, #6b7280);
          background: var(--layout-bg, #f3f4f6);
          padding: 2px 10px;
          border-radius: 10px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .form-group label .required {
          color: #ef4444;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-primary, #374151);
          transition: all 0.2s ease;
          background: var(--input-bg, #ffffff);
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color, #6366f1);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group input.error {
          border-color: var(--danger-color, #ef4444);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-secondary, #9ca3af);
        }

        .error-text {
          font-size: 10px;
          color: var(--danger-color, #ef4444);
          margin-top: 2px;
          display: block;
        }

        .field-hint {
          font-size: 10px;
          color: var(--text-secondary, #6b7280);
          margin-top: 3px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .field-hint .autofill-badge {
          color: #10b981;
          font-weight: 500;
        }

        /* ── GST Autofill Badge ───────────────────────────────────── */
        .gst-autofill-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #10b981;
          background: #d1fae5;
          padding: 2px 10px;
          border-radius: 10px;
          font-weight: 500;
        }

        /* ── Checkbox Group ───────────────────────────────────────── */
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
          accent-color: var(--primary-color, #6366f1);
        }

        .checkbox-group label {
          font-size: 13px;
          color: var(--text-primary, #374151);
          cursor: pointer;
        }

        /* ── Pincode Suggestions ──────────────────────────────────── */
        .suggestions-container {
          position: relative;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 6px;
          max-height: 150px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-top: 2px;
        }

        .suggestions-list::-webkit-scrollbar {
          width: 4px;
        }

        .suggestions-list::-webkit-scrollbar-track {
          background: var(--layout-bg, #f9fafb);
        }

        .suggestions-list::-webkit-scrollbar-thumb {
          background: var(--border-color, #e5e7eb);
          border-radius: 2px;
        }

        .suggestion-item {
          padding: 6px 12px;
          cursor: pointer;
          font-size: 13px;
          color: var(--text-primary, #374151);
          transition: background 0.15s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .suggestion-item:hover {
          background: var(--nav-hover, #f3f4f6);
        }

        .suggestion-item .suggestion-detail {
          font-size: 11px;
          color: var(--text-secondary, #6b7280);
        }

        /* ── Address Section ──────────────────────────────────────── */
        .address-checkboxes {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 4px;
        }

        /* ── Responsive ───────────────────────────────────────────── */
        @media (max-width: 768px) {
          .add-supplier-page { padding: 12px 16px; }
          .page-header { flex-direction: column; align-items: stretch; }
          .header-actions { flex-wrap: wrap; }
          .form-grid { grid-template-columns: 1fr; }
          .form-section { padding: 14px 16px; }
          .address-checkboxes { flex-direction: column; gap: 8px; }
        }

        @media (max-width: 480px) {
          .add-supplier-page { padding: 8px 12px; }
          .page-title { font-size: 18px; }
          .form-section { padding: 12px; }
          .form-group input, .form-group select { font-size: 14px; padding: 10px 12px; }
        }

        /* ─── Dark Theme ─────────────────────────────────────────── */
        .dark-theme .add-supplier-page { background: var(--layout-bg, #0f172a); }
        .dark-theme .page-header { border-bottom-color: var(--border-color, #334155); }
        .dark-theme .page-title { color: var(--text-primary, #f8fafc); }
        .dark-theme .back-btn { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-secondary, #94a3b8); }
        .dark-theme .back-btn:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); border-color: var(--primary-color, #818cf8); color: var(--primary-color, #818cf8); }
        .dark-theme .form-section { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .section-title { color: var(--text-primary, #f8fafc); }
        .dark-theme .form-group label { color: var(--text-primary, #e2e8f0); }
        .dark-theme .form-group input, .dark-theme .form-group select, .dark-theme .form-group textarea { background: var(--input-bg, #0f172a); border-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .form-group input:focus, .dark-theme .form-group select:focus, .dark-theme .form-group textarea:focus { border-color: var(--primary-color, #818cf8); }
        .dark-theme .form-group input::placeholder, .dark-theme .form-group textarea::placeholder { color: var(--text-secondary, #64748b); }
        .dark-theme .suggestions-list { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); }
        .dark-theme .suggestion-item { color: var(--text-primary, #f8fafc); }
        .dark-theme .suggestion-item:hover { background: var(--nav-hover, rgba(255,255,255,0.05)); }
        .dark-theme .checkbox-group label { color: var(--text-primary, #f8fafc); }
        .dark-theme .field-hint { color: var(--text-secondary, #64748b); }
        .dark-theme .error-text { color: #f87171; }
        .dark-theme .form-group input.error { border-color: #f87171; }
        .dark-theme .btn-secondary { background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155); color: var(--text-primary, #f8fafc); }
        .dark-theme .btn-secondary:hover { background: var(--layout-bg, #0f172a); }
        .dark-theme .btn-primary { background: var(--primary-color, #3b82f6); }
        .dark-theme .btn-primary:hover { background: var(--primary-hover, #2563eb); }
        .dark-theme .gst-autofill-badge { background: rgba(16,185,129,0.2); color: #34d399; }
        .dark-theme .section-title .badge-info { background: var(--layout-bg, #0f172a); color: var(--text-secondary, #94a3b8); }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleCancel}>
            <FaArrowLeft size={16} />
          </button>
          <h1 className="page-title">Add Supplier</h1>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave size={14} /> Save Supplier
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* GSTIN Section */}
        <div className="form-section">
          <div className="section-title">
            <FaIdCard size={14} /> GSTIN / UIN
            <span className="badge-info">Autofill party information</span>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>GSTIN / UIN</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleGstinChange}
                placeholder="Enter GSTIN (e.g., 27AABCU1234D1Z1)"
                style={{ textTransform: 'uppercase' }}
              />
              {isGstAutofill && (
                <div className="field-hint">
                  <FaCheckCircle size={12} color="#10b981" />
                  <span className="autofill-badge">✓ Party information autofilled</span>
                </div>
              )}
              <div className="field-hint">
                <FaInfoCircle size={12} />
                Autofill party information by entering their GSTIN
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Details */}
        <div className="form-section">
          <div className="section-title">
            <FaBuilding size={14} /> Supplier Details
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Supplier Type <span className="required">*</span></label>
              <select
                name="supplierType"
                value={formData.supplierType}
                onChange={handleInputChange}
              >
                {supplierTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Supplier Name <span className="required">*</span></label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                placeholder="Enter supplier name"
                className={errors.supplierName ? 'error' : ''}
              />
              {errors.supplierName && <span className="error-text">{errors.supplierName}</span>}
            </div>
            <div className="form-group">
              <label>GST Category</label>
              <select
                name="gstCategory"
                value={formData.gstCategory}
                onChange={handleInputChange}
              >
                {gstCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Primary Contact Details */}
        <div className="form-section">
          <div className="section-title">
            <FaUser size={14} /> Primary Contact Details
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name <span className="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
            <div className="form-group">
              <label>Email ID <span className="required">*</span></label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={errors.emailId ? 'error' : ''}
              />
              {errors.emailId && <span className="error-text">{errors.emailId}</span>}
            </div>
            <div className="form-group">
              <label>Mobile Number <span className="required">*</span></label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                className={errors.mobileNo ? 'error' : ''}
              />
              {errors.mobileNo && <span className="error-text">{errors.mobileNo}</span>}
            </div>
          </div>
        </div>

        {/* Primary Address Details */}
        <div className="form-section">
          <div className="section-title">
            <FaMapMarkerAlt size={14} /> Primary Address Details
            <span className="badge-info">When you enter a GSTIN, the permanent address linked to it is autofilled.</span>
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <div className="address-checkboxes">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isPrimaryAddress"
                    name="isPrimaryAddress"
                    checked={formData.isPrimaryAddress}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isPrimaryAddress">Preferred Billing Address</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isShippingAddress"
                    name="isShippingAddress"
                    checked={formData.isShippingAddress}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isShippingAddress">Preferred Shipping Address</label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Postal Code <span className="required">*</span></label>
              <div className="suggestions-container">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="Enter postal code"
                  className={errors.pincode ? 'error' : ''}
                />
                {showPincodeSuggestions && (
                  <div className="suggestions-list">
                    {pincodeSuggestions.map(p => (
                      <div 
                        key={p} 
                        className="suggestion-item"
                        onClick={() => selectPincode(p)}
                      >
                        <span>{p}</span>
                        {pincodeData[p] && (
                          <span className="suggestion-detail">
                            {pincodeData[p].city}, {pincodeData[p].state}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              <div className="field-hint">
                <FaInfoCircle size={12} />
                Change the Postal Code to autofill other addresses.
              </div>
            </div>
            <div className="form-group">
              <label>City/Town <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            <div className="form-group full-width">
              <label>Address Line 1 <span className="required">*</span></label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Enter address line 1"
                className={errors.addressLine1 ? 'error' : ''}
              />
              {errors.addressLine1 && <span className="error-text">{errors.addressLine1}</span>}
            </div>
            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                placeholder="Enter address line 2 (optional)"
              />
            </div>
            <div className="form-group">
              <label>State/Province <span className="required">*</span></label>
              <div className="suggestions-container">
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  placeholder="Enter state"
                  className={errors.state ? 'error' : ''}
                />
                {showStateSuggestions && (
                  <div className="suggestions-list">
                    {stateSuggestions.map(s => (
                      <div 
                        key={s} 
                        className="suggestion-item"
                        onClick={() => selectState(s)}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>
            <div className="form-group">
              <label>Country <span className="required">*</span></label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color, #e5e7eb)',
          marginTop: '4px'
        }}>
          <button type="button" className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave size={14} /> Save Supplier
          </button>
        </div>
      </form>

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}