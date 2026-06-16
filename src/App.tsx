import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import StockEntry from "./pages/Stockentry";
import StockentryForm from "./pages/StockentryForm";
import BOMPage from "./pages/BOMPage";
import NewBOMPage from "./pages/Newbompage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stock-entry" element={<StockEntry />} />
          <Route path="/stock-entry/new" element={<StockentryForm />} />
          <Route path="/bom" element={<BOMPage />} />
          <Route path="/bom/new" element={<NewBOMPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;