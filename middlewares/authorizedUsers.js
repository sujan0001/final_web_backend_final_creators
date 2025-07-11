// const jwt = require("jsonwebtoken")
// const User = require("../models/UserModels")

// exports.authenticateUser = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization 
//         if (!authHeader) {
//             return res.status(403).json(
//                 { "success": false, "message": "Token required" }
//             )
//         }
//         const token = authHeader.split(" ")[1]; 
//         const decoded = jwt.verify(token, process.env.JWT_SECRET) 
//         const userId = decoded._id 
//         const user = await User.findOne({ _id: userId })
//         if (!user) {
//             return res.status(401).json(
//                 { "success": false, "message": "User not found" }
//             )
//         }
//         req.user = user 
//         next() 
//     } catch (err) {
//         return res.status(500).json(
//             { "success": false, "message": "Authentication error" }
//         )
//     }
// }

// exports.isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next()
//     } else {
//         return res.status(403).json(
//             { "success": false, "message": "Access denied, not admin" }
//         )
//     }
// }
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

// Middleware: Authenticate any user (creator, consumer, admin)
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware: Allow only admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Admin only",
  });
};

// Middleware: Allow only creator
exports.isCreator = (req, res, next) => {
  if (req.user && req.user.role === "creator") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Creator only",
  });
};

// Middleware: Allow only consumer
exports.isConsumer = (req, res, next) => {
  if (req.user && req.user.role === "consumer") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Consumer only",
  });
};
