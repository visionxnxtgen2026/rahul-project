import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Welcome Back</h2>
      {error && <div className="alert-message alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn-submit">
          Sign In
        </button>
      </form>
      <div className="auth-switch">
        Don't have an account? <Link to="/signup">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
