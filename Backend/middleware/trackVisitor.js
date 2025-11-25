// middleware/trackVisitor.js
const geoip = require("geoip-lite");
const VisitorData = require("../models/VisitorsData");

const trackVisitor = async (req, res, next) => {
  try {
    let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    if (!ip || ip === "::1" || ip.startsWith("::ffff:127.")) return next();

    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

    const geo = geoip.lookup(ip) || {};
    const visitor = new VisitorData({
      ip,
      country,
      city,
      userAgent: req.headers["user-agent"] || "Unknown",
      path: req.path,
      time: new Date().toISOString,
    });

    // ✅ Save without blocking the request
    visitor.save().catch((err) => console.error("Visitor save error:", err.message));
  } catch (err) {
    console.error("Visitor tracking error:", err.message);
  }

  next();
};

module.exports = trackVisitor;
