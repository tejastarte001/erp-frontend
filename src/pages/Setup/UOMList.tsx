// UOMList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UOMList.css";

interface UOM {
  id: string;
  name: string;
  status: "Enabled" | "Disabled";
  category: string;
  createdOn: string;
}

interface UOMFormData {
  name: string;
  category: string;
}

const MOCK_UOMS: UOM[] = [
  { id: "1", name: "Abampere", status: "Enabled", category: "Electric Current", createdOn: "1d" },
  { id: "2", name: "Acre", status: "Enabled", category: "Area", createdOn: "1d" },
  { id: "3", name: "Acre (US)", status: "Enabled", category: "Area", createdOn: "1d" },
  { id: "4", name: "Ampere", status: "Enabled", category: "Electric Current", createdOn: "1d" },
  { id: "5", name: "Ampere-Hour", status: "Enabled", category: "Electrical Charge", createdOn: "1d" },
  { id: "6", name: "Ampere-Minute", status: "Enabled", category: "Electrical Charge", createdOn: "1d" },
  { id: "7", name: "Ampere-Second", status: "Enabled", category: "Electrical Charge", createdOn: "1d" },
  { id: "8", name: "Are", status: "Enabled", category: "Area", createdOn: "1d" },
  { id: "9", name: "Area", status: "Enabled", category: "Area", createdOn: "1d" },
  { id: "10", name: "Arshin", status: "Enabled", category: "Length", createdOn: "1d" },
  { id: "11", name: "Atmosphere", status: "Enabled", category: "Pressure", createdOn: "1d" },
  { id: "12", name: "Bar", status: "Enabled", category: "Pressure", createdOn: "1d" },
];

const CATEGORIES = [
  "Area",
  "Electric Current",
  "Electrical Charge",
  "Length",
  "Pressure",
  "Volume",
  "Weight",
  "Time",
  "Temperature",
  "Speed",
  "Frequency",
  "Force",
  "Energy",
  "Power",
];

export default function UOMList() {
  const navigate = useNavigate();
  const [uoms] = useState<UOM[]>(MOCK_UOMS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<UOMFormData>({
    name: "",
    category: "",
  });

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(uoms.map((r) => r.id)));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === uoms.length);
  };

  const handleOpenModal = () => {
    setFormData({ name: "", category: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ name: "", category: "" });
  };

  const handleSave = () => {
    if (formData.name.trim()) {
      navigate(`/uom/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  const handleEditFull = () => {
    if (formData.name.trim()) {
      navigate(`/uom/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  return (
    <div className="uoml-content">
      {/* Topbar */}
      <div className="uoml-topbar">
        <div className="uoml-breadcrumb">
          <span className="uoml-bc-link">Stock</span>
          <span className="uoml-bc-sep">/</span>
          <span className="uoml-bc-link">Stock</span>
          <span className="uoml-bc-sep">/</span>
          <span className="uoml-bc-current">UOM</span>
        </div>
        <div className="uoml-topbar-right">
          <button className="uoml-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="uoml-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="uoml-btn-primary" onClick={handleOpenModal}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add UOM
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="uoml-filter-bar">
        <div className="uoml-filter-tags">
          <div className="uoml-filter-tag"><span className="uoml-tag-label">ID</span><span className="uoml-tag-op">≈</span></div>
          <div className="uoml-filter-tag"><span className="uoml-tag-label">Status</span></div>
          <div className="uoml-filter-tag"><span className="uoml-tag-label">UOM Name</span></div>
          <div className="uoml-filter-tag uoml-tag-active"><span className="uoml-tag-label">Category</span></div>
          <div className="uoml-filter-active-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters 1
            <button className="uoml-tag-clear">×</button>
          </div>
        </div>
        <div className="uoml-filter-right">
          <button className="uoml-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="uoml-table-wrap">
        <table className="uoml-table">
          <thead>
            <tr>
              <th className="uoml-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="uoml-checkbox" />
              </th>
              <th className="uoml-th">ID</th>
              <th className="uoml-th">Status</th>
              <th className="uoml-th">UOM Name</th>
              <th className="uoml-th">Category</th>
              <th className="uoml-th uoml-th-meta">
                <span className="uoml-count-label">20 of 239</span>
                <button className="uoml-load-more">Load More</button>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {uoms.map((row) => (
              <tr
                key={row.id}
                className={`uoml-tr ${selected.has(row.id) ? "uoml-tr-selected" : ""}`}
                onClick={() => navigate(`/uom/${encodeURIComponent(row.name)}`)}
              >
                <td className="uoml-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="uoml-checkbox" />
                </td>
                <td className="uoml-td">{row.id}</td>
                <td className="uoml-td">
                  <span className={`uoml-status-badge uoml-status-${row.status.toLowerCase()}`}>{row.status}</span>
                </td>
                <td className="uoml-td uoml-td-name">{row.name}</td>
                <td className="uoml-td">{row.category}</td>
                <td className="uoml-td uoml-td-meta">
                  <span className="uoml-ago">{row.createdOn}</span>
                  <button className="uoml-meta-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    0
                  </button>
                  <span className="uoml-dot">·</span>
                  <button className="uoml-meta-btn" onClick={(e) => e.stopPropagation()}>
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
      <div className="uoml-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button key={n} className={`uoml-page-btn ${n === 20 ? "uoml-page-btn-active" : ""}`}>{n}</button>
        ))}
      </div>

      {/* New UOM Modal */}
      {showModal && (
        <div className="uoml-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="uoml-modal">
            <div className="uoml-modal-header">
              <span className="uoml-modal-title">New UOM</span>
              <button className="uoml-modal-close" onClick={handleCloseModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="uoml-modal-body">
              <div className="uoml-field">
                <label className="uoml-label">UOM Name <span className="uoml-req">*</span></label>
                <input
                  className="uoml-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  placeholder="Enter UOM name"
                />
              </div>

              <div className="uoml-field">
                <label className="uoml-label">Category</label>
                <select
                  className="uoml-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="uoml-modal-footer">
              <button className="uoml-btn-edit-full" onClick={handleEditFull}>
                Edit Full Form
              </button>
              <button 
                className="uoml-btn-save" 
                onClick={handleSave}
                disabled={!formData.name.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}