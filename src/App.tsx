import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";

import ItemGroupForm from "./pages/Setup/Itemgroupform";
import ItemGroupList from "./pages/Setup/Itemgrouplist";
import Itemlist from "./pages/Setup/Itemlist";
// import SalesPage from "./pages/SalesPage";
// import PurchasePage from "./pages/PurchasePage";
// import InventoryPage from "./pages/InventoryPage";


import StockEntry from "./pages/Stockentry";
import StockentryForm from "./pages/Stockentryform";


function App() {
  return (
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



                    
          {/* Item Group Routes */}
          <Route path="/item-group" element={<ItemGroupList />} />
          <Route path="/item-group/:id" element={<ItemGroupForm />} />
          <Route path="/item-list" element={<Itemlist />} />
          

          <Route path="/stock-entry" element={<StockEntry />} />
          <Route path="/stock-entry/new" element={<StockentryForm />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;