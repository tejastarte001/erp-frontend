import { useLocation } from "react-router-dom";
import "./Header.css";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/bom": "BOM",
  "/work-order": "Work Order",
  "/job-card": "Job Card",
  "/stock-entry": "Stock Entry",
  "/material-planning": "Material Planning",
  "/tools": "Tools",
  "/reports": "Reports",
  "/setup": "Setup",
};

export default function Header() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Manufacturing";

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-title">{title}</span>
      </div>
      <div className="header-right">
        <button className="header-icon-btn" aria-label="More options">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>
    </header>
  );
}