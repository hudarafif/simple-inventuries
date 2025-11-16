import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import "./ManageProducts.css";

const ManageProducts = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const { token } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        price: '',
        stock: '',
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const fecthProducts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Panggil API (membutuhkan token otorisasi)
        const response = await axios.get(`${API_URL}/api/products`, config);
        setProducts(response.data); // Simpan data produk ke state
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    useEffect(() => {
      fecthProducts();
    }, [token]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const openModal = (product = null) => {
        if (product) {
            setEditingId(product._id);
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                price: '',
                stock: '',
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            name: '',
            price: '',
            stock: '',
        });
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log(formData);
        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/products/${editingId}`, formData, config);
            }else {
                await axios.post(`${API_URL}/api/products`, formData, config);
            }
            closeModal();
            fecthProducts();
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('apakah anda yakin ingin menghapus produk ini?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_URL}/api/products/${id}`, config);
                fecthProducts();
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
      <h2>Kelola Produk</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}
      <button onClick={() => openModal()} className="add-btn">
        + Tambah Produk Baru
      </button>

      {/* Tabel Produk */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Nama</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Harga (Rp)</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Stok</th>
            <th style={{ justifyContent: 'center', padding: '8px', border: '1px solid #ddd' }}>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.name}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.price.toLocaleString('id-ID')}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.stock}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <button onClick={() => openModal(product)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="delete-btn">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form (Create/Edit) */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <form onSubmit={handleFormSubmit}>
              <h2>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <div className="form-group">
                <label htmlFor="name">Nama Produk</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Harga (Rp)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Stok</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">Batal</button>
                <button type="submit" className="save-btn">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    )
};

export default ManageProducts;