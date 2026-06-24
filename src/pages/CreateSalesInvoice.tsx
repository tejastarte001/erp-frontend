import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner, FaInfoCircle, FaPlus, FaTrash, FaExchangeAlt, FaKeyboard, FaFolder } from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import './CreateSalesInvoice.css';
import toast from 'react-hot-toast';

interface InvoiceItem {
  id: string;
  itemCode: string;
  itemCategory: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  tax: number;
  taxAmount: number;
  total: number;
}

interface InvoiceForm {
  invoiceNumber: string;
  salesOrder: string;
  customer: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  currency: string;
  exchangeRate: number;
  items: InvoiceItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  shippingCharge: number;
  totalAmount: number;
  paidAmount: number;
  paymentTerms: string;
  notes: string;
  termsConditions: string;
}

export default function CreateSalesInvoice() {
  const navigate = useNavigate();
  
  let theme = 'light';
  try {
    const context = useAdminTheme();
    theme = context.theme;
  } catch (error) {
    console.log('Using default light theme');
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null }>({});
  const itemInputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | null }>({});

  const [formData, setFormData] = useState<InvoiceForm>({
    invoiceNumber: `INV-${new Date().getFullYear()}-001`,
    salesOrder: '',
    customer: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    exchangeRate: 1.0,
    items: [
      { id: '1', itemCode: '', itemCategory: '', itemName: '', quantity: 1, rate: 0, amount: 0, tax: 18, taxAmount: 0, total: 0 }
    ],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 18,
    taxAmount: 0,
    shippingCharge: 0,
    totalAmount: 0,
    paidAmount: 0,
    paymentTerms: 'Net 30',
    notes: '',
    termsConditions: 'Payment due within 30 days. Late payment penalty of 2% per month applies.'
  });

  const itemCategories = [
    'Raw Material',
    'Finished Goods',
    'Semi-Finished',
    'Packaging',
    'Spare Parts',
    'Consumables',
    'Tools & Equipment',
    'Office Supplies',
    'Electronics',
    'Furniture',
    'Hardware',
    'Software'
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(e as any);
      }
      
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        addItemRow();
        toast.success('New item added');
        setTimeout(() => {
          const lastIndex = formData.items.length;
          const refKey = `item_${lastIndex}_itemCode`;
          if (itemInputRefs.current[refKey]) {
            itemInputRefs.current[refKey]?.focus();
          }
        }, 100);
      }
      
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.items.length]);

  useEffect(() => {
    setTimeout(() => {
      inputRefs.current['customer']?.focus();
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    if (field === 'quantity' || field === 'rate' || field === 'tax') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const rate = field === 'rate' ? Number(value) : updatedItems[index].rate;
      const tax = field === 'tax' ? Number(value) : updatedItems[index].tax;
      
      updatedItems[index].amount = quantity * rate;
      updatedItems[index].taxAmount = (quantity * rate) * (tax / 100);
      updatedItems[index].total = (quantity * rate) + updatedItems[index].taxAmount;
    }
    
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (formData.discountPercent / 100);
    const finalTotal = total + formData.shippingCharge - discountAmount;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      totalAmount: finalTotal,
      discountAmount
    }));
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number, field: keyof InvoiceItem) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fields: (keyof InvoiceItem)[] = ['itemCode', 'itemCategory', 'itemName', 'quantity', 'rate', 'tax'];
      const currentIndex = fields.indexOf(field);
      
      if (currentIndex === fields.length - 1) {
        if (formData.items[index].rate > 0 && formData.items[index].itemCode) {
          addItemRow();
          setTimeout(() => {
            const newIndex = index + 1;
            const refKey = `item_${newIndex}_itemCode`;
            if (itemInputRefs.current[refKey]) {
              itemInputRefs.current[refKey]?.focus();
            }
          }, 100);
        }
      } else {
        const nextField = fields[currentIndex + 1];
        const refKey = `item_${index}_${nextField}`;
        if (itemInputRefs.current[refKey]) {
          itemInputRefs.current[refKey]?.focus();
        }
      }
    }
  };

  const addItemRow = () => {
    const newId = String(formData.items.length + 1);
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: newId, itemCode: '', itemCategory: '', itemName: '', quantity: 1, rate: 0, amount: 0, tax: 18, taxAmount: 0, total: 0 }
      ]
    }));
  };

  const removeItemRow = (index: number) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = updatedItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (formData.discountPercent / 100);
    const finalTotal = total + formData.shippingCharge - discountAmount;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      taxAmount,
      totalAmount: finalTotal,
      discountAmount
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.customerName) newErrors.customerName = 'Customer name is required';
    if (!formData.date) newErrors.date = 'Invoice date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    let hasValidItem = false;
    formData.items.forEach((item, index) => {
      if (item.itemCode || item.itemName) {
        if (!item.itemCode) {
          newErrors[`item_${index}_code`] = 'Item code required';
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'Quantity must be > 0';
        }
        if (item.rate <= 0) {
          newErrors[`item_${index}_rate`] = 'Rate must be > 0';
        }
        hasValidItem = true;
      }
    });
    if (!hasValidItem) {
      newErrors.items = 'At least one item is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      const firstError = Object.keys(errors)[0];
      if (firstError && inputRefs.current[firstError]) {
        inputRefs.current[firstError]?.focus();
      }
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Sales Invoice Data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Sales Invoice created successfully!');
      navigate('/sales-invoice');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/sales-invoice');
    }
  };

  return (
    <div className={`create-invoice-page ${theme}-theme`}>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleCancel}>
            <FaArrowLeft size={16} />
          </button>
          <h1 className="page-title">Create Sales Invoice</h1>
        </div>
        <div className="header-actions">
          <div className="shortcuts-hint">
            <FaKeyboard size={13} />
            <span>Ctrl+S | Ctrl+Shift+A | Esc</span>
          </div>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave /> Save
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-scrollable">
          {/* Invoice Details */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">Invoice Details</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Invoice #</label>
                <input type="text" value={formData.invoiceNumber} disabled className="disabled-input" />
              </div>
              <div className="form-group">
                <label>SO Reference</label>
                <input
                  type="text"
                  name="salesOrder"
                  value={formData.salesOrder}
                  onChange={handleInputChange}
                  placeholder="SO-2026-001"
                  ref={el => inputRefs.current['salesOrder'] = el}
                />
              </div>
              <div className="form-group">
                <label>Customer Code *</label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="CUST-001"
                  className={errors.customer ? 'error' : ''}
                  ref={el => inputRefs.current['customer'] = el}
                  onFocus={() => setFocusedField('customer')}
                  onBlur={() => setFocusedField(null)}
                />
                {errors.customer && <span className="error-text">{errors.customer}</span>}
              </div>
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="ABC Corporation"
                  className={errors.customerName ? 'error' : ''}
                  ref={el => inputRefs.current['customerName'] = el}
                />
                {errors.customerName && <span className="error-text">{errors.customerName}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  ref={el => inputRefs.current['customerEmail'] = el}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+91-XXXXXXXXXX"
                  ref={el => inputRefs.current['customerPhone'] = el}
                />
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  placeholder="123, Main Street, City, State, PIN"
                  ref={el => inputRefs.current['customerAddress'] = el}
                />
              </div>
              <div className="form-group">
                <label>Invoice Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={errors.date ? 'error' : ''}
                  ref={el => inputRefs.current['date'] = el}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={errors.dueDate ? 'error' : ''}
                  ref={el => inputRefs.current['dueDate'] = el}
                />
                {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
              </div>
            </div>
          </div>

          {/* Currency
          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">Currency</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['currency'] = el}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="form-group">
                <label>Exchange Rate</label>
                <input
                  type="number"
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleInputChange}
                  step="0.0001"
                  min="0"
                  ref={el => inputRefs.current['exchangeRate'] = el}
                />
              </div>
            </div>
            {formData.exchangeRate > 0 && (
              <div className="exchange-summary">
                <FaExchangeAlt className="exchange-icon" />
                <span>1 {formData.currency} = {formData.exchangeRate} USD</span>
              </div>
            )}
          </div> */}

          {/* Items */}
          <div className="form-section">
            <div className="items-header">
              <h3 className="section-title">Items</h3>
              <button type="button" className="add-item-btn" onClick={addItemRow}>
                <FaPlus size={12} /> Add Item
              </button>
            </div>
            {errors.items && <div className="error-text">{errors.items}</div>}
            
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '110px' }}>Code</th>
                    <th style={{ minWidth: '130px' }}><FaFolder size={11} /> Category</th>
                    <th style={{ minWidth: '150px' }}>Item Name</th>
                    <th style={{ width: '65px' }}>Qty</th>
                    <th style={{ width: '90px' }}>Rate</th>
                    <th style={{ width: '70px' }}>Tax %</th>
                    <th style={{ width: '95px' }}>Amount</th>
                    <th style={{ width: '95px' }}>Total</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className={focusedField === `item_${index}` ? 'focused-row' : ''}>
                      <td>
                        <input
                          type="text"
                          value={item.itemCode}
                          onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                          placeholder="Code"
                          className={errors[`item_${index}_code`] ? 'error' : ''}
                          ref={el => {
                            const key = `item_${index}_itemCode`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onFocus={() => setFocusedField(`item_${index}`)}
                          onBlur={() => setFocusedField(null)}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'itemCode')}
                        />
                        {errors[`item_${index}_code`] && <span className="error-text">{errors[`item_${index}_code`]}</span>}
                      </td>
                      <td>
                        <select
                          value={item.itemCategory}
                          onChange={(e) => handleItemChange(index, 'itemCategory', e.target.value)}
                          ref={el => {
                            const key = `item_${index}_itemCategory`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'itemCategory')}
                          className="category-select"
                        >
                          <option value="">Select</option>
                          {itemCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          placeholder="Item name"
                          ref={el => {
                            const key = `item_${index}_itemName`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'itemName')}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                          min="1"
                          className={errors[`item_${index}_quantity`] ? 'error' : ''}
                          ref={el => {
                            const key = `item_${index}_quantity`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'quantity')}
                        />
                        {errors[`item_${index}_quantity`] && <span className="error-text">{errors[`item_${index}_quantity`]}</span>}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                          min="0"
                          step="0.01"
                          className={errors[`item_${index}_rate`] ? 'error' : ''}
                          ref={el => {
                            const key = `item_${index}_rate`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'rate')}
                        />
                        {errors[`item_${index}_rate`] && <span className="error-text">{errors[`item_${index}_rate`]}</span>}
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => handleItemChange(index, 'tax', Number(e.target.value))}
                          min="0"
                          max="100"
                          step="0.1"
                          ref={el => {
                            const key = `item_${index}_tax`;
                            itemInputRefs.current[key] = el;
                            inputRefs.current[key] = el;
                          }}
                          onKeyDown={(e) => handleItemKeyDown(e, index, 'tax')}
                        />
                      </td>
                      <td className="amount-cell">{formData.currency} {item.amount.toFixed(2)}</td>
                      <td className="amount-cell total-item">{formData.currency} {item.total.toFixed(2)}</td>
                      <td>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => removeItemRow(index)}
                            title="Delete item"
                          >
                            <FaTrash size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6} className="total-label">Total</td>
                    <td className="total-amount">{formData.currency} {formData.totalAmount.toFixed(2)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="keyboard-tips">
              <span><kbd>Enter</kbd> Next field</span>
              <span><kbd>Ctrl+Shift+A</kbd> Add item</span>
              <span><kbd>Alt+↓</kbd> Category dropdown</span>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="form-section summary-section">
            <div className="summary-grid">
              <div className="summary-item">
                <span>Subtotal</span>
                <strong>{formData.currency} {formData.subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Tax ({formData.taxPercent}%)</span>
                <strong>{formData.currency} {formData.taxAmount.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Discount</span>
                <strong className="discount-text">-{formData.currency} {formData.discountAmount.toFixed(2)}</strong>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <strong>{formData.currency} {formData.shippingCharge.toFixed(2)}</strong>
              </div>
              <div className="summary-item total-item">
                <span>Grand Total</span>
                <strong className="grand-total">{formData.currency} {formData.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Payment & Terms */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">Payment & Terms</h3>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Payment Terms</label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['paymentTerms'] = el}
                >
                  <option value="Net 7">Net 7</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount Paid</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  ref={el => inputRefs.current['paidAmount'] = el}
                />
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes..."
                  rows={2}
                  ref={el => inputRefs.current['notes'] = el}
                />
              </div>
              <div className="form-group full-width">
                <label>Terms & Conditions</label>
                <textarea
                  name="termsConditions"
                  value={formData.termsConditions}
                  onChange={handleInputChange}
                  placeholder="Terms and conditions..."
                  rows={2}
                  ref={el => inputRefs.current['termsConditions'] = el}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave /> Create Invoice
          </button>
        </div>
      </form>

      <style>{`
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        kbd {
          background: var(--layout-bg, #f3f4f6);
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 10px;
          font-family: monospace;
          color: var(--text-primary, #374151);
        }
      `}</style>
    </div>
  );
}