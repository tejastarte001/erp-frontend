// ItemAttributeList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemAttributeList.css";

interface ItemAttribute {
  id: string;
  attributeName: string;
  status: "Enabled" | "Disabled";
  createdOn: string;
}

const MOCK_ATTRIBUTES: ItemAttribute[] = [
  { id: "1", attributeName: "Colour", status: "Enabled", createdOn: "1d" },
  { id: "2", attributeName: "Size", status: "Enabled", createdOn: "1d" },
];

export default function ItemAttributeList() {
  const navigate = useNavigate();
  const [attributes] = useState<ItemAttribute[]>(MOCK_ATTRIBUTES);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(attributes.map((r) => r.id)));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === attributes.length);
  };

  return (
    <div className="ial-content">
      {/* Topbar */}
      <div className="ial-topbar">
        <div className="ial-breadcrumb">
          <span className="ial-bc-link">Stock</span>
          <span className="ial-bc-sep">/</span>
          <span className="ial-bc-link">Stock</span>
          <span className="ial-bc-sep">/</span>
          <span className="ial-bc-current">Item Attribute</span>
        </div>
        <div className="ial-topbar-right">
          <button className="ial-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="ial-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="ial-btn-primary" onClick={() => navigate("/item-attribute/new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Item Attribute
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="ial-filter-bar">
        <div className="ial-filter-tags">
          <div className="ial-filter-tag"><span className="ial-tag-label">ID</span><span className="ial-tag-op">≈</span></div>
          <div className="ial-filter-tag"><span className="ial-tag-label">Status</span></div>
          <div className="ial-filter-tag itl-tag-active"><span className="ial-tag-label">Attribute Name</span></div>
          <div className="ial-filter-active-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters 1
            <button className="ial-tag-clear">×</button>
          </div>
        </div>
        <div className="ial-filter-right">
          <button className="ial-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ial-table-wrap">
        <table className="ial-table">
          <thead>
            <tr>
              <th className="ial-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="ial-checkbox" />
              </th>
              <th className="ial-th">ID</th>
              <th className="ial-th">Status</th>
              <th className="ial-th">Attribute Name</th>
              <th className="ial-th ial-th-meta">
                <span className="ial-count-label">2 of 2</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((row) => (
              <tr
                key={row.id}
                className={`ial-tr ${selected.has(row.id) ? "ial-tr-selected" : ""}`}
                onClick={() => navigate(`/item-attribute/${row.attributeName}`)}
              >
                <td className="ial-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="ial-checkbox" />
                </td>
                <td className="ial-td">{row.id}</td>
                <td className="ial-td">
                  <span className={`ial-status-badge ial-status-${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
                <td className="ial-td ial-td-name">{row.attributeName}</td>
                <td className="ial-td ial-td-meta">
                  <span className="ial-ago">{row.createdOn}</span>
                  <button className="ial-meta-btn" onClick={(e) => e.stopPropagation()}>
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
      <div className="ial-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button key={n} className={`ial-page-btn ${n === 20 ? "ial-page-btn-active" : ""}`}>{n}</button>
        ))}
      </div>
    </div>
  );
}