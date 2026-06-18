import React, { useState, useEffect } from 'react';
import { NavLink,  } from 'react-router-dom';
import './Sidebar.css';
// import { useAdminTheme } from '../admin-theme/AdminThemeContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function Sidebar({ 
  isOpen = true, 
  onClose,
  isMinimized = false,
  onToggleMinimize
}: SidebarProps) {
  // const location = useLocation();
  // const { theme } = useAdminTheme();
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('expandedCategories');
    return saved ? JSON.parse(saved) : {
      'Manufacturing': true,
      'Setup': false,
      'System': false
    };
  });

  // Save expanded categories to localStorage
  useEffect(() => {
    localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
  }, [expandedCategories]);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle]
    }));
  };

  // Handle nav item click - expand sidebar if minimized
  const handleNavClick = (e: React.MouseEvent) => {
    if (isMinimized && onToggleMinimize) {
      e.preventDefault();
      onToggleMinimize();
      // After expanding, navigate to the link
      const target = e.currentTarget as HTMLAnchorElement;
      setTimeout(() => {
        window.location.href = target.href;
      }, 350);
    }
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  // Menu categories for ERP
  const menuCategories = [
    {
      title: 'Home',
      icon: <HomeIcon />,
      items: [
        { title: 'Home', icon: <HomeIcon />, path: '/home' },
        { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }
      ]
    },
    {
      title: 'Manufacturing',
      icon: <ManufacturingIcon />,
      items: [
        { title: 'BOM', icon: <BomIcon />, path: '/bom' },
        { title: 'Work Order', icon: <WorkOrderIcon />, path: '/work-order' },
        { title: 'Job Card', icon: <JobCardIcon />, path: '/job-card' },
        { title: 'Stock Entry', icon: <StockIcon />, path: '/stock-entry' },
        { title: 'Material Planning', icon: <TruckIcon />, path: '/material-planning' }
      ]
    },
    {
      title: 'Setup',
      icon: <SetupIcon />,
      items: [
        { title: 'Item', icon: <ItemIcon />, path: '/item-list' },
        { title: 'Item Group', icon: <FolderIcon />, path: '/item-group' },
        { title: 'Item Attribute', icon: <TagIcon />, path: '/item-attribute' },
        { title: 'Brand', icon: <BrandIcon />, path: '/brand' },
        { title: 'Warehouse', icon: <WarehouseIcon />, path: '/warehouse' },
        { title: 'Unit of Measure (UOM)', icon: <RulerIcon />, path: '/uom' },
        { title: 'UOM Conversion Factor', icon: <RepeatIcon />, path: '/uom-conversion' },
        { title: 'Serial No', icon: <HashIcon />, path: '/serial-no' },
        { title: 'Batch No', icon: <LayersIcon />, path: '/batch-no' },
        { title: 'Serial and Batch Bundle', icon: <PackageIcon />, path: '/serial-batch-bundle' }
      ]
    },
    {
      title: 'Tools',
      icon: <ToolIcon />,
      items: [
        { title: 'Tools', icon: <ToolIcon />, path: '/tools' }
      ]
    },
    {
      title: 'Reports',
      icon: <ReportsIcon />,
      items: [
        { title: 'Reports', icon: <ReportsIcon />, path: '/reports' }
      ]
    },
    {
      title: 'System',
      icon: <SettingsIcon />,
      items: [
        { title: 'Settings', icon: <SettingsIcon />, path: '/settings' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMinimized ? 'minimized' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
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
          {onClose && (
            <button className="mobile-close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        {/* Search + Notification */}
        <div className="sidebar-top">
          <div className="search-row">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="var(--sidebar-text-secondary, #9CA3AF)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M14 14L11 11" stroke="var(--sidebar-text-secondary, #9CA3AF)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" className="sidebar-search" />
            <span className="search-shortcut">Ctrl+K</span>
          </div>
          <div className="notification-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sidebar-text-secondary, #6B7280)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="notification-label">Notification</span>
            <span className="notification-count">3</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {menuCategories.map((category, idx) => (
            <div key={idx} className="nav-category">
              <div 
                className="category-header"
                onClick={() => toggleCategory(category.title)}
              >
                <div className="category-header-left">
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-title">{category.title}</span>
                </div>
                <span className="category-toggle">
                  {expandedCategories[category.title] ? 
                    <ChevronUpIcon /> : 
                    <ChevronDownIcon />
                  }
                </span>
              </div>
              <div className={`category-items-wrapper ${expandedCategories[category.title] ? 'expanded' : 'collapsed'}`}>
                <div className="category-items">
                  {category.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => 
                        `nav-item ${isActive ? 'active' : ''}`
                      }
                      onClick={handleNavClick}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.title}</span>
                      {isMinimized && (
                        <span className="nav-tooltip">
                          {item.title}
                          <span className="tooltip-shortcut">Click to expand</span>
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Getting Started Card */}
          <div className="getting-started-section">
            <div className="getting-started-card">
              <div className="gs-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sidebar-text-secondary, #9CA3AF)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="gs-text">Complete setup to start manufacturing</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">TT</div>
          <div className="user-info">
            <div className="user-name">Tejas Tarte</div>
            <div className="user-email">tejasvitthaltarte@gm...</div>
          </div>
        </div>
      </aside>

      {/* Toggle Button - Outside sidebar */}
      <button 
        className={`sidebar-toggle-btn ${isMinimized ? 'minimized' : 'expanded'}`}
        onClick={onToggleMinimize}
        aria-label={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
        title={isMinimized ? 'Click to expand' : 'Click to minimize'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span className="toggle-tooltip">
          {isMinimized ? 'Expand' : 'Minimize'}
        </span>
      </button>
    </>
  );
}

// --- Icon Components ---
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

const ManufacturingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6M4 20L20 4M18 20h-6M4 8V4h4"/>
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

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
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

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 8l4-4 4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);