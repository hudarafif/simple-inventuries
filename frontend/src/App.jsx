// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router"; // Sebaiknya impor dari 'react-router-dom'
import Root from "./components/Root";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout"; // <-- Impor MainLayout
import Login from "./pages/login";
import Register from "./pages/register";

// --- Impor Halaman-Halaman Anda ---
// (Pastikan path impor ini sesuai dengan struktur folder Anda)
import AdminDashboard from "./pages/AdminDashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageUsers from "./pages/ManageUsers";
import KasirDashboard from "./pages/KasirDashboard";
import NewTransaction from "./pages/NewTransaction";
import RiwayatTransaction from "./pages/RiwayatTransaction";

function App() {
  return (
    <Router>
      <Routes>
        {/* === Rute Publik === */}
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === Rute Admin yang Dilindungi === */}
        <Route
          path="/admin" // 1. Path induk adalah '/admin'
          element={
            <ProtectedRoute role="admin">
              {/* 2. Elemennya adalah MainLayout (yang berisi <Outlet />) */}
              <MainLayout /> 
            </ProtectedRoute>
          }
        >
          {/* 3. Rute-rute ini akan di-render di dalam <Outlet /> MainLayout */}
          <Route path="dashboard" element={<AdminDashboard />} /> 
          <Route path="products" element={<ManageProducts />} />
          <Route path="users" element={<ManageUsers />} />
          {/* Tambahkan rute admin lainnya di sini */}
        </Route>

        {/* === Rute Kasir yang Dilindungi === */}
        <Route
          path="/kasir" // 1. Path induk adalah '/kasir'
          element={
            <ProtectedRoute role="kasir">
              {/* 2. Menggunakan layout yang sama */}
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 3. Rute-rute ini akan di-render di dalam <Outlet /> MainLayout */}
          <Route path="dashboard" element={<KasirDashboard />} />
          <Route path="transaction" element={<NewTransaction />} />
          <Route path="history" element={<RiwayatTransaction />} />
          {/* Tambahkan rute kasir lainnya di sini */}
        </Route>

        {/* Opsional: Halaman 404 Not Found */}
        {/* <Route path="*" element={<h2>404: Halaman Tidak Ditemukan</h2>} /> */}

      </Routes>
    </Router>
  );
}

export default App;