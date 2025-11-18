import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './KasirDashboard.css'; // <-- Kita akan tambahkan file CSS baru ini

const KasirDashboard = () => {
  // State untuk produk dan pencarian
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE BARU UNTUK KERANJANG ---
  const [cartItems, setCartItems] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm },
      };
      const response = await axios.get(`${API_URL}/api/products`, config);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    } 
  }, [token, searchTerm, API_URL]);
  // --- 1. FUNGSI FETCH PRODUK (Sudah ada) ---
    useEffect(() => {
      if (token) {
        const delayDebounceFn = setTimeout(() => {
          fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
      }
    }, [fetchProducts, token]); 

  // --- 2. LOGIKA KERANJANG ---

  const handleAddToCart = (product) => {
    // Panggil fungsi update qty dengan qty baru = 1
    handleUpdateQty(product, 1, true); // 'true' berarti ini adalah penambahan baru
  };

  const handleUpdateQty = (product, newQty, isAddingNew = false) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Jika item sudah ada, update jumlahnya
        const totalQty = isAddingNew ? existingItem.qty + 1 : newQty;

        if (totalQty > product.stock) {
          alert('Stok tidak mencukupi!');
          return prevCart;
        }
        
        // Jika qty jadi 0 atau kurang, hapus item
        if (totalQty <= 0) {
          return prevCart.filter((item) => item._id !== product._id);
        }

        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: totalQty } : item
        );
      } else if (isAddingNew) {
        // Jika item baru dan stok ada
        if (product.stock < 1) {
          alert('Stok habis!');
          return prevCart;
        }
        return [...prevCart, { ...product, qty: 1 }];
      }
      
      return prevCart; // Seharusnya tidak sampai sini, tapi untuk keamanan
    });
  };

  const handleRemoveFromCart = (product) => {
    setCartItems((prevCart) =>
      prevCart.filter((item) => item._id !== product._id)
    );
  };

  // --- 3. LOGIKA KALKULASI TOTAL ---
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  // --- 4. FUNGSI CHECKOUT (Masih Kosong) ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    // Setelah berhasil checkout (nanti):
    setCheckoutLoading(true);
    setError(null);
    try {
      const transactionData = {
        cartItems: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price
        })),
        totalPrice: totalPrice
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
      };
      await axios.post(`${API_URL}/api/transactions`, transactionData, config);
      alert('Checkout berhasil disiram!');
      // setCartItems([]); // Kosongkan keranjang
      setCartItems([]); 
      // fetchProducts(); // Refresh stok produk
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setError(errorMessage);
    } finally {
      setCheckoutLoading(false);
    }
    
  };

  // --- 5. TAMPILAN (UI) ---
  return (
    <div className="kasir-layout">
      {/* Kolom Kiri: Daftar Produk */}
      <div className="product-list-container">
        <h2>Daftar Produk</h2>
        <input
          type="text"
          placeholder="Cari produk..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && <div>Loading produk...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        
        <div className="product-grid">
          {!loading && products.length === 0 ? (
            <p>Produk tidak ditemukan.</p>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                <h4>{product.name}</h4>
                <p>Harga: Rp {product.price.toLocaleString('id-ID')}</p>
                <p>Stok: {product.stock}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="add-to-cart-btn"
                >
                  {product.stock === 0 ? 'Stok Habis' : 'Tambah'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kolom Kanan: Keranjang (Cart) */}
      <div className="cart-container">
        <h2>Keranjang</h2>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Keranjang kosong.</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-info">
                  <strong>{item.name}</strong>
                  <span>Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => handleUpdateQty(item, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => handleUpdateQty(item, item.qty + 1)}>+</button>
                  <button onClick={() => handleRemoveFromCart(item)} className="remove-btn">X</button>
                </div>
                <div className="cart-item-subtotal">
                  Subtotal: Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <h3>Total: Rp {totalPrice.toLocaleString('id-ID')}</h3>
          <button 
            onClick={handleCheckout} 
            className="checkout-btn"
            disabled={cartItems.length === 0 || checkoutLoading}
          >
            {checkoutLoading ? 'Loading...' : 'Bayar (Checkout)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KasirDashboard;