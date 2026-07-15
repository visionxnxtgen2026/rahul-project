const mongoose = require("mongoose");

const savedExamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    }
  },
  {
    timestamps: true
  }
);

savedExamSchema.index({ user: 1, exam: 1 }, { unique: true });

const SavedExam = mongoose.model("SavedExam", savedExamSchema);

module.exports = SavedExam;
