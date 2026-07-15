import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const Profile = () => {
  const navigate = useNavigate();
  const [savedExams, setSavedExams] = useState([]);
  const [viewedExams, setViewedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "User", email: "" };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedRes = await API.get("/exams/user/saved");
        setSavedExams(savedRes.data);

        const viewedRes = await API.get("/exams/user/viewed");
        setViewedExams(viewedRes.data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-avatar">{getInitial(user.name)}</div>
        <h2 className="profile-name">{user.name}</h2>
        <div className="profile-email">{user.email}</div>
        <button onClick={handleLogout} className="btn-logout" style={{ width: "100%" }}>
          Logout Account
        </button>
      </div>

      <div className="profile-content">
        <div>
          <h2 className="section-title">Saved Exams</h2>
          {error && <div className="alert-message alert-error">{error}</div>}
          {savedExams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔖</div>
              <p>You haven't saved any exams yet.</p>
            </div>
          ) : (
            <div className="exams-grid">
              {savedExams.map((item) => (
                <div key={item._id} className="exam-card">
                  <div className="exam-card-header">
                    <div className={`exam-card-icon ${(item.exam.subCategory || "").toLowerCase()}`}>
                      {item.exam.subCategory?.slice(0, 2).toUpperCase() || "EX"}
                    </div>
                    <div>
                      <div className="exam-org">{item.exam.subCategory}</div>
                      <h3 className="exam-title">{item.exam.title}</h3>
                    </div>
                  </div>
                  <div className="exam-card-body"></div>
                  <div className="exam-footer">
                    <div className="exam-date">
                      <span className="exam-date-icon">📅</span>
                      {item.exam.lastDate}
                    </div>
                    <Link to={`/exam/${item.exam._id}`}>
                      <button className="btn-view-details">Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="section-title">Recently Viewed</h2>
          {viewedExams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👁️</div>
              <p>No recent viewing history found.</p>
            </div>
          ) : (
            <div className="exams-grid">
              {viewedExams.map((item) => (
                <div key={item._id} className="exam-card">
                  <div className="exam-card-header">
                    <div className={`exam-card-icon ${(item.exam.subCategory || "").toLowerCase()}`}>
                      {item.exam.subCategory?.slice(0, 2).toUpperCase() || "EX"}
                    </div>
                    <div>
                      <div className="exam-org">{item.exam.subCategory}</div>
                      <h3 className="exam-title">{item.exam.title}</h3>
                    </div>
                  </div>
                  <div className="exam-card-body"></div>
                  <div className="exam-footer">
                    <div className="exam-date">
                      <span className="exam-date-icon">📅</span>
                      {item.exam.lastDate}
                    </div>
                    <Link to={`/exam/${item.exam._id}`}>
                      <button className="btn-view-details">Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
