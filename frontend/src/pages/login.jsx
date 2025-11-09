import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router";
import "../Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {login } = useAuth();

  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {email, password});
        if (response.data.token){
            await login(response.data.user, response.data.token);
                if (from !== "/") {
                    navigate(from, { replace: true});
                } else {
                  if (response.data.user.role === "admin") {
                    navigate("/admin/dashboard", { replace: true });
                  } else {
                    navigate("/kasir/dashboard", { replace: true });
                  }
                } 
            } else {
                alert(response.data.message || "Email atau password salah.");
        }
    } catch (error) {
        // --- INI PERBAIKANNYA ---
        if (error.response) {
            // Ada respons error dari server (misal: password salah, 401, 404)
            setError(error.response.data.message || "Email atau password salah.");
        } else if (error.request) {
            // Permintaan dikirim tapi tidak ada respons (misal: server mati)
            setError("Server tidak merespons. Silakan coba lagi nanti.");
        } else {
            // Error lain (misal: salah setup request, error jaringan)
            setError("Terjadi kesalahan. Periksa koneksi internet Anda.");
            console.error("Login error:", error.message);
        }
        // ------------------------
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Masuk untuk melanjutkan ke dashboard</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Masukkan email kamu"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="Masukkan password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

            <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
                >
                {loading ? <span className="loading-spinner"></span> : "Masuk"}
            </button>

        </form>

        <p className="login-footer">
          Belum punya akun? <a href="/register" className="login-link">Daftar</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
