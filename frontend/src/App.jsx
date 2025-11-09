// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./components/Root";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/admin/dashboard" element={<h1>Selamat datang di Admin Dashboard!</h1>} />
        <Route path="/kasir/dashboard" element={<h1>Selamat datang di Dashboard!</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
