const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    organization: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Civil", "Defence"]
    },
    subCategory: {
      type: String,
      required: true,
      enum: ["TNPSC", "UPSC", "RRB", "Agniveer", "AFCAT", "SSB"]
    },
    description: {
      type: String,
      required: true
    },
    eligibility: {
      type: String,
      required: true
    },
    ageLimit: {
      type: String,
      required: true
    },
    vacancies: {
      type: String,
      required: true
    },
    lastDate: {
      type: String,
      required: true
    },
    notificationLink: {
      type: String,
      default: ""
    },
    pdfLink: {
      type: String,
      default: ""
    },
    applicationLink: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
