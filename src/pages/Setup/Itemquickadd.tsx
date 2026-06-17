import { useState } from "react";
import "./ItemQuickAdd.css";

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
  const [data, setData] = useState<QuickAddData>({
    itemCode: "",
    itemName: "",
    itemGroup: "",
    hsnSac: "",
    defaultUOM: "Nos",
    maintainStock: true,
    isFixedAsset: false,
  });

  const set = (field: keyof QuickAddData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="qad-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="qad-modal">
        {/* Header */}
        <div className="qad-header">
          <span className="qad-title">New Item</span>
          <button className="qad-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="qad-body">
          <div className="qad-field">
            <label className="qad-label">Item Code <span className="qad-req">*</span></label>
            <input className="qad-input" value={data.itemCode} onChange={(e) => set("itemCode", e.target.value)} autoFocus />
          </div>

          <div className="qad-field">
            <label className="qad-label">Item Name</label>
            <input className="qad-input" value={data.itemName} onChange={(e) => set("itemName", e.target.value)} />
          </div>

          <div className="qad-field">
            <label className="qad-label">Item Group <span className="qad-req">*</span></label>
            <input className="qad-input" value={data.itemGroup} onChange={(e) => set("itemGroup", e.target.value)} />
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
    />
    <p className="qad-hint">
      You can search code by the description of the category.
    </p>
  </div>
</div>

          <div className="qad-field">
            <label className="qad-label">Default UOM <span className="qad-req">*</span></label>
            <input className="qad-input" value={data.defaultUOM} onChange={(e) => set("defaultUOM", e.target.value)} />
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
                <label htmlFor="maintainStock" className="qad-check-label">Maintain Stock</label>
                <p className="qad-hint">ERPNext will make a stock ledger entry for each transaction of this item. Keep unchecked for non-stock or service items.</p>
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
                <label htmlFor="isFixedAsset" className="qad-check-label">Is Fixed Asset</label>
                <p className="qad-hint">Enable if this item is a company asset like machinery or furniture.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="qad-footer">
          <button className="qad-btn-outline" onClick={() => onEditFull(data)}>Edit Full Form</button>
          <button
            className="qad-btn-save"
            onClick={() => { onEditFull(data); }}
            disabled={!data.itemCode || !data.itemGroup}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}