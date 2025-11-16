import React, { useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // console.log("TOKEN YANG DIGUNAKAN DI MANAGEUSERS:", token);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const fecthUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${API_URL}/api/users`, config);
            setUsers(response.data);
            setLoading(false);
        }catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthUsers();
    }, [token]);

    const handleDelete = async (id) => {
        if (window.confirm('apakah anda yakin ingin menghapus user ini?')) {
            try {
                const config = {
                    header: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.delete(`${API_URL}/api/users/${id}`, config);
                fecthUsers();
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div style={{ color:'red' }}>{error}</div>;

    return (
        <div>
      <h2>Kelola Pengguna</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Peran (Role)</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user._id}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.username}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {/* Tambahkan tombol hapus */}
                <button 
                  onClick={() => handleDelete(user._id)} 
                  style={{ backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                  disabled={user.role === 'admin'} // Nonaktifkan tombol jika user adalah admin
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers