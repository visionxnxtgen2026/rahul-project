const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getExams,
  getExamById,
  saveExam,
  unsaveExam,
  getSavedExams,
  getViewedExams
} = require("../controllers/examController");

const router = express.Router();

router.get("/", getExams);
router.get("/user/saved", protect, getSavedExams);
router.get("/user/viewed", protect, getViewedExams);
router.get("/:id", protect, getExamById);
router.post("/:id/save", protect, saveExam);
router.delete("/:id/unsave", protect, unsaveExam);

module.exports = router;
