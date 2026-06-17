import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemQuickAdd from "./Itemquickadd";
import "./ItemList.css";

interface Item {
  id: string;
  itemName: string;
  status: "Enabled" | "Disabled";
  itemGroup: string;
  uom: string;
  itemType: string;
  purpose: string;
  ago: string;
  comments: number;
}

const MOCK_ITEMS: Item[] = [
  { id: "Table-001",  itemName: "Table",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "2 m",  comments: 0 },
  { id: "Door1",      itemName: "Door1",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "now",  comments: 0 },
  { id: "Table-002",  itemName: "Table",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "17 m", comments: 0 },
  { id: "chair-001",  itemName: "chair",  status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "21 m", comments: 0 },
  { id: "23",         itemName: "23",     status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "22 m", comments: 0 },
  { id: "chair-002",  itemName: "chair",  status: "Enabled", itemGroup: "Products",   uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "24 m", comments: 0 },
  { id: "354",        itemName: "354",    status: "Enabled", itemGroup: "Consumable", uom: "Nos", itemType: "Stock", purpose: "Sales", ago: "1 h",  comments: 0 },
];

export default function ItemList() {
  const navigate = useNavigate();
  const [items] = useState<Item[]>(MOCK_ITEMS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [hasVariants, setHasVariants] = useState(false);

  const toggleAll = () => {
    if (allChecked) { setSelected(new Set()); }
    else { setSelected(new Set(items.map((r) => r.id))); }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === items.length);
  };

  return (
    <div className="itl-page">
      {/* Topbar */}
      <div className="itl-topbar">
        <div className="itl-breadcrumb">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="itl-bc-sep">/</span>
          <span className="itl-bc-link">Manufacturing</span>
          <span className="itl-bc-sep">/</span>
          <span className="itl-bc-current">Item</span>
        </div>
        <div className="itl-topbar-right">
          <button className="itl-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="itl-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="itl-btn-icon" title="Refresh">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <button className="itl-btn-icon" title="More">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>
          <button className="itl-btn-primary" onClick={() => setShowModal(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="itl-filter-bar">
        <div className="itl-filter-tags">
          <div className="itl-filter-tag"><span className="itl-tag-label">ID</span><span className="itl-tag-op">≈</span></div>
          <div className="itl-filter-tag"><span className="itl-tag-label">Item Name</span><span className="itl-tag-op">≈</span></div>
          <div className="itl-filter-tag itl-tag-active"><span className="itl-tag-label">Item Group</span></div>
          <div className="itl-filter-tag"><span className="itl-tag-label">Variant Of</span></div>
          <div className="itl-filter-active-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters 1
            <button className="itl-tag-clear">×</button>
          </div>
        </div>
        <div className="itl-filter-right">
          <button className="itl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Has Variants */}
      <div className="itl-has-variants-bar">
        <input type="checkbox" id="hasVariants" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="itl-checkbox" />
        <label htmlFor="hasVariants" className="itl-has-variants-label">Has Variants</label>
      </div>

      {/* Table */}
      <div className="itl-table-wrap">
        <table className="itl-table">
          <thead>
            <tr>
              <th className="itl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="itl-checkbox" />
              </th>
              <th className="itl-th">Item Name</th>
              <th className="itl-th">Status</th>
              <th className="itl-th">Item Group</th>
              <th className="itl-th">UOM</th>
              <th className="itl-th">Item Type</th>
              <th className="itl-th">Purpose</th>
              <th className="itl-th itl-th-meta">
                <span className="itl-count-label">{items.length} of {items.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={row.id}
                className={`itl-tr ${selected.has(row.id) ? "itl-tr-selected" : ""}`}
                onClick={() => navigate(`/item/${encodeURIComponent(row.id)}`)}
              >
                <td className="itl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="itl-checkbox" />
                </td>
                <td className="itl-td itl-td-name">{row.itemName}</td>
                <td className="itl-td">
                  <span className={`itl-status-badge itl-status-${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
                <td className="itl-td">{row.itemGroup}</td>
                <td className="itl-td">{row.uom}</td>
                <td className="itl-td">{row.itemType}</td>
                <td className="itl-td">{row.purpose}</td>
                <td className="itl-td itl-td-meta">
                  <span className="itl-ago">{row.ago}</span>
                  <button className="itl-meta-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    {row.comments}
                  </button>
                  <span className="itl-dot">·</span>
                  <button className="itl-meta-btn" onClick={(e) => e.stopPropagation()}>
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
      <div className="itl-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button
            key={n}
            className={`itl-page-btn ${pageSize === n ? "itl-page-btn-active" : ""}`}
            onClick={() => setPageSize(n)}
          >{n}</button>
        ))}
      </div>

      {/* Quick Add Modal */}
      {showModal && (
        <ItemQuickAdd
          onClose={() => setShowModal(false)}
          onEditFull={(data) => {
            setShowModal(false);
            navigate("/item/new", { state: { prefill: data } });
          }}
        />
      )}
    </div>
  );
}