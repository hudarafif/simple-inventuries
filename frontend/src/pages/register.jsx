import React, { useState } from "react";
import axios from "axios";
import "../Register.css"; // Import style eksternal

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "kasir",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        formData
      );

      setMessage(res.data.message || "Register success!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Register failed!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Account 🪪</h2>
        <p className="register-subtitle">Isi data kamu untuk mendaftar</p>

        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="role" className="input-label">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="register-button">Daftar</button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="register-footer">
          Sudah punya akun? <a href="/login" className="register-link">Login di sini</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
