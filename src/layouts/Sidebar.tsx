import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [isManufacturingOpen, setIsManufacturingOpen] = useState(true);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div>
            <div className="logo-text">Manufacturing <span className="logo-highlight">ERP</span></div>
          </div>
        </div>
        {/* <div className="logo-subtitle">ERPNext</div> */}
      </div>

      {/* Search + Notification */}
      <div className="sidebar-top">
        <div className="search-row">
          <svg className="search-icon" width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 14L11 11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search" className="sidebar-search" />
          <span className="search-shortcut">Ctrl+K</span>
        </div>
        <div className="notification-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-label">Notification</span>
          <span className="notification-count">3</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">Home</div>
          <NavLink to="/home" className="nav-link">
            <HomeIcon /> <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            <DashboardIcon /> <span>Dashboard</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div
            className="nav-label collapsible"
            onClick={() => setIsManufacturingOpen(!isManufacturingOpen)}
          >
            <span>Manufacturing</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d={isManufacturingOpen ? "M2 4l4 4 4-4" : "M4 2l4 4-4 4"} stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {isManufacturingOpen && (
            <div className="nav-items">
              <NavLink to="/bom" className="nav-link">
                <BomIcon /> <span>BOM</span>
              </NavLink>
              <NavLink to="/work-order" className="nav-link">
                <WorkOrderIcon /> <span>Work Order</span>
              </NavLink>
              <NavLink to="/job-card" className="nav-link">
                <JobCardIcon /> <span>Job Card</span>
              </NavLink>
              <NavLink to="/stock-entry" className="nav-link">
                <StockIcon /> <span>Stock Entry</span>
              </NavLink>
              <NavLink to="/material-planning" className="nav-link">
                <TruckIcon /> <span>Material Planning</span>
                <ChevronRight className="nav-chevron" />
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-section">
          <NavLink to="/tools" className="nav-link">
            <ToolIcon /> <span>Tools</span>
            <ChevronRight className="nav-chevron" />
          </NavLink>
          <NavLink to="/reports" className="nav-link">
            <ReportsIcon /> <span>Reports</span>
            <ChevronRight className="nav-chevron" />
          </NavLink>
          
          {/* Setup with expandable items - same style as Manufacturing */}
          <div
            className="nav-label collapsible"
            onClick={() => setIsSetupOpen(!isSetupOpen)}
          >
             <SetupIcon /> <span>Setup</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d={isSetupOpen ? "M2 4l4 4 4-4" : "M4 2l4 4-4 4"} stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {isSetupOpen && (
            <div className="nav-items">
              <NavLink to="/item-list" className="nav-link">
                <ItemIcon /> <span>Item</span>
              </NavLink>
              <NavLink to="/item-group" className="nav-link">
                <FolderIcon /> <span>Item Group</span>
              </NavLink>
              <NavLink to="/item-attribute" className="nav-link">
                <TagIcon /> <span>Item Attribute</span>
              </NavLink>
              <NavLink to="/brand" className="nav-link">
                <BrandIcon /> <span>Brand</span>
              </NavLink>
              <NavLink to="/warehouse" className="nav-link">
                <WarehouseIcon /> <span>Warehouse</span>
              </NavLink>
              <NavLink to="/uom" className="nav-link">
                <RulerIcon /> <span>Unit of Measure (UOM)</span>
              </NavLink>
              <NavLink to="/uom-conversion" className="nav-link">
                <RepeatIcon /> <span>UOM Conversion Factor</span>
              </NavLink>
              <NavLink to="/serial-no" className="nav-link">
                <HashIcon /> <span>Serial No</span>
              </NavLink>
              <NavLink to="/batch-no" className="nav-link">
                <LayersIcon /> <span>Batch No</span>
              </NavLink>
              <NavLink to="/serial-batch-bundle" className="nav-link">
                <PackageIcon /> <span>Serial and Batch Bundle</span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-section getting-started-section">
          <div className="nav-label">Getting Started</div>
          <div className="getting-started-card">
            <div className="gs-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="gs-text">Complete setup to start manufacturing</div>
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="user-avatar">TT</div>
        <div className="user-info">
          <div className="user-name">Tejas Tarte</div>
          <div className="user-email">tejasvitthaltarte@gm...</div>
        </div>
      </div>
    </div>
  );
}

// --- Inline icon components ---
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const ItemIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const SetupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
);

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.17 9.17a2 2 0 0 0 2.83 0l7-7a2 2 0 0 0 0-2.83L12 2z"/><circle cx="7" cy="7" r="2" fill="none"/>
  </svg>
);

const BrandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h16M4 16h16M8 4v16M16 4v16"/>
  </svg>
);

const WarehouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20M12 2v20M8 4v2M16 4v2M4 8h2M18 8h2M4 16h2M18 16h2M8 20v2M16 20v2"/>
  </svg>
);

const RepeatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

const HashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);

const BomIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const WorkOrderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const JobCardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const StockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ToolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4 2l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);