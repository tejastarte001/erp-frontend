import React, { useState } from 'react';
import './SalesOrder.css';
import { useAdminTheme } from '../admin-theme/AdminThemeContext';

interface SalesOrderItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface SalesOrderForm {
  id: string;
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

export default function SalesOrder() {
  // Safe theme usage with try-catch
  let theme = 'light';
  try {
    const context = useAdminTheme();
    theme = context.theme;
  } catch (error) {
    console.log('Using default light theme');
  }

  const [showForm, setShowForm] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [salesOrders, setSalesOrders] = useState<SalesOrderForm[]>([
    {
      id: 'SO-001',
      series: 'SAL-ORD-YYYY-',
      orderType: 'Sales',
      isSubcontracted: false,
      salesOrderNumber: 'SAL-ORD-2026-001',
      customer: 'CUST-001',
      date: '2026-06-19',
      deliveryDate: '2026-06-26',
      currency: 'INR',
      priceList: 'Standard Selling',
      exchangeRate: 1.0,
      priceListCurrency: 'INR',
      priceListExchangeRate: 1.0,
      items: [],
      totalAmount: 15000,
      notes: 'Urgent delivery required'
    },
    {
      id: 'SO-002',
      series: 'SAL-ORD-YYYY-',
      orderType: 'Sales',
      isSubcontracted: false,
      salesOrderNumber: 'SAL-ORD-2026-002',
      customer: 'CUST-002',
      date: '2026-06-18',
      deliveryDate: '2026-06-25',
      currency: 'USD',
      priceList: 'Export Pricing',
      exchangeRate: 83.5,
      priceListCurrency: 'USD',
      priceListExchangeRate: 1.0,
      items: [],
      totalAmount: 25000,
      notes: ''
    }
  ]);

  const [formData, setFormData] = useState<SalesOrderForm>({
    id: `SO-${String(salesOrders.length + 1).padStart(3, '0')}`,
    series: 'SAL-ORD-YYYY-',
    orderType: 'Sales',
    isSubcontracted: false,
    salesOrderNumber: `SAL-ORD-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(3, '0')}`,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemChange = (index: number, field: keyof SalesOrderItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity;
      const rate = field === 'rate' ? Number(value) : updatedItems[index].rate;
      updatedItems[index].amount = quantity * rate;
    }
    
    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      totalAmount: total
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      ...formData,
      id: `SO-${String(salesOrders.length + 1).padStart(3, '0')}`,
      salesOrderNumber: `SAL-ORD-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(3, '0')}`
    };
    setSalesOrders(prev => [...prev, newOrder]);
    setShowForm(false);
    // Reset form
    setFormData({
      id: `SO-${String(salesOrders.length + 2).padStart(3, '0')}`,
      series: 'SAL-ORD-YYYY-',
      orderType: 'Sales',
      isSubcontracted: false,
      salesOrderNumber: `SAL-ORD-${new Date().getFullYear()}-${String(salesOrders.length + 2).padStart(3, '0')}`,
      customer: '',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'INR',
      priceList: 'Standard Selling',
      exchangeRate: 1.0,
      priceListCurrency: 'INR',
      priceListExchangeRate: 1.0,
      items: [{ id: '1', itemCode: '', itemName: '', quantity: 1, rate: 0, amount: 0 }],
      totalAmount: 0,
      notes: ''
    });
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(filterText.toLowerCase()) ||
                         order.salesOrderNumber.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.orderType === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`sales-order-page ${theme}-theme`}>
      <div className="page-header">
        <h1 className="page-title">Sales Order</h1>
        {/* <button className="add-btn" onClick={() => setShowForm(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Sales Order
        </button> */}
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Sales">Sales</option>
            <option value="Return">Return</option>
            <option value="Credit Note">Credit Note</option>
          </select>
          <input type="date" className="date-filter" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
      </div>

      {/* Sales Order List */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className="empty-title">You haven't created a Sales Order yet</h3>
            <p className="empty-subtitle">Create your first Sales Order</p>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Delivery Date</th>
                  <th>Order Type</th>
                  <th>Currency</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="order-id">{order.salesOrderNumber}</span></td>
                    <td>{order.customer}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>{new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.orderType === 'Sales' ? 'status-sales' : 'status-return'}`}>
                        {order.orderType}
                      </span>
                    </td>
                    <td>{order.currency}</td>
                    <td>${order.totalAmount.toLocaleString()}</td>
                    <td>
                      <button className="action-btn view-btn" title="View">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className="action-btn edit-btn" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="action-btn delete-btn" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Sales Order Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Sales Order</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="sales-order-form">
              {/* Order Details Section */}
              <div className="form-section">
                <h3 className="section-title">Order Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Series *</label>
                    <select
                      name="series"
                      value={formData.series}
                      onChange={handleInputChange}
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
                    <label>Customer *</label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Currency and Price List Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Currency and Price List ✓</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Currency *</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AED">AED</option>
                      <option value="SGD">SGD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price List *</label>
                    <select
                      name="priceList"
                      value={formData.priceList}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Standard Selling">Standard Selling</option>
                      <option value="Export Pricing">Export Pricing</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Retail">Retail</option>
                      <option value="Distributor">Distributor</option>
                    </select>
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
                      required
                    />
                    <span className="field-hint">Rate at which customer's currency is converted to company's base currency</span>
                  </div>
                  <div className="form-group">
                    <label>Price List Currency *</label>
                    <select
                      name="priceListCurrency"
                      value={formData.priceListCurrency}
                      onChange={handleInputChange}
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
                    />
                    <span className="field-hint">Rate at which Price list currency is converted to company's base currency</span>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="form-section">
                <h3 className="section-title">Items</h3>
                <div className="items-section">
                  <div className="items-header">
                    <button type="button" className="add-item-btn" onClick={addItemRow}>
                      + Add Item
                    </button>
                  </div>
                  <div className="items-table-wrapper">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="text"
                                value={item.itemCode}
                                onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                                placeholder="Item code"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.itemName}
                                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                placeholder="Item name"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                min="1"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                                min="0"
                                step="0.01"
                              />
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
                                >
                                  ×
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
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}