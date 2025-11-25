const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const geoip = require("geoip-lite");
const VisitorData = require("../models/VisitorsData");

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { password } = req.body;

  // ✅ Extract real client IP
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip.includes(",")) ip = ip.split(",")[0].trim();
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  // ✅ Replace local/internal IPs with a fallback for testing
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    console.log("🔧 Local/internal IP detected, using fallback 8.8.8.8");
    ip = "8.8.8.8";
  }

  let country = "Unknown";
  let city = "Unknown";
  let loginSuccess = false;
  let token = null;

  try {
    // ✅ Get location info using geoip-lite
    const geo = geoip.lookup(ip);
    if (geo) {
      country = geo.country || "Unknown";
      city = geo.city || "Unknown";
    } else {
      console.warn(`🌐 No geo data found for IP: ${ip}`);
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, process.env.PASSWORD);

    if (!isMatch) {
      loginSuccess = false;

      await VisitorData.create({
        ip,
        country,
        city,
        userAgent: req.headers["user-agent"],
        path: "/auth/login",
        time: new Date(),
        loginSuccess: false,
      });

      return res.status(401).json({ success: false, message: "Invalid password entered" });
    }

    // ✅ Login successful
    loginSuccess = true;
    token = jwt.sign({}, process.env.SECRET);

    await VisitorData.create({
      ip,
      country,
      city,
      userAgent: req.headers["user-agent"],
      path: "/auth/login",
      time: new Date(),
      loginSuccess: true,
    });

    return res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Login route error:", err.message);

    await VisitorData.create({
      ip,
      country,
      city,
      userAgent: req.headers["user-agent"],
      path: "/auth/login",
      time: new Date(),
      loginSuccess: false,
    });

    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
