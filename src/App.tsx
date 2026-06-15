import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import MainLayout from "./layouts/MainLayout";

import DashboardPage from "./pages/DashboardPage";
// import SalesPage from "./pages/SalesPage";
// import PurchasePage from "./pages/PurchasePage";
// import InventoryPage from "./pages/InventoryPage";


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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;