import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import civilBanner from "../assets/civil-banner.png";
import defenceBanner from "../assets/defence-banner.png";

const ICON_LABELS = {
  TNPSC: "TN",
  UPSC: "UP",
  RRB: "RR",
  Agniveer: "AG",
  AFCAT: "AF",
  SSB: "SS"
};

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Civil");
  const [animKey, setAnimKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await API.get("/exams");
        setExams(response.data);
      } catch (err) {
        setError("Failed to load exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
      setAnimKey((prev) => prev + 1);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/exam/${id}`);
  };

  const filteredExams = exams.filter((exam) => exam.category === activeCategory);
  const bannerImage = activeCategory === "Civil" ? civilBanner : defenceBanner;
  const bannerTitle = activeCategory === "Civil"
    ? "Civil Services Examinations"
    : "Defence Services Examinations";
  const bannerDesc = activeCategory === "Civil"
    ? "TNPSC, UPSC & RRB — Latest notifications and updates"
    : "Agniveer, AFCAT & SSB — Latest recruitment updates";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading exam notifications...</div>
      </div>
    );
  }

  if (error) {
    return <div className="alert-message alert-error">{error}</div>;
  }

  return (
    <div>
      <div className="category-toggle-bar" style={{ maxWidth: "100%", padding: 0, marginBottom: "1.25rem" }}>
        <button
          className={`category-btn ${activeCategory === "Civil" ? "active" : ""}`}
          onClick={() => handleCategoryChange("Civil")}
        >
          🏛️ Civil
        </button>
        <button
          className={`category-btn ${activeCategory === "Defence" ? "active" : ""}`}
          onClick={() => handleCategoryChange("Defence")}
        >
          🎖️ Defence
        </button>
      </div>

      <div className="category-banner" key={animKey} style={{ maxWidth: "100%", padding: 0 }}>
        <div className="category-banner-overlay">
          <img src={bannerImage} alt={`${activeCategory} Services Banner`} />
          <div className="banner-text-overlay">
            <h2>{bannerTitle}</h2>
            <p>{bannerDesc}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section section-fade-in" key={`section-${animKey}`} style={{ marginTop: "1.5rem" }}>
        <h2 className="section-title">
          {activeCategory === "Civil" ? "Civil Services" : "Defence Services"}
        </h2>

        {filteredExams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No active notifications found for {activeCategory} services.</p>
          </div>
        ) : (
          <div className="exams-grid">
            {filteredExams.map((exam) => (
              <div key={exam._id} className="exam-card">
                <div className="exam-card-header">
                  <div className={`exam-card-icon ${(exam.subCategory || "").toLowerCase()}`}>
                    {ICON_LABELS[exam.subCategory] || exam.subCategory?.slice(0, 2).toUpperCase() || "EX"}
                  </div>
                  <div>
                    <div className="exam-org">{exam.subCategory || exam.organization}</div>
                    <h3 className="exam-title">{exam.title}</h3>
                  </div>
                </div>
                <div className="exam-card-body"></div>
                <div className="exam-footer">
                  <div className="exam-date">
                    <span className="exam-date-icon">📅</span>
                    {exam.lastDate}
                  </div>
                  <button
                    onClick={() => handleViewDetails(exam._id)}
                    className="btn-view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
