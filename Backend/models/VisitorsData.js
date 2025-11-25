const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  ip: String,
  country: String,
  city: String,
  userAgent: String,
  path: String,
  time: String,
  loginSuccess: { type: Boolean, default: false }, // ✅ new field
});

module.exports = mongoose.model("VisitorData", VisitorSchema);