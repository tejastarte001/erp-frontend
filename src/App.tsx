import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminThemeProvider } from './admin-theme/AdminThemeContext'; // Add this import

import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ItemGroupForm from "./pages/Setup/Itemgroupform";
import ItemGroupList from "./pages/Setup/Itemgrouplist";
import Itemlist from "./pages/Setup/Itemlist";
import ItemForm from "./pages/Setup/Itemform";
import ItemAttributeList from "./pages/Setup/ItemAttributeList";
import ItemAttributeForm from "./pages/Setup/ItemAttributeForm";
import WarehouseForm from "./pages/Setup/WarehouseForm";
import WarehouseList from "./pages/Setup/WarehouseList";
import BrandForm from "./pages/Setup/BrandForm";
import BrandList from "./pages/Setup/BrandList";
import UOMForm from "./pages/Setup/UOMForm";
import UOMList from "./pages/Setup/UOMList";
import Settings from "./pages/Settings";
import BOMPage from "./pages/BOMPage";
import NewBOMPage from "./pages/Newbompage";
import JobCardManagement from "./pages/JobCardManagement";
import JobCardForm from "./pages/JobCardForm";



function App() {
  return (
    <AdminThemeProvider> {/* Wrap everything with AdminThemeProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />


          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* <Route path="/sales" element={<SalesPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/job-card" element={<JobCardManagement />} />
            <Route path="/job-cards/new" element={<JobCardForm />} />
            {/* Item Group Routes */}
            <Route path="/item-group" element={<ItemGroupList />} />
            <Route path="/item-group/:id" element={<ItemGroupForm />} />
            
            {/* Item Routes */}
            <Route path="/item-list" element={<Itemlist />} />
            <Route path="/item/:id" element={<ItemForm />} />
            
            {/* Item Attribute Routes */}
            <Route path="/item-attribute" element={<ItemAttributeList />} />
            <Route path="/item-attribute/new" element={<ItemAttributeForm />} />
            <Route path="/item-attribute/:id" element={<ItemAttributeForm />} />

            {/* Warehouse Routes */}
            <Route path="/warehouse" element={<WarehouseList />} />
            <Route path="/warehouse/new" element={<WarehouseForm />} />
            <Route path="/warehouse/:id" element={<WarehouseForm />} />

            {/* Brand Routes */}
            <Route path="/brand" element={<BrandList />} />
            <Route path="/brand/new" element={<BrandForm />} />
            <Route path="/brand/:id" element={<BrandForm />} />

            {/* UOM Routes */}
            <Route path="/uom" element={<UOMList />} />
            <Route path="/uom/new" element={<UOMForm />} />
            <Route path="/uom/:id" element={<UOMForm />} />
            
            <Route path="/bom" element={<BOMPage />} />
            <Route path="/bom/new" element={<NewBOMPage />} />


            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminThemeProvider>


  );
}

export default App;