const Exam = require("../models/Exam");
const SavedExam = require("../models/SavedExam");
const ViewedExam = require("../models/ViewedExam");

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (req.user) {
      await ViewedExam.findOneAndUpdate(
        { user: req.user._id, exam: id },
        { lastViewedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveExam = async (req, res) => {
  const { id } = req.params;

  try {
    const examExists = await Exam.findById(id);
    if (!examExists) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const saved = await SavedExam.findOneAndUpdate(
      { user: req.user._id, exam: id },
      {},
      { upsert: true, new: true }
    );

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unsaveExam = async (req, res) => {
  const { id } = req.params;

  try {
    await SavedExam.findOneAndDelete({ user: req.user._id, exam: id });
    res.json({ message: "Exam removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSavedExams = async (req, res) => {
  try {
    const saved = await SavedExam.find({ user: req.user._id }).populate("exam");
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getViewedExams = async (req, res) => {
  try {
    const viewed = await ViewedExam.find({ user: req.user._id })
      .populate("exam")
      .sort({ lastViewedAt: -1 })
      .limit(10);
    res.json(viewed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExams,
  getExamById,
  saveExam,
  unsaveExam,
  getSavedExams,
  getViewedExams
};
