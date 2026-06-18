import { useState } from "react";
import {
  FaTimes,
  FaSave,
  FaEdit,
  FaSpinner,
} from 'react-icons/fa';
import "./ItemQuickAdd.css";
import { useAdminTheme } from '../../admin-theme/AdminThemeContext';

interface ItemQuickAddProps {
  onClose: () => void;
  onEditFull: (data: QuickAddData) => void;
}

interface QuickAddData {
  itemCode: string;
  itemName: string;
  itemGroup: string;
  hsnSac: string;
  defaultUOM: string;
  maintainStock: boolean;
  isFixedAsset: boolean;
}

export default function ItemQuickAdd({ onClose, onEditFull }: ItemQuickAddProps) {
  const { theme } = useAdminTheme();
  const [data, setData] = useState<QuickAddData>({
    itemCode: "",
    itemName: "",
    itemGroup: "",
    hsnSac: "",
    defaultUOM: "Nos",
    maintainStock: true,
    isFixedAsset: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof QuickAddData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!data.itemCode || !data.itemGroup) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onEditFull(data);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className={`qad-overlay ${theme}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="qad-modal">
        {/* Header */}
        <div className="qad-header">
          <div className="qad-header-left">
            <div className="qad-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <span className="qad-title">New Item</span>
          </div>
          <button className="qad-close" onClick={onClose} title="Close">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="qad-body">
          <div className="qad-field">
            <label className="qad-label">
              Item Code <span className="qad-req">*</span>
            </label>
            <input
              className="qad-input"
              value={data.itemCode}
              onChange={(e) => set("itemCode", e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              placeholder="Enter item code"
            />
          </div>

          <div className="qad-field">
            <label className="qad-label">Item Name</label>
            <input
              className="qad-input"
              value={data.itemName}
              onChange={(e) => set("itemName", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter item name"
            />
          </div>

          <div className="qad-field">
            <label className="qad-label">
              Item Group <span className="qad-req">*</span>
            </label>
            <input
              className="qad-input"
              value={data.itemGroup}
              onChange={(e) => set("itemGroup", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter item group"
            />
          </div>

          <div className="qad-field">
            <label className="qad-label">
              HSN/SAC <span className="qad-req">*</span>
            </label>
            <div>
              <input
                className="qad-input"
                value={data.hsnSac}
                onChange={(e) => set("hsnSac", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter HSN/SAC code"
              />
              <p className="qad-hint">
                You can search code by the description of the category.
              </p>
            </div>
          </div>

          <div className="qad-field">
            <label className="qad-label">
              Default UOM <span className="qad-req">*</span>
            </label>
            <input
              className="qad-input"
              value={data.defaultUOM}
              onChange={(e) => set("defaultUOM", e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter unit of measure"
            />
          </div>

          <div className="qad-check-field">
            <label className="qad-label">Stock</label>
            <div className="qad-check-content">
              <input
                type="checkbox"
                id="maintainStock"
                className="qad-checkbox"
                checked={data.maintainStock}
                onChange={(e) => set("maintainStock", e.target.checked)}
              />
              <div>
                <label htmlFor="maintainStock" className="qad-check-label">
                  Maintain Stock
                </label>
                <p className="qad-hint">
                  ERPNext will make a stock ledger entry for each transaction of this item.
                  Keep unchecked for non-stock or service items.
                </p>
              </div>
            </div>
          </div>

          <div className="qad-check-field">
            <label className="qad-label">Asset</label>
            <div className="qad-check-content">
              <input
                type="checkbox"
                id="isFixedAsset"
                className="qad-checkbox"
                checked={data.isFixedAsset}
                onChange={(e) => set("isFixedAsset", e.target.checked)}
              />
              <div>
                <label htmlFor="isFixedAsset" className="qad-check-label">
                  Is Fixed Asset
                </label>
                <p className="qad-hint">
                  Enable if this item is a company asset like machinery or furniture.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="qad-footer">
          <button
            className="qad-btn-outline"
            onClick={() => onEditFull(data)}
          >
            <FaEdit size={12} />
            Edit Full Form
          </button>
          <button
            className="qad-btn-save"
            onClick={handleSave}
            disabled={!data.itemCode || !data.itemGroup || saving}
          >
            {saving ? (
              <>
                <FaSpinner className="spinning" size={12} />
                Saving...
              </>
            ) : (
              <>
                <FaSave size={12} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}