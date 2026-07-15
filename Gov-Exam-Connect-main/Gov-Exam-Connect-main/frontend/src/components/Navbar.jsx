import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">G</div>
        GovExamConnect
      </Link>

      <button
        className="navbar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${mobileOpen ? "mobile-open" : ""}`}>
        {token ? (
          <>
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={closeMobile}
            >
              Home
            </Link>
            <Link
              to="/"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={closeMobile}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={closeMobile}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-link ${isActive("/login") ? "active" : ""}`}
              onClick={closeMobile}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`nav-link ${isActive("/signup") ? "active" : ""}`}
              onClick={closeMobile}
            >
              Signup
            </Link>
          </>
        )}
        <button
          className="btn-theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
