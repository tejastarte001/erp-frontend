import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Shortcuts</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card produced-quantity">
          <div className="stat-title">Produced Quantity</div>
          <div className="stat-value">0</div>
          <div className="stat-subtitle">Last synced just now</div>
          <div className="chart-container">
            <div className="chart-y-axis">
              <span>5</span>
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
            </div>
            <div className="chart-bars">
              {['Jun 2025', 'Aug 2025', 'Oct 2025', 'Dec 2025', 'Feb 2026', 'Apr 2026', 'Jun 2026'].map((month, i) => (
                <div key={i} className="chart-column">
                  <div className="bar" style={{ height: '0px' }}></div>
                  <div className="month-label">{month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Open Work Orders</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">WIP Work Orders</div>
          <div className="stat-value">0</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Manufactured Items Value</div>
          <div className="stat-value">₹ 0.00</div>
        </div>
      </div>

      <div className="reports-section">
        <h3>Reports & Masters</h3>
        <div className="reports-grid">
          <div className="report-item">Stock Summary</div>
          <div className="report-item">BOM Listing</div>
          <div className="report-item">Work Order Status</div>
          <div className="report-item">Inventory Valuation</div>
          <div className="report-item">Production Report</div>
          <div className="report-item">Material Request</div>
        </div>
      </div>
    </div>
  );
}