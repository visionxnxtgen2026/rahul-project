import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchExamAndStatus = async () => {
      try {
        const examRes = await API.get(`/exams/${id}`);
        setExam(examRes.data);

        const savedRes = await API.get("/exams/user/saved");
        const alreadySaved = savedRes.data.some((item) => item.exam._id === id);
        setIsSaved(alreadySaved);
      } catch (err) {
        setError("Failed to fetch exam details. Please verify your login session.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamAndStatus();
  }, [id]);

  const handleSaveToggle = async () => {
    if (saveLoading) return;
    setSaveLoading(true);

    try {
      if (isSaved) {
        await API.delete(`/exams/${id}/unsave`);
        setIsSaved(false);
      } else {
        await API.post(`/exams/${id}/save`);
        setIsSaved(true);
      }
    } catch (err) {
      alert("Error processing bookmark. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading exam details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
        <div className="alert-message alert-error">{error}</div>
        <button onClick={handleBack} className="btn-secondary" style={{ marginTop: "1rem" }}>
          Go Back
        </button>
      </div>
    );
  }

  if (!exam) return null;

  return (
    <div className="details-container">
      <button onClick={handleBack} className="btn-secondary" style={{ marginBottom: "1.5rem" }}>
        ← Back to Dashboard
      </button>

      <div className="details-header">
        <div className="details-org">{exam.organization}</div>
        <h1 className="details-title">{exam.title}</h1>
      </div>

      <div className="details-meta-grid">
        <div className="meta-item">
          <div className="meta-label">Eligibility Criteria</div>
          <div className="meta-value">{exam.eligibility}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Age Limit</div>
          <div className="meta-value">{exam.ageLimit}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Available Vacancies</div>
          <div className="meta-value">{exam.vacancies}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Application Last Date</div>
          <div className="meta-value highlight">{exam.lastDate}</div>
        </div>
      </div>

      <div className="details-description">
        <h3>Exam Description</h3>
        <p>{exam.description}</p>
      </div>

      <div className="details-actions">
        {exam.pdfLink && (
          <a href={exam.pdfLink} target="_blank" rel="noopener noreferrer">
            <button className="btn-secondary">📄 Preview PDF</button>
          </a>
        )}
        {exam.applicationLink && (
          <a href={exam.applicationLink} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary">🔗 Apply Now</button>
          </a>
        )}
        <button
          onClick={handleSaveToggle}
          className={isSaved ? "btn-saved" : "btn-save"}
          disabled={saveLoading}
        >
          {isSaved ? "✓ Saved" : "🔖 Save Exam"}
        </button>
      </div>
    </div>
  );
};

export default ExamDetails;
