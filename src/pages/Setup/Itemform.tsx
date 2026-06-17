import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ItemForm.css";

type Tab =
  | "Details"
  | "Accounting"
  | "UOM"
  | "Tax"
  | "Inventory"
  | "Purchasing"
  | "Sales"
  | "Manufacturing"
  | "Quality"
  | "Pricing"
  | "Connections";

const TABS: Tab[] = [
  "Details","Accounting","UOM","Tax","Inventory",
  "Purchasing","Sales","Manufacturing","Quality","Pricing","Connections",
];

interface TableRow { id: string; [key: string]: string }

function makeRow(fields: string[]): TableRow {
  const row: TableRow = { id: Date.now().toString() + Math.random() };
  fields.forEach((f) => (row[f] = ""));
  return row;
}

/* ── Shared sub-components ─────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="itf-section-title">{children}</h3>;
}

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="itf-field">
      <label className="itf-label">
        {label} {required && <span className="itf-req">*</span>}
      </label>
      {children}
      {hint && <p className="itf-hint">{hint}</p>}
    </div>
  );
}

function TextInput({
  value, onChange, readOnly, placeholder,
}: {
  value: string; onChange?: (v: string) => void; readOnly?: boolean; placeholder?: string;
}) {
  return (
    <input
      className="itf-input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder ?? ""}
    />
  );
}

function SelectInput({
  value, onChange, options,
}: {
  value: string; onChange?: (v: string) => void; options: string[];
}) {
  return (
    <select className="itf-select" value={value} onChange={(e) => onChange?.(e.target.value)}>
      <option value=""></option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CheckField({
  id, checked, onChange, label, hint,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div className="itf-check-row">
      <input
        type="checkbox" id={id} className="itf-checkbox"
        checked={checked} onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <label htmlFor={id} className="itf-check-label">{label}</label>
        {hint && <p className="itf-hint">{hint}</p>}
      </div>
    </div>
  );
}

function InlineTable({
  columns, rows, onAddRow, onRemoveRow, renderCell,
}: {
  columns: { key: string; label: string; required?: boolean }[];
  rows: TableRow[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  renderCell: (row: TableRow, col: string, onChange: (v: string) => void) => React.ReactNode;
}) {
  return (
    <>
      <div className="itf-table-block">
        <table className="itf-inline-table">
          <thead>
            <tr>
              <th className="itf-ith itf-ith-check"><input type="checkbox" className="itf-checkbox" /></th>
              <th className="itf-ith itf-ith-no">No.</th>
              {columns.map((c) => (
                <th key={c.key} className="itf-ith">
                  {c.label} {c.required && <span className="itf-req">*</span>}
                </th>
              ))}
              <th className="itf-ith itf-ith-act">
                <SettingsIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length + 3} className="itf-empty-row">No rows</td></tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id} className="itf-itr">
                  <td className="itf-itd"><input type="checkbox" className="itf-checkbox" /></td>
                  <td className="itf-itd itf-itd-no">{i + 1}</td>
                  {columns.map((c) => (
                    <td key={c.key} className="itf-itd">
                      {renderCell(row, c.key, () => {})}
                    </td>
                  ))}
                  <td className="itf-itd">
                    <button className="itf-remove-row" onClick={() => onRemoveRow(row.id)}>×</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="itf-add-row" onClick={onAddRow}>Add row</button>
    </>
  );
}

function CommentsActivity({ itemName }: { itemName: string }) {
  const [comment, setComment] = useState("");
  return (
    <>
      <div className="itf-divider" />
      <section className="itf-section">
        <SectionTitle>Comments</SectionTitle>
        <div className="itf-comment-row">
          <div className="itf-comment-avatar">TT</div>
          <input
            className="itf-comment-input"
            placeholder="Type a reply / comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </section>
      <div className="itf-divider" />
      <section className="itf-section itf-section-activity">
        <div className="itf-activity-header">
          <SectionTitle>Activity</SectionTitle>
          <button className="itf-new-email-btn">+ New Email</button>
        </div>
        <ul className="itf-activity-list">
          <li>You created this · <span className="itf-activity-time">5 hours ago</span></li>
          <li>You last edited this · <span className="itf-activity-time">5 hours ago</span></li>
        </ul>
        <button className="itf-activity-collapse">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      </section>
    </>
  );
}

function SettingsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

/* ── Tab content components ─────────────────────────── */

function DetailsTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          {/* Left */}
          <div className="itf-col">
            <Field label="Item Name">
              <TextInput value={form.itemName} onChange={(v) => s("itemName", v)} />
            </Field>
            <Field label="Item Group" required>
              <TextInput value={form.itemGroup} onChange={(v) => s("itemGroup", v)} />
            </Field>
            <Field label="HSN/SAC" required hint="You can search code by the description of the category.">
              <TextInput value={form.hsnSac} onChange={(v) => s("hsnSac", v)} />
            </Field>
            <Field label="Default Unit of Measure" required>
              <TextInput value={form.defaultUOM} onChange={(v) => s("defaultUOM", v)} />
            </Field>
          </div>
          {/* Right */}
          <div className="itf-col">
            <CheckField id="disabled" checked={form.disabled} onChange={(v) => s("disabled", v)} label="Disabled" />
            <CheckField
              id="maintainStock" checked={form.maintainStock} onChange={(v) => s("maintainStock", v)}
              label="Maintain Stock"
              hint="ERPNext will make a stock ledger entry for each transaction of this item. Keep unchecked for non-stock or service items."
            />
            <CheckField
              id="isFixedAsset" checked={form.isFixedAsset} onChange={(v) => s("isFixedAsset", v)}
              label="Is Fixed Asset"
              hint="Enable if this item is a company asset like machinery or furniture."
            />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Item Attributes</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField id="allowSales" checked={form.allowSales} onChange={(v) => s("allowSales", v)} label="Allow Sales" />
            <CheckField id="allowAltItem" checked={form.allowAltItem} onChange={(v) => s("allowAltItem", v)} label="Allow Alternative Item" />
            <CheckField id="hasVariants" checked={form.hasVariants} onChange={(v) => s("hasVariants", v)} label="Has Variants" />
          </div>
          <div className="itf-col">
            <CheckField id="allowPurchase" checked={form.allowPurchase} onChange={(v) => s("allowPurchase", v)} label="Allow Purchase" />
            <CheckField id="isCustomerProvided" checked={form.isCustomerProvided} onChange={(v) => s("isCustomerProvided", v)} label="Is Customer Provided Item" />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field
              label="Over Delivery/Receipt Allowance (%)"
              hint="Percentage by which over-delivery or over-receipt is allowed against a Sales/Purchase Order for this item. If not set, value from Stock Settings will be used."
            >
              <TextInput value={form.overDelivery} onChange={(v) => s("overDelivery", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field
              label="Over Billing Allowance (%)"
              hint="Percentage by which over-billing is allowed against a Sales/Purchase Order for this item. If not set, value from Accounts Settings will be used."
            >
              <TextInput value={form.overBilling} onChange={(v) => s("overBilling", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />
      <section className="itf-section">
        <button className="itf-collapsible-section">
          <span className="itf-section-title" style={{ margin: 0 }}>Description</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function AccountingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [defaults, setDefaults] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <SectionTitle>Item Defaults</SectionTitle>
        <InlineTable
          columns={[
            { key: "company", label: "Company", required: true },
            { key: "defaultWarehouse", label: "Default Warehouse" },
            { key: "defaultPriceList", label: "Default Price List" },
          ]}
          rows={defaults}
          onAddRow={() => setDefaults([...defaults, makeRow(["company","defaultWarehouse","defaultPriceList"])])}
          onRemoveRow={(id) => setDefaults(defaults.filter((r) => r.id !== id))}
          renderCell={(row, col) => (
            <input className="itf-cell-input" defaultValue={row[col]} />
          )}
        />
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Deferred Accounting</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField
              id="deferredExpense" checked={form.deferredExpense ?? false}
              onChange={(v) => s("deferredExpense", v)} label="Enable Deferred Expense"
              hint="Income from this item will be recognized over a period of months instead of all at once. Eg: annual subscription paid upfront."
            />
          </div>
          <div className="itf-col">
            <CheckField
              id="deferredRevenue" checked={form.deferredRevenue ?? false}
              onChange={(v) => s("deferredRevenue", v)} label="Enable Deferred Revenue"
              hint="Expense for this item will be recognized over a period of months. Eg: prepaid insurance or annual software license"
            />
          </div>
        </div>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function UOMTab({ form }: { form: any }) {
  const [rows, setRows] = useState<TableRow[]>([
    { id: "1", uom: "Nos", conversionFactor: "1" },
  ]);

  return (
    <>
      <section className="itf-section">
        <SectionTitle>UOM Conversion Details</SectionTitle>
        <p className="itf-hint" style={{ marginBottom: 14 }}>
          Define alternate units for this item. Eg: 1 Box = 12 Nos, set conversion factor as 12. (Will also apply for variants){" "}
          <a href="#" className="itf-link">Learn more →</a>
        </p>
        <InlineTable
          columns={[
            { key: "uom", label: "UOM" },
            { key: "conversionFactor", label: "Conversion Factor" },
          ]}
          rows={rows}
          onAddRow={() => setRows([...rows, makeRow(["uom","conversionFactor"])])}
          onRemoveRow={(id) => setRows(rows.filter((r) => r.id !== id))}
          renderCell={(row, col) => (
            <input className="itf-cell-input" defaultValue={row[col]} />
          )}
        />
      </section>
      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function TaxTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [taxes, setTaxes] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <CheckField
          id="ineligibleITC" checked={form.ineligibleITC ?? false}
          onChange={(v) => s("ineligibleITC", v)} label="Is Ineligible for Input Tax Credit"
        />

        <div style={{ marginTop: 20 }}>
          <SectionTitle>Taxes</SectionTitle>
          <p className="itf-hint" style={{ marginBottom: 12 }}>Will also apply for variants</p>
          <InlineTable
            columns={[
              { key: "itemTaxTemplate", label: "Item Tax Template", required: true },
              { key: "taxCategory", label: "Tax Category" },
              { key: "validFrom", label: "Valid From" },
              { key: "minNetRate", label: "Minimum Net Rate" },
              { key: "maxNetRate", label: "Maximum Net Rate" },
            ]}
            rows={taxes}
            onAddRow={() => setTaxes([...taxes, makeRow(["itemTaxTemplate","taxCategory","validFrom","minNetRate","maxNetRate"])])}
            onRemoveRow={(id) => setTaxes(taxes.filter((r) => r.id !== id))}
            renderCell={(row, col) => (
              <input className="itf-cell-input" defaultValue={row[col]} />
            )}
          />
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Purchase Tax Withholding Category">
              <TextInput value={form.purchaseTaxWithholding ?? ""} onChange={(v) => s("purchaseTaxWithholding", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Sales Tax Withholding Category">
              <TextInput value={form.salesTaxWithholding ?? ""} onChange={(v) => s("salesTaxWithholding", v)} />
            </Field>
          </div>
        </div>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function InventoryTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [barcodes, setBarcodes] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <SectionTitle>Stock Levels</SectionTitle>
        <div className="itf-empty-state">No Stock Available Currently</div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Inventory Valuation</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Valuation Method">
              <SelectInput value={form.valuationMethod ?? ""} onChange={(v) => s("valuationMethod", v)} options={["FIFO","Moving Average","LIFO"]} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Valuation Rate">
              <TextInput value={form.valuationRate ?? "0.00"} onChange={(v) => s("valuationRate", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Inventory Settings</SectionTitle>
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="End of Life">
              <TextInput value={form.endOfLife ?? "31-12-2099"} onChange={(v) => s("endOfLife", v)} />
            </Field>
            <Field label="Default Material Request Type">
              <SelectInput value={form.matReqType ?? "Purchase"} onChange={(v) => s("matReqType", v)} options={["Purchase","Manufacture","Transfer","Customer Provided"]} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Warranty Period (in days)">
              <TextInput value={form.warrantyPeriod ?? ""} onChange={(v) => s("warrantyPeriod", v)} />
            </Field>
            <Field label="Weight Per Unit">
              <TextInput value={form.weightPerUnit ?? "0.000"} onChange={(v) => s("weightPerUnit", v)} />
            </Field>
            <Field label="Weight UOM">
              <TextInput value={form.weightUOM ?? ""} onChange={(v) => s("weightUOM", v)} />
            </Field>
            <CheckField
              id="allowNegStock" checked={form.allowNegStock ?? false}
              onChange={(v) => s("allowNegStock", v)} label="Allow Negative Stock"
              hint="Allow stock to go below zero for this item, even if negative stock is disabled in Stock Settings."
            />
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Barcodes</SectionTitle>
        <Field label="Barcodes">
          <InlineTable
            columns={[
              { key: "barcode", label: "Barcode", required: true },
              { key: "barcodeType", label: "Barcode Type" },
              { key: "uom", label: "UOM" },
            ]}
            rows={barcodes}
            onAddRow={() => setBarcodes([...barcodes, makeRow(["barcode","barcodeType","uom"])])}
            onRemoveRow={(id) => setBarcodes(barcodes.filter((r) => r.id !== id))}
            renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
          />
        </Field>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <button className="itf-collapsible-section">
          <span className="itf-section-title" style={{ margin: 0 }}>Auto re-order</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <button className="itf-collapsible-section">
          <span className="itf-section-title" style={{ margin: 0 }}>Serial Nos / Batches</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function PurchasingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [suppliers, setSuppliers] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Default Purchase Unit of Measure">
              <TextInput value={form.purchaseUOM ?? ""} onChange={(v) => s("purchaseUOM", v)} />
            </Field>
            <Field label="Minimum Order Qty" hint="Minimum quantity should be as per Stock UOM">
              <TextInput value={form.minOrderQty ?? "0.000"} onChange={(v) => s("minOrderQty", v)} />
            </Field>
            <Field
              label="Safety Stock"
              hint="Minimum stock level to maintain as a buffer. Used to calculate recommended reorder level: Reorder Level = Safety Stock + (Average Daily Consumption × Lead Time)."
            >
              <TextInput value={form.safetyStock ?? "0.000"} onChange={(v) => s("safetyStock", v)} />
            </Field>
          </div>
          <div className="itf-col">
            <Field label="Lead Time in days" hint="Average time taken by the supplier to deliver">
              <TextInput value={form.leadTime ?? "0"} onChange={(v) => s("leadTime", v)} />
            </Field>
            <Field label="Last Purchase Rate" hint="The rate at which this item was last purchased via a Purchase Invoice. Auto-updated by the system.">
              <TextInput value={form.lastPurchaseRate ?? "0"} onChange={(v) => s("lastPurchaseRate", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Supplier Details</SectionTitle>
        <CheckField
          id="dropShip" checked={form.dropShip ?? false}
          onChange={(v) => s("dropShip", v)} label="Delivered by Supplier (Drop Ship)"
          hint="Enable for drop shipping - supplier delivers directly to the customer without passing through your warehouse."
        />
        <div style={{ marginTop: 16 }}>
          <Field label="Item Supplier">
            <InlineTable
              columns={[
                { key: "supplier", label: "Supplier", required: true },
                { key: "supplierPartNumber", label: "Supplier Part Number" },
              ]}
              rows={suppliers}
              onAddRow={() => setSuppliers([...suppliers, makeRow(["supplier","supplierPartNumber"])])}
              onRemoveRow={(id) => setSuppliers(suppliers.filter((r) => r.id !== id))}
              renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
            />
          </Field>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <button className="itf-collapsible-section">
          <span className="itf-section-title" style={{ margin: 0 }}>Foreign Trade Details</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function SalesTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const [customers, setCustomers] = useState<TableRow[]>([]);
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <Field label="Default Sales Unit of Measure">
              <TextInput value={form.salesUOM ?? ""} onChange={(v) => s("salesUOM", v)} />
            </Field>
            <CheckField
              id="grantCommission" checked={form.grantCommission ?? true}
              onChange={(v) => s("grantCommission", v)} label="Grant Commission"
            />
          </div>
          <div className="itf-col">
            <Field
              label="Max Discount (%)"
              hint="Maximum discount % allowed when selling this item. Eg: if set to 20%, a discount greater than 20% cannot be applied in sales transactions."
            >
              <TextInput value={form.maxDiscount ?? "0.000"} onChange={(v) => s("maxDiscount", v)} />
            </Field>
          </div>
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <SectionTitle>Customer Details</SectionTitle>
        <Field label="Customer Items">
          <InlineTable
            columns={[
              { key: "customerName", label: "Customer Name" },
              { key: "customerGroup", label: "Customer Group" },
              { key: "refCode", label: "Ref Code", required: true },
            ]}
            rows={customers}
            onAddRow={() => setCustomers([...customers, makeRow(["customerName","customerGroup","refCode"])])}
            onRemoveRow={(id) => setCustomers(customers.filter((r) => r.id !== id))}
            renderCell={(row, col) => <input className="itf-cell-input" defaultValue={row[col]} />}
          />
        </Field>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function ManufacturingTab({ form, setForm }: { form: any; setForm: (f: any) => void }) {
  const s = (k: string, v: any) => setForm({ ...form, [k]: v });
  return (
    <>
      <section className="itf-section">
        <div className="itf-two-col">
          <div className="itf-col">
            <CheckField
              id="includeInMfg" checked={form.includeInMfg ?? true}
              onChange={(v) => s("includeInMfg", v)} label="Include Item In Manufacturing"
              hint="Enable for raw material items used in BOM. Uncheck for additional services like 'washing' used in manufacturing."
            />
            <CheckField
              id="isSubcontracted" checked={form.isSubcontracted ?? false}
              onChange={(v) => s("isSubcontracted", v)} label="Is Subcontracted Item"
              hint="Enable if a vendor manufactures this item for you. You can choose to provide them raw materials using the default BOM."
            />
          </div>
          <div className="itf-col">
            <Field label="Production Capacity">
              <TextInput value={form.productionCapacity ?? "0"} onChange={(v) => s("productionCapacity", v)} />
            </Field>
          </div>
        </div>
      </section>
      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function QualityTab({ form }: { form: any }) {
  return (
    <>
      <section className="itf-section">
        <SectionTitle>Quality</SectionTitle>
        <div className="itf-empty-state">No quality inspection templates configured.</div>
      </section>
      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function PricingTab({ form }: { form: any }) {
  return (
    <>
      <section className="itf-section">
        <SectionTitle>Item Prices</SectionTitle>
        <p className="itf-hint" style={{ marginBottom: 16 }}>All active prices for this item across buying and selling price lists.</p>
        <div className="itf-empty-box">
          <p className="itf-empty-box-text">No active item prices found.</p>
          <button className="itf-add-price-btn">+ Add Price</button>
        </div>
      </section>
      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

function ConnectionsTab({ form }: { form: any }) {
  const groups = [
    { label: "Groups", items: ["BOM", "Product Bundle", "Item Alternative"] },
    { label: "Pricing", items: ["Item Price", "Pricing Rule"] },
    { label: "Sell", items: ["Quotation", "Sales Order", "Delivery Note", "Sales Invoice"] },
  ];
  const groups2 = [
    { label: "Buy", items: ["Material Request", "Supplier Quotation", "Request for Quotation", "Purchase Order", "Purchase Receipt", "Purchase Invoice"] },
    { label: "Manufacture", items: ["Production Plan", "Work Order", "Item Manufacturer"] },
    { label: "Traceability", items: ["Serial No", "Batch"] },
  ];
  const stockMovement = ["Stock Entry", "Stock Reconciliation"];
  const leadTime = ["Item Lead Time"];

  return (
    <>
      <section className="itf-section">
        <div className="itf-conn-activity-header">
          <span className="itf-section-title" style={{ margin: 0 }}>Activity</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </div>
        <div className="itf-heatmap">
          {["JUN","JUL","AUG","SEP","OCT","NOV","DEC","JAN","FEB","MAR","APR","MAY","JUN"].map((m) => (
            <div key={m} className="itf-heatmap-col">
              <div className="itf-heatmap-month">{m}</div>
              {["Mon","","Wed","","Fri"].map((d, i) => (
                <div key={i} className="itf-heatmap-row">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="itf-heatmap-cell" />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="itf-hint" style={{ marginTop: 8 }}>This is based on stock movement. See Stock Ledger for details</p>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          {groups.map((g) => (
            <div key={g.label} className="itf-conn-group">
              <div className="itf-conn-group-title">{g.label}</div>
              {g.items.map((item) => (
                <div key={item} className="itf-conn-item">
                  <span>{item}</span>
                  <button className="itf-conn-add">+</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          {groups2.map((g) => (
            <div key={g.label} className="itf-conn-group">
              <div className="itf-conn-group-title">{g.label}</div>
              {g.items.map((item) => (
                <div key={item} className="itf-conn-item">
                  <span>{item}</span>
                  <button className="itf-conn-add">+</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="itf-divider" />

      <section className="itf-section">
        <div className="itf-conn-groups">
          <div className="itf-conn-group">
            <div className="itf-conn-group-title">Stock Movement</div>
            {stockMovement.map((item) => (
              <div key={item} className="itf-conn-item">
                <span>{item}</span>
                <button className="itf-conn-add">+</button>
              </div>
            ))}
          </div>
          <div className="itf-conn-group">
            <div className="itf-conn-group-title">Lead Time</div>
            {leadTime.map((item) => (
              <div key={item} className="itf-conn-item">
                <span>{item}</span>
                <button className="itf-conn-add">+</button>
              </div>
            ))}
          </div>
          <div className="itf-conn-group" />
        </div>
      </section>

      <CommentsActivity itemName={form.itemName} />
    </>
  );
}

/* ── Main Component ─────────────────────────── */

export default function ItemForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const itemId = isNew ? "" : decodeURIComponent(id ?? "");

  const [activeTab, setActiveTab] = useState<Tab>("Details");
  const [isDirty, setIsDirty] = useState(isNew);

  const [form, setFormRaw] = useState({
    itemName: isNew ? "" : itemId,
    itemCode: isNew ? "" : "Door3",
    itemGroup: isNew ? "" : "Products",
    hsnSac: isNew ? "" : "010130",
    defaultUOM: "Nos",
    disabled: false,
    maintainStock: true,
    isFixedAsset: false,
    allowSales: true,
    allowPurchase: true,
    allowAltItem: false,
    isCustomerProvided: false,
    hasVariants: false,
    overDelivery: "0.000",
    overBilling: "0.000",
    grantCommission: true,
    includeInMfg: true,
    isSubcontracted: false,
    productionCapacity: "0",
  });

  const setForm = (f: any) => { setFormRaw(f); setIsDirty(true); };

  const tabProps = { form, setForm };

  const renderTab = () => {
    switch (activeTab) {
      case "Details":      return <DetailsTab {...tabProps} />;
      case "Accounting":   return <AccountingTab {...tabProps} />;
      case "UOM":          return <UOMTab {...tabProps} />;
      case "Tax":          return <TaxTab {...tabProps} />;
      case "Inventory":    return <InventoryTab {...tabProps} />;
      case "Purchasing":   return <PurchasingTab {...tabProps} />;
      case "Sales":        return <SalesTab {...tabProps} />;
      case "Manufacturing":return <ManufacturingTab {...tabProps} />;
      case "Quality":      return <QualityTab {...tabProps} />;
      case "Pricing":      return <PricingTab {...tabProps} />;
      case "Connections":  return <ConnectionsTab {...tabProps} />;
    }
  };

  return (
    <div className="itf-page">
      {/* Top bar */}
      <div className="itf-topbar">
        <div className="itf-breadcrumb">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-link" onClick={() => navigate("/item-list")}>Stock</span>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-link" onClick={() => navigate("/item-list")}>Item</span>
          <span className="itf-bc-sep">/</span>
          <span className="itf-bc-current">{isNew ? "New Item" : form.itemName}</span>
          {!isNew && <span className="itf-status-pill enabled">Enabled</span>}
        </div>
        <div className="itf-topbar-right">
          {!isNew && (
            <>
              <button className="itf-btn-outline">View
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="itf-btn-outline">Duplicate</button>
              <button className="itf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="itf-btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="itf-btn-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </button>
            </>
          )}
          <button className="itf-btn-save" onClick={() => setIsDirty(false)}>Save</button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="itf-tab-bar">
        <div className="itf-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`itf-tab ${activeTab === t ? "itf-tab-active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Right sidebar icons */}
        <div className="itf-tab-bar-actions">
          <button className="itf-btn-icon" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button className="itf-btn-icon" title="Print"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg></button>
          <button className="itf-btn-icon" title="Favourite"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
      </div>

      {/* Body */}
      <div className="itf-body">
        {/* Main scroll */}
        <div className="itf-main">
          {renderTab()}
        </div>

        {/* Right sidebar */}
        {!isNew && (
          <aside className="itf-sidebar">
            <div className="itf-doc-avatar">{form.itemName.charAt(0).toUpperCase()}</div>
            <div className="itf-doc-name">{form.itemName}</div>
            <div className="itf-doc-id">{form.itemCode}</div>

            <div className="itf-sidebar-actions">
              {[
                { icon: "assign", label: "Assign" },
                { icon: "attach", label: "Attachments" },
                { icon: "tag", label: "Tags" },
                { icon: "share", label: "Share" },
              ].map(({ label }) => (
                <button key={label} className="itf-sidebar-action">
                  <SidebarIcon label={label} />
                  {label}
                  <span className="itf-sidebar-plus">+</span>
                </button>
              ))}
            </div>

            <div className="itf-sidebar-meta">
              <div className="itf-meta-row"><span className="itf-meta-label">Last Edited By</span><span className="itf-meta-val">You</span></div>
              <div className="itf-meta-time">5 hours ago</div>
              <div className="itf-meta-row" style={{ marginTop: 12 }}><span className="itf-meta-label">Created By</span><span className="itf-meta-val">You</span></div>
              <div className="itf-meta-time">5 hours ago</div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function SidebarIcon({ label }: { label: string }) {
  const icons: Record<string, React.ReactNode> = {
    Assign: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Attachments: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
    Tags: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    Share: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  };
  return <>{icons[label]}</>;
}