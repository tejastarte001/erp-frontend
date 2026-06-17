// WarehouseList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WarehouseList.css";

interface Warehouse {
  id: string;
  name: string;
  status: "Enabled" | "Disabled";
  company: string;
  account: string;
  isGroup: boolean;
  createdOn: string;
}

const MOCK_WAREHOUSES: Warehouse[] = [
  { id: "1001s", name: "Goods In Transit-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1002s", name: "Finished Goods-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1003s", name: "Work In Progress-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1004s", name: "Stores-T", status: "Enabled", company: "Test", account: "Test", isGroup: false, createdOn: "1d" },
  { id: "1005s", name: "All Warehouses-T", status: "Enabled", company: "Test", account: "Test", isGroup: true, createdOn: "1d" },
];

export default function WarehouseList() {
  const navigate = useNavigate();
  const [warehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(warehouses.map((r) => r.id)));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === warehouses.length);
  };

  return (
    <div className="wl-content">
      {/* Topbar */}
      <div className="wl-topbar">
        <div className="wl-breadcrumb">
          <span className="wl-bc-link">Stock</span>
          <span className="wl-bc-sep">/</span>
          <span className="wl-bc-link">Stock</span>
          <span className="wl-bc-sep">/</span>
          <span className="wl-bc-current">Warehouse</span>
        </div>
        <div className="wl-topbar-right">
          <button className="wl-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="wl-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="wl-btn-primary" onClick={() => navigate("/warehouse/new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="wl-filter-bar">
        <div className="wl-filter-tags">
          <div className="wl-filter-tag"><span className="wl-tag-label">ID</span><span className="wl-tag-op">≈</span></div>
          <div className="wl-filter-tag"><span className="wl-tag-label">Company</span></div>
          <div className="wl-filter-tag wl-tag-active"><span className="wl-tag-label">Filter</span></div>
          <div className="wl-filter-active-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters 1
            <button className="wl-tag-clear">×</button>
          </div>
        </div>
        <div className="wl-filter-right">
          <button className="wl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="wl-table-wrap">
        <table className="wl-table">
          <thead>
            <tr>
              <th className="wl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="wl-checkbox" />
              </th>
              <th className="wl-th">ID</th>
              <th className="wl-th">Status</th>
              <th className="wl-th">Company</th>
              <th className="wl-th">Account</th>
              <th className="wl-th">Is Group Warehouse</th>
              <th className="wl-th wl-th-meta">
                <span className="wl-count-label">5 of 5</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((row) => (
              <tr
                key={row.id}
                className={`wl-tr ${selected.has(row.id) ? "wl-tr-selected" : ""}`}
                onClick={() => navigate(`/warehouse/${encodeURIComponent(row.name)}`)}
              >
                <td className="wl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="wl-checkbox" />
                </td>
                <td className="wl-td">{row.id}</td>
                <td className="wl-td">
                  <span className={`wl-status-badge wl-status-${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
                <td className="wl-td">{row.company}</td>
                <td className="wl-td">{row.account}</td>
                <td className="wl-td">{row.isGroup ? "✓" : ""}</td>
                <td className="wl-td wl-td-meta">
                  <span className="wl-ago">{row.createdOn}</span>
                  <button className="wl-meta-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="wl-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button key={n} className={`wl-page-btn ${n === 20 ? "wl-page-btn-active" : ""}`}>{n}</button>
        ))}
      </div>
    </div>
  );
}