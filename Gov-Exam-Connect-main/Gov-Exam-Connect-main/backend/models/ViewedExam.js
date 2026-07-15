const mongoose = require("mongoose");

const viewedExamSchema = new mongoose.Schema(
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
    },
    lastViewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

viewedExamSchema.index({ user: 1, exam: 1 }, { unique: true });

const ViewedExam = mongoose.model("ViewedExam", viewedExamSchema);

module.exports = ViewedExam;
