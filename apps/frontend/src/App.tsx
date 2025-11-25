import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BahanBakuPage } from "./pages/BahanBakuPage";
import { MenuPage } from "./pages/MenuPage";
import { TransaksiPage } from "./pages/TransaksiPage";
import { KonversiBahanPage } from "./pages/KonversiBahanPage";
import { StokLogPage } from "./pages/StokLogPage";
import { KomposisiMenuPage } from "./pages/KomposisiMenuPage";
import { ThemeSettingsPage } from "./pages/ThemeSettingsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useGlobalThemeShortcut } from "./hooks/useGlobalThemeShortcut";

function AppRoutes() {
  const location = useLocation();

  // Enable global theme shortcut (Ctrl + Arrow Right)
  useGlobalThemeShortcut();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bahan-baku"
        element={
          <ProtectedRoute>
            <BahanBakuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <MenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaksi"
        element={
          <ProtectedRoute>
            <TransaksiPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/konversi-bahan"
        element={
          <ProtectedRoute>
            <KonversiBahanPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok-log"
        element={
          <ProtectedRoute>
            <StokLogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/komposisi-menu"
        element={
          <ProtectedRoute>
            <KomposisiMenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/theme-settings"
        element={
          <ProtectedRoute>
            <ThemeSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
