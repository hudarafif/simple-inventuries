import React, {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const KasirDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchItem, setSearchItem] = useState('');

    const { token } = useAuth(); // Ambil token untuk otorisasi
    // Ambil URL API dari .env
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    
      useEffect(() => {
        // setLoading(true);
        const fetchProducts = async () => {
          try {
            // Panggil API (membutuhkan token otorisasi)
            const response = await axios.get(`${API_URL}/api/products`, {
              headers: {
                Authorization: `Bearer ${token}`, // Ini penting!
              },
              params: {
                search: searchItem,
              }
            });
            
            setProducts(response.data); // Simpan data produk ke state
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        };
    
        if (token) {
          const delayDebounceFn = setTimeout(() => {
            fetchProducts();
          }, 500);
    
          return () => clearTimeout(delayDebounceFn);
        }
      }, [token, searchItem, API_URL]); // Jalankan ulang jika token berubah
    
      // Tampilkan status loading
      if (loading) {
        return <div>Loading produk...</div>;
      }
    
      // Tampilkan jika ada error
      if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
      }
    return(
        <>
        <h2>Kasir Dashboard: Daftar Product</h2>
        <input 
        type="text"
        placeholder= "Cari Produk"
        style={{ width: '100%', padding: '10px', margin: '20px 0', boxSizing: 'border-box' }}
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        />
          <div className="product-list" style={{ display: 'flex', gap: '16px'  }}>
                    {products.length === 0 ? (
                        <p>belum ada produk</p>
                    ) : (
                        products.map((product) => (
                            <div key={product._id}
                            style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
                                <h4>{product.name}</h4>
                                <p>Harga: Rp {product.price}</p>
                                <p>Stock: {product.stock}</p>
                            </div>
                        ))
                    )}
          </div>
        </>
    ); 
};

export default KasirDashboard;