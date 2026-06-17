// BrandList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandList.css";

interface Brand {
  id: string;
  name: string;
  description: string;
  createdOn: string;
}

interface BrandFormData {
  id: string;
  name: string;
  description: string;
}

const MOCK_BRANDS: Brand[] = [
  { id: "1", name: "RMW Electrical", description: "", createdOn: "1m" },
];

export default function BrandList() {
  const navigate = useNavigate();
  const [brands] = useState<Brand[]>(MOCK_BRANDS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<BrandFormData>({
    id: "",
    name: "",
    description: "",
  });

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(brands.map((r) => r.id)));
    }
    setAllChecked(!allChecked);
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    setAllChecked(next.size === brands.length);
  };

  const handleOpenModal = () => {
    setFormData({ id: "", name: "", description: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ id: "", name: "", description: "" });
  };

  const handleSave = () => {
    if (formData.name.trim()) {
      // Navigate to the brand detail page with the brand name
      navigate(`/brand/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  const handleEditFull = () => {
    if (formData.name.trim()) {
      navigate(`/brand/${encodeURIComponent(formData.name)}`);
      handleCloseModal();
    }
  };

  return (
    <div className="bl-content">
      {/* Topbar */}
      <div className="bl-topbar">
        <div className="bl-breadcrumb">
          <span className="bl-bc-link">Stock</span>
          <span className="bl-bc-sep">/</span>
          <span className="bl-bc-link">Stock</span>
          <span className="bl-bc-sep">/</span>
          <span className="bl-bc-current">Brand</span>
        </div>
        <div className="bl-topbar-right">
          <button className="bl-btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            List View
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="bl-btn-outline">
            Saved Filters
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="bl-btn-primary" onClick={handleOpenModal}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Brand
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bl-filter-bar">
        <div className="bl-filter-tags">
          <div className="bl-filter-tag"><span className="bl-tag-label">ID</span><span className="bl-tag-op">≈</span></div>
          <div className="bl-filter-tag"><span className="bl-tag-label">Description</span></div>
          <div className="bl-filter-tag bl-tag-active"><span className="bl-tag-label">Filter</span></div>
          <div className="bl-filter-active-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters 1
            <button className="bl-tag-clear">×</button>
          </div>
        </div>
        <div className="bl-filter-right">
          <button className="bl-sort-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
            </svg>
            Created On
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bl-table-wrap">
        <table className="bl-table">
          <thead>
            <tr>
              <th className="bl-th-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="bl-checkbox" />
              </th>
              <th className="bl-th">ID</th>
              <th className="bl-th">Description</th>
              <th className="bl-th bl-th-meta">
                <span className="bl-count-label">{brands.length} of {brands.length}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((row) => (
              <tr
                key={row.id}
                className={`bl-tr ${selected.has(row.id) ? "bl-tr-selected" : ""}`}
                onClick={() => navigate(`/brand/${encodeURIComponent(row.name)}`)}
              >
                <td className="bl-td-check" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                  <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="bl-checkbox" />
                </td>
                <td className="bl-td bl-td-name">{row.name}</td>
                <td className="bl-td">{row.description}</td>
                <td className="bl-td bl-td-meta">
                  <span className="bl-ago">{row.createdOn}</span>
                  <button className="bl-meta-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    0
                  </button>
                  <span className="bl-dot">·</span>
                  <button className="bl-meta-btn" onClick={(e) => e.stopPropagation()}>
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
      <div className="bl-pagination">
        {[20, 100, 500, 2500].map((n) => (
          <button key={n} className={`bl-page-btn ${n === 20 ? "bl-page-btn-active" : ""}`}>{n}</button>
        ))}
      </div>

      {/* New Brand Modal */}
      {showModal && (
        <div className="bl-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="bl-modal">
            <div className="bl-modal-header">
              <span className="bl-modal-title">New Brand</span>
              <button className="bl-modal-close" onClick={handleCloseModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="bl-modal-body">
              <div className="bl-field">
                <label className="bl-label">ID</label>
                <input
                  className="bl-input"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                />
              </div>

              <div className="bl-field">
                <label className="bl-label">Brand Name <span className="bl-req">*</span></label>
                <input
                  className="bl-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  placeholder="Enter brand name"
                />
              </div>
            </div>

            <div className="bl-modal-footer">
              <button className="bl-btn-edit-full" onClick={handleEditFull}>
                Edit Full Form
              </button>
              <button 
                className="bl-btn-save" 
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