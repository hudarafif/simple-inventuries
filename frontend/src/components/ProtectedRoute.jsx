import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router';

/**
 * Komponen ini melindungi rute berdasarkan status login dan peran (role) pengguna.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Komponen yang akan di-render jika otorisasi berhasil.
 * @param {string} [props.role] - Peran (role) yang diizinkan untuk mengakses rute ini (opsional).
 */
function ProtectedRoute({ children, role }) {
  const { user } = useAuth(); // Dapatkan data pengguna dari AuthContext
  const location = useLocation(); // Dapatkan lokasi saat ini

  // 1. Cek apakah pengguna sudah login
  if (!user) {
    // Jika belum login:
    // Alihkan (redirect) ke halaman login.
    // Kita juga menyimpan lokasi asal (location) yang ingin diakses pengguna.
    // Ini berguna agar setelah login, kita bisa mengarahkan mereka kembali ke halaman
    // yang tadinya ingin mereka buka.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek apakah rute ini butuh peran (role) tertentu
  if (role && user.role !== role) {
    // Jika pengguna sudah login TAPI perannya tidak sesuai:
    // Alihkan (redirect) ke halaman yang tidak diotorisasi.
    // Untuk saat ini, kita alihkan saja ke halaman utama (homepage)
    // atau dashboard mereka yang sesuai.
    // Mengalihkan ke "/" adalah opsi yang aman.
    return <Navigate to="/" replace />;
  }

  // 3. Jika sudah login DAN peran (role) sesuai (atau tidak diperlukan)
  // Tampilkan komponen 'children' yang seharusnya (misal: <MainLayout />)
  return children;
}

export default ProtectedRoute;