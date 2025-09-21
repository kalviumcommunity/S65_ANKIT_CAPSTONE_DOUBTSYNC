const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentSocketId: {
    type: String,
    required: true,
  },

  
  question: { type: String, required: true },
  subject: { type: String, required: true },
  matchedTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },


  status: {
    type: String,
    enum: ["pending", "matched", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },




  isAssigned: { type: Boolean, default: false },
});

module.exports = mongoose.model("Doubt", doubtSchema, "doubts");
