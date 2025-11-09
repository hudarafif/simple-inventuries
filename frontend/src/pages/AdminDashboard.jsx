import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika perlu

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Ambil token untuk otorisasi

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ambil URL API dari .env
        const API_URL = import.meta.env.VITE_API_BASE_URL;

        // Panggil API (membutuhkan token otorisasi)
        const response = await axios.get(`${API_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ini penting!
          },
        });
        
        setProducts(response.data); // Simpan data produk ke state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token]); // Jalankan ulang jika token berubah

  // Tampilkan status loading
  if (loading) {
    return <div>Loading produk...</div>;
  }

  // Tampilkan jika ada error
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Tampilkan daftar produk
  return (
    <div>
      <h2>Dashboard Admin: Daftar Produk</h2>
      <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {products.length === 0 ? (
          <p>Belum ada produk.</p>
        ) : (
          products.map((product) => (
            <div 
              key={product._id} 
              style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}
            >
              <h4>{product.name}</h4>
              <p>Harga: Rp {product.price}</p>
              <p>Stok: {product.stock}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;