import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner, FaInfoCircle, FaExchangeAlt, FaPlus, FaTrash, FaKeyboard } from 'react-icons/fa';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import './CreateSalesOrder.css';
import toast from 'react-hot-toast';

interface SalesOrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface SalesOrderForm {
  series: string;
  orderType: string;
  isSubcontracted: boolean;
  salesOrderNumber: string;
  customer: string;
  date: string;
  deliveryDate: string;
  currency: string;
  priceList: string;
  exchangeRate: number;
  priceListCurrency: string;
  priceListExchangeRate: number;
  items: SalesOrderItem[];
  totalAmount: number;
  notes: string;
}

export default function CreateSalesOrder() {
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
  
  // Refs for keyboard navigation
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null }>({});
  const itemInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [formData, setFormData] = useState<SalesOrderForm>({
    series: 'SAL-ORD-YYYY-',
    orderType: 'Sales',
    isSubcontracted: false,
    salesOrderNumber: `SAL-ORD-${new Date().getFullYear()}-001`,
    customer: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    priceList: 'Standard Selling',
    exchangeRate: 1.0,
    priceListCurrency: 'INR',
    priceListExchangeRate: 1.0,
    items: [
      { id: '1', itemCode: '', itemName: '', quantity: 1, rate: 0, amount: 0 }
    ],
    totalAmount: 0,
    notes: ''
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(e as any);
      }
      
      // Ctrl+Shift+A or Cmd+Shift+A - Add item
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        addItemRow();
        toast.success('New item added');
        // Focus on the new item's code field after a short delay
        setTimeout(() => {
          const lastIndex = formData.items.length;
          const refKey = `item_${lastIndex}_code`;
          if (itemInputRefs.current[refKey]) {
            itemInputRefs.current[refKey]?.focus();
          }
        }, 100);
      }
      
      // Escape - Cancel/Go back
      if (e.key === 'Escape') {
        handleCancel();
      }
      
      // Alt+1, Alt+2, Alt+3 - Quick navigation to sections
      if (e.altKey) {
        switch(e.key) {
          case '1':
            e.preventDefault();
            document.getElementById('section-order-details')?.scrollIntoView({ behavior: 'smooth' });
            inputRefs.current['customer']?.focus();
            break;
          case '2':
            e.preventDefault();
            document.getElementById('section-currency')?.scrollIntoView({ behavior: 'smooth' });
            inputRefs.current['currency']?.focus();
            break;
          case '3':
            e.preventDefault();
            document.getElementById('section-items')?.scrollIntoView({ behavior: 'smooth' });
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData.items.length]);

  // Auto-focus first field on load
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current['customer']?.focus();
    }, 300);
  }, []);

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

  const handleItemChange = (index: number, field: keyof SalesOrderItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const rate = field === 'rate' ? Number(value) : updatedItems[index].rate;
      updatedItems[index].amount = quantity * rate;
    }
    
    const total = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: total
    }));
  };

  // Handle Enter key navigation through item fields
  const handleItemKeyDown = (e: React.KeyboardEvent, index: number, field: keyof SalesOrderItem) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fields: (keyof SalesOrderItem)[] = ['itemCode', 'itemName', 'quantity', 'rate'];
      const currentIndex = fields.indexOf(field);
      
      // If it's the last field in the row
      if (currentIndex === fields.length - 1) {
        // Check if we should add a new row (if rate has a value)
        if (formData.items[index].rate > 0 && formData.items[index].itemCode) {
          addItemRow();
          setTimeout(() => {
            const newIndex = index + 1;
            const refKey = `item_${newIndex}_code`;
            if (itemInputRefs.current[refKey]) {
              itemInputRefs.current[refKey]?.focus();
            }
          }, 100);
        } else {
          // Move to next row's code field
          const nextIndex = index + 1;
          if (nextIndex < formData.items.length) {
            const refKey = `item_${nextIndex}_code`;
            if (itemInputRefs.current[refKey]) {
              itemInputRefs.current[refKey]?.focus();
            }
          }
        }
      } else {
        // Move to next field in the same row
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
        { id: newId, itemCode: '', itemName: '', quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  };

  const removeItemRow = (index: number) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: total
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.customer.trim()) newErrors.customer = 'Customer is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.priceList) newErrors.priceList = 'Price list is required';
    if (formData.exchangeRate <= 0) newErrors.exchangeRate = 'Exchange rate must be greater than 0';
    
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
      // Focus on first error field
      const firstError = Object.keys(errors)[0];
      if (firstError && inputRefs.current[firstError]) {
        inputRefs.current[firstError]?.focus();
      }
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Sales Order Data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Sales Order created successfully!');
      navigate('/sales-order');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/sales-order');
    }
  };

  return (
    <div className={`create-sales-order-page ${theme}-theme`}>
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleCancel}>
            <FaArrowLeft size={16} />
          </button>
          <h1 className="page-title">Create New Sales Order</h1>
        </div>
        <div className="header-actions">
          <div className="keyboard-shortcuts-hint">
            <FaKeyboard size={14} />
            <span>Ctrl+S: Save | Ctrl+Shift+A: Add Item | Esc: Cancel</span>
          </div>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave /> Save Order (Ctrl+S)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="sales-order-form">
        <div className="form-scrollable">
          {/* Order Details Section */}
          <div className="form-section" id="section-order-details">
            <div className="section-header">
              <h3 className="section-title">Order Details</h3>
              <span className="section-shortcut">Alt+1</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Series *</label>
                <select
                  name="series"
                  value={formData.series}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['series'] = el}
                  required
                >
                  <option value="SAL-ORD-YYYY-">SAL-ORD-YYYY-</option>
                  <option value="SAL-RET-YYYY-">SAL-RET-YYYY-</option>
                  <option value="SAL-CR-YYYY-">SAL-CR-YYYY-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Order Type *</label>
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['orderType'] = el}
                  required
                >
                  <option value="Sales">Sales</option>
                  <option value="Return">Return</option>
                  <option value="Credit Note">Credit Note</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isSubcontracted"
                    checked={formData.isSubcontracted}
                    onChange={handleInputChange}
                    ref={el => inputRefs.current['isSubcontracted'] = el as any}
                  />
                  Is Subcontracted
                </label>
              </div>
              <div className="form-group">
                <label>Sales Order Number</label>
                <input
                  type="text"
                  value={formData.salesOrderNumber}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Customer * <span className="field-shortcut">(Tab to next)</span></label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  className={errors.customer ? 'error' : ''}
                  ref={el => inputRefs.current['customer'] = el}
                  onFocus={() => setFocusedField('customer')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                {errors.customer && <span className="error-text">{errors.customer}</span>}
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={errors.date ? 'error' : ''}
                  ref={el => inputRefs.current['date'] = el}
                  required
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['deliveryDate'] = el}
                />
              </div>
            </div>
          </div>

          {/* Currency Section */}
          <div className="form-section" id="section-currency">
            <div className="section-header">
              <h3 className="section-title">Currency and Price List ✓</h3>
              <span className="section-shortcut">Alt+2</span>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className={errors.currency ? 'error' : ''}
                  ref={el => inputRefs.current['currency'] = el}
                  required
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                  <option value="SGD">SGD</option>
                </select>
                {errors.currency && <span className="error-text">{errors.currency}</span>}
              </div>
              <div className="form-group">
                <label>Price List *</label>
                <select
                  name="priceList"
                  value={formData.priceList}
                  onChange={handleInputChange}
                  className={errors.priceList ? 'error' : ''}
                  ref={el => inputRefs.current['priceList'] = el}
                  required
                >
                  <option value="Standard Selling">Standard Selling</option>
                  <option value="Export Pricing">Export Pricing</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Retail">Retail</option>
                  <option value="Distributor">Distributor</option>
                </select>
                {errors.priceList && <span className="error-text">{errors.priceList}</span>}
              </div>
              <div className="form-group">
                <label>Exchange Rate *</label>
                <input
                  type="number"
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleInputChange}
                  step="0.000000001"
                  min="0"
                  className={errors.exchangeRate ? 'error' : ''}
                  ref={el => inputRefs.current['exchangeRate'] = el}
                  required
                />
                <span className="field-hint">
                  <FaInfoCircle size={10} /> Rate at which customer's currency is converted to company's base currency
                </span>
                {errors.exchangeRate && <span className="error-text">{errors.exchangeRate}</span>}
              </div>
              <div className="form-group">
                <label>Price List Currency *</label>
                <select
                  name="priceListCurrency"
                  value={formData.priceListCurrency}
                  onChange={handleInputChange}
                  ref={el => inputRefs.current['priceListCurrency'] = el}
                  required
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price List Exchange Rate</label>
                <input
                  type="number"
                  name="priceListExchangeRate"
                  value={formData.priceListExchangeRate}
                  onChange={handleInputChange}
                  step="0.000000001"
                  min="0"
                  ref={el => inputRefs.current['priceListExchangeRate'] = el}
                />
                <span className="field-hint">
                  <FaInfoCircle size={10} /> Rate at which Price list currency is converted to company's base currency
                </span>
              </div>
            </div>

            {formData.exchangeRate > 0 && (
              <div className="exchange-summary">
                <FaExchangeAlt className="exchange-icon" />
                <span>
                  1 {formData.currency} = {formData.exchangeRate} {formData.priceListCurrency}
                </span>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="form-section" id="section-items">
            <div className="items-header">
              <h3 className="section-title">Items <span className="section-shortcut">Alt+3</span></h3>
              <div className="header-actions">
                <span className="shortcut-hint">Ctrl+Shift+A</span>
                <button type="button" className="add-item-btn" onClick={addItemRow}>
                  <FaPlus size={12} /> Add Item
                </button>
              </div>
            </div>
            {errors.items && <div className="error-text">{errors.items}</div>}
            
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Code <span className="key-hint">(Enter to next)</span></th>
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th></th>
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
                            const key = `item_${index}_code`;
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
                      <td className="amount-cell">
                        {formData.currency} {item.amount.toFixed(2)}
                      </td>
                      <td>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => removeItemRow(index)}
                            title="Delete item (Shift+Delete)"
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
                    <td colSpan={4} className="total-label">Total Amount</td>
                    <td className="total-amount">{formData.currency} {formData.totalAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Keyboard Tips for Items */}
            <div className="keyboard-tips">
              <span>💡 <kbd>Enter</kbd> to move to next field</span>
              <span>💡 <kbd>Ctrl+Shift+A</kbd> to add new row</span>
              <span>💡 <kbd>Tab</kbd> to navigate fields</span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="form-section">
            <div className="form-group notes-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes..."
                rows={3}
                ref={el => inputRefs.current['notes'] = el}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel (Esc)
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading && <FaSpinner className="spinning" />}
            <FaSave /> Create Sales Order (Ctrl+S)
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
        
        kbd {
          background: var(--layout-bg, #f3f4f6);
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 10px;
          font-family: monospace;
          color: var(--text-primary, #374151);
        }
      `}</style>
    </div>
  );
}