import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika perlu
import '../Sidebar.css'; // Kita akan buat CSS-nya

const Sidebar = () => {
  // Ambil data 'user' dan fungsi 'logout' dari context
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    navigate('/login'); // Arahkan ke halaman login
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Inventori App</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Tampilkan link berdasarkan peran (role) */}
          {user && user.role === 'admin' && (
            <>
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/products">Kelola Produk</Link>
              </li>
              <li>
                <Link to="/admin/users">Kelola Pengguna</Link>
              </li>
            </>
          )}

          {user && user.role === 'kasir' && (
            <>
              <li>
                <Link to="/kasir/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/kasir/transaction">Transaksi Baru</Link>
              </li>
              <li>
                <Link to="/kasir/history">Riwayat Transaksi</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p className="sidebar-user">{user?.email || 'Pengguna'}</p>
        <button onClick={handleLogout} className="logout-button">
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;