import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemGroupList.css";

interface ItemGroup {
  id: string;
  itemGroupName: string;
  parentItemGroup: string;
  isGroup: boolean;
  createdAgo: string;
  comments: number;
}

const MOCK_DATA: ItemGroup[] = [
  { id: "Consumable", itemGroupName: "Consumable", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Sub Assemblies", itemGroupName: "Sub Assemblies", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Services", itemGroupName: "Services", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Raw Material", itemGroupName: "Raw Material", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "Products", itemGroupName: "Products", parentItemGroup: "All Item Groups", isGroup: false, createdAgo: "4 h", comments: 0 },
  { id: "All Item Groups", itemGroupName: "All Item Groups", parentItemGroup: "All Item Groups", isGroup: true, createdAgo: "4 h", comments: 0 },
];

export default function ItemGroupList() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [pageSize, setPageSize] = useState(20);

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(MOCK_DATA.map((r) => r.id)));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === MOCK_DATA.length);
  };

  return (
    <div className="igl-page">
      {/* Top bar */}
      <div className="igl-topbar">
        <div className="igl-breadcrumb">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="igl-bc-sep">/</span>
          <span className="igl-bc-link">Stock</span>
          <span className="igl-bc-sep">/</span>
          <span className="igl-bc-current">Item Group</span>
        </div>
        <div className="igl-topbar-right">
          <button className="igl-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="igl-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="igl-btn-icon" title="Refresh">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button className="igl-btn-icon" title="More">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>
          <button className="igl-btn-primary" onClick={() => navigate("/item-group/new")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Item Group
          </button>
        </div>
      </div>

      {/* Filter bar – exactly as screenshot: no hardcoded tag */}
      <div className="igl-filter-bar">
        <div className="igl-filter-tags">
          {/* No static filter tag – matches screenshot */}
        </div>
        <div className="igl-filter-right">
          {filterOpen && (
            <button className="igl-filter-btn active" onClick={() => setFilterOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
          {!filterOpen && (
            <button className="igl-filter-btn" onClick={() => setFilterOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter
            </button>
          )}
          <button className="igl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="igl-table-wrap">
        <table className="igl-table">
          <thead>
            <tr>
              <th className="igl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="igl-checkbox" />
              </th>
              <th className="igl-th">ID</th>
              <th className="igl-th">Item Group Name</th>
              <th className="igl-th">Parent Item Group</th>
              <th className="igl-th">Is Group</th>
              <th className="igl-th igl-th-right">
                <span className="igl-count-label">{MOCK_DATA.length} of {MOCK_DATA.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((row) => (
              <tr
                key={row.id}
                className={`igl-tr ${selected.has(row.id) ? "igl-tr-selected" : ""}`}
                onClick={() => navigate(`/item-group/${encodeURIComponent(row.id)}`)}
              >
                <td className="igl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="igl-checkbox" />
                </td>
                <td className="igl-td igl-td-id">{row.id}</td>
                <td className="igl-td">{row.itemGroupName}</td>
                <td className="igl-td">{row.parentItemGroup}</td>
                <td className="igl-td">
                  <input type="checkbox" checked={row.isGroup} readOnly className="igl-checkbox igl-checkbox-readonly" />
                </td>
                <td className="igl-td igl-td-meta">
                  <span className="igl-ago">{row.createdAgo}</span>
                  <button className="igl-comment-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {row.comments}
                  </button>
                  <span className="igl-dot">·</span>
                  <button className="igl-like-btn" onClick={(e) => e.stopPropagation()}>
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
      <div className="igl-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button
            key={n}
            className={`igl-page-btn ${pageSize === n ? "igl-page-btn-active" : ""}`}
            onClick={() => setPageSize(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}