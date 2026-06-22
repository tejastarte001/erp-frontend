import { useLocation } from "react-router-dom";
import "./Header.css";
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import { useModule } from '../context/ModuleContext';

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/home": "Home",
  "/bom": "BOM",
  "/work-order": "Work Order",
  "/job-card": "Job Card",
  "/stock-entry": "Stock Entry",
  "/material-planning": "Material Planning",
  "/tools": "Tools",
  "/reports": "Reports",
  "/setup": "Setup",
  "/settings": "Settings",
  "/item-list": "Item List",
  "/item-group": "Item Group",
  "/item-attribute": "Item Attribute",
  "/brand": "Brand",
  "/warehouse": "Warehouse",
  "/uom": "Unit of Measure",
  "/uom-conversion": "UOM Conversion",
  "/serial-no": "Serial No",
  "/batch-no": "Batch No",
  "/serial-batch-bundle": "Serial & Batch Bundle",
  "/sales-order": "Sales Order",
  "/sales-order/new": "Add Sales Order",
  "/sales-invoice": "Sales Invoice",
  "/sales-invoice/new": "Create Sales Invoice",
  "/company": "Company",
  "/letter-head": "Letter Head",
  "/quality": "Quality",
  "/stock": "Stock",
};

// Module names for display
const MODULE_NAMES: Record<string, string> = {
  'home': 'Home',
  'manufacturing': 'Manufacturing',
  'setup': 'Setup',
  'sales': 'Sales',
  'organization': 'Organization',
  'tools': 'Tools',
  'reports': 'Reports',
  'system': 'System'
};

export default function Header() {
  const location = useLocation();
  const { theme } = useAdminTheme();
  const { currentModule } = useModule();
  
  // Get the page title from the path
  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";
  
  // Get the module name
  const moduleName = MODULE_NAMES[currentModule] || 'Home';

  // Don't show module name on home page
  const showModule = currentModule !== 'home';

  return (
    <header className={`header ${theme}`}>
      <div className="header-breadcrumb">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #6B7280)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="breadcrumb-sep">/</span>
        {showModule && (
          <>
            <span className="breadcrumb-module">{moduleName}</span>
            <span className="breadcrumb-sep">/</span>
          </>
        )}
        <span className="breadcrumb-title">{pageTitle}</span>
      </div>
      <div className="header-right">
        <button className="header-icon-btn" aria-label="More options">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary, #6B7280)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>
    </header>
  );
}