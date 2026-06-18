import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus, FaHeart, FaRegHeart, FaChevronDown, FaTimes,
  FaFileAlt, FaEllipsisV, FaFilter, FaSort,
} from "react-icons/fa";
import "./JobCardManagement.css";

// ─── interfaces ───────────────────────────────────────────────────────────

interface JobCard {
  id: number;
  job_card_id: string; // e.g. "PO-JOB-00001"
  status: string; // Open, Work In Progress, Completed, On Hold, Cancelled
  work_order: string;
  operation: string;
  workstation: string;
  qty_to_manufacture: number;
  total_completed_qty: number;
  created_on: string;
  is_favorite?: boolean;
}

type StatusFilter = "all" | "Open" | "Work In Progress" | "Completed" | "On Hold" | "Cancelled";

const STATUS_COLORS: { [key: string]: { bg: string; text: string } } = {
  Open: { bg: "#dbeafe", text: "#1d4ed8" },
  "Work In Progress": { bg: "#fef3c7", text: "#b45309" },
  Completed: { bg: "#d1fae5", text: "#047857" },
  "On Hold": { bg: "#fee2e2", text: "#b91c1c" },
  Cancelled: { bg: "#f3f4f6", text: "#6b7280" },
};

// Placeholder data so the page renders something meaningful.
// Replace with real data once the API layer is wired up.
const MOCK_JOB_CARDS: JobCard[] = [];

const relativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "1d";
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo`;
  return `${Math.floor(diffMonths / 12)}y`;
};

const JobCardManagement: React.FC = () => {
  const navigate = useNavigate();

  const [jobCards, setJobCards] = useState<JobCard[]>(MOCK_JOB_CARDS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [pageSize, setPageSize] = useState<20 | 100 | 500 | 2500>(20);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setJobCards((prev) =>
      prev.map((jc) => (jc.id === id ? { ...jc, is_favorite: !jc.is_favorite } : jc))
    );
  };

  const handleRowClick = (jobCard: JobCard) => {
    // Click row to open edit mode — mirrors the pattern used across
    // CarList, InsuranceManagement, AgreementManagement, etc.
    navigate(`/job-cards/${jobCard.id}`, { state: { jobCard } });
  };

  const handleMenuToggle = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (e: React.MouseEvent, jobCard: JobCard) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (!window.confirm(`Delete job card ${jobCard.job_card_id}?`)) return;
    setJobCards((prev) => prev.filter((jc) => jc.id !== jobCard.id));
  };

  const filteredJobCards = useMemo(() => {
    if (statusFilter === "all") return jobCards;
    return jobCards.filter((jc) => jc.status === statusFilter);
  }, [jobCards, statusFilter]);

  const visibleJobCards = filteredJobCards.slice(0, pageSize);

  return (
    <div className="jcm-page">
      <div className="jcm-container">

        {/* Breadcrumb + header row */}
        <div className="jcm-header-row">
          <div>
            <div className="jcm-breadcrumb">Manufacturing / Job Card</div>
            <h1 className="jcm-title">Job Card</h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/job-cards/new")}
            className="jcm-add-btn"
          >
            <FaPlus size={12} /> Add Job Card
          </button>
        </div>

        {/* Filter / sort bar */}
        <div className="jcm-filter-bar">
          <div className="jcm-filter-dropdown-wrap">
            <button
              type="button"
              onClick={() => setShowStatusDropdown((p) => !p)}
              className={`jcm-filter-btn ${statusFilter !== "all" ? "jcm-filter-btn-active" : ""}`}
            >
              <FaFilter size={10} />
              {statusFilter === "all" ? "Status" : statusFilter}
              {statusFilter !== "all" && (
                <FaTimes
                  size={10}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusFilter("all");
                  }}
                />
              )}
              <FaChevronDown
                size={9}
                className="jcm-chevron"
                style={{ transform: showStatusDropdown ? "rotate(180deg)" : "none" }}
              />
            </button>
            {showStatusDropdown && (
              <div className="jcm-filter-menu">
                {(["all", "Open", "Work In Progress", "Completed", "On Hold", "Cancelled"] as StatusFilter[]).map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setShowStatusDropdown(false);
                    }}
                    className={`jcm-filter-option ${statusFilter === s ? "jcm-filter-option-active" : ""}`}
                  >
                    {s === "all" ? "All Statuses" : s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="jcm-sort-pill">
            <FaSort size={10} /> Created On
          </div>
        </div>

        {/* Table card */}
        <div className="jcm-table-card">
          <table className="jcm-table">
            <colgroup>
              <col style={{ width: "44px" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "48px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Job Card ID</th>
                <th>Status</th>
                <th>Work Order</th>
                <th>Operation</th>
                <th>Qty</th>
                <th className="jcm-th-right">{filteredJobCards.length} of {jobCards.length}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleJobCards.length === 0 ? (
                <tr>
                  <td colSpan={8} className="jcm-empty-cell">
                    <FaFileAlt size={28} className="jcm-empty-icon" />
                    <div className="jcm-empty-text">You haven't created a Job Card yet</div>
                    <button
                      type="button"
                      onClick={() => navigate("/job-cards/new")}
                      className="jcm-empty-btn"
                    >
                      Create your first Job Card
                    </button>
                  </td>
                </tr>
              ) : (
                visibleJobCards.map((jc) => {
                  const statusColor = STATUS_COLORS[jc.status] || STATUS_COLORS.Open;
                  return (
                    <tr key={jc.id} onClick={() => handleRowClick(jc)} className="jcm-row">
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" />
                      </td>
                      <td className="jcm-cell-strong">{jc.job_card_id}</td>
                      <td>
                        <span
                          className="jcm-status-badge"
                          style={{ background: statusColor.bg, color: statusColor.text }}
                        >
                          {jc.status}
                        </span>
                      </td>
                      <td className="jcm-cell-muted">{jc.work_order || "—"}</td>
                      <td className="jcm-cell-muted">{jc.operation || "—"}</td>
                      <td className="jcm-cell-muted">
                        {jc.total_completed_qty ?? 0}/{jc.qty_to_manufacture ?? 0}
                      </td>
                      <td className="jcm-cell-time">{relativeTime(jc.created_on)}</td>
                      <td className="jcm-actions-cell" onClick={(e) => e.stopPropagation()}>
                        <div className="jcm-actions-inner">
                          <span
                            onClick={(e) => toggleFavorite(e, jc.id)}
                            className={`jcm-fav-icon ${jc.is_favorite ? "jcm-fav-active" : ""}`}
                          >
                            {jc.is_favorite ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                          </span>
                          <span onClick={(e) => handleMenuToggle(e, jc.id)} className="jcm-ellipsis-icon">
                            <FaEllipsisV size={13} />
                          </span>
                        </div>
                        {openMenuId === jc.id && (
                          <div className="jcm-row-menu">
                            <div
                              onClick={() => {
                                setOpenMenuId(null);
                                handleRowClick(jc);
                              }}
                              className="jcm-row-menu-item"
                            >
                              Edit
                            </div>
                            <div
                              onClick={(e) => handleDelete(e, jc)}
                              className="jcm-row-menu-item jcm-row-menu-danger"
                            >
                              Delete
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Page size selector */}
        <div className="jcm-pagesize-row">
          {[20, 100, 500, 2500].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setPageSize(size as 20 | 100 | 500 | 2500)}
              className={`jcm-pagesize-btn ${pageSize === size ? "jcm-pagesize-btn-active" : ""}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCardManagement;