// const jwt = require("jsonwebtoken");
// const User = require("../models/UserModels");
// const Collection = require("../models/CollectionModel"); // example for collection
// const Product = require("../models/ProductModel"); // example for product

// // Middleware: Authenticate any user (creator, consumer, admin)
// exports.authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(403).json({
//         success: false,
//         message: "Authorization token required",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded._id);
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user; // Attach user to request
//     next();
//   } catch (err) {
//     console.error("Auth error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Authentication error",
//     });
//   }
// };

// // Middleware: Allow only admin
// exports.isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Access denied: Admin only",
//   });
// };

// // Middleware: Allow only creator
// exports.isCreator = (req, res, next) => {
//   if (req.user && req.user.role === "creator") {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Access denied: Creator only",
//   });
// };

// // Middleware: Allow only consumer
// exports.isConsumer = (req, res, next) => {
//   if (req.user && req.user.role === "consumer") {
//     return next();
//   }

//   return res.status(403).json({
//     success: false,
//     message: "Access denied: Consumer only",
//   });
// };

// // Middleware: Allow only admin or creator of the resource (Collection example)
// exports.isAdminOrCreatorOfCollection = async (req, res, next) => {
//   try {
//     const collectionId = req.params.id;
//     const collection = await Collection.findById(collectionId);
//     if (!collection) {
//       return res.status(404).json({ success: false, message: "Collection not found" });
//     }

//     if (req.user.role === "admin" || collection.creator.toString() === req.user._id.toString()) {
//       return next();
//     }

//     return res.status(403).json({ success: false, message: "Access denied" });
//   } catch (err) {
//     console.error("Authorization error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Middleware: Allow only admin or creator of the product (Product example)
// exports.isAdminOrCreatorOfProduct = async (req, res, next) => {
//   try {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     if (req.user.role === "admin" || product.creator.toString() === req.user._id.toString()) {
//       return next();
//     }

//     return res.status(403).json({ success: false, message: "Access denied" });
//   } catch (err) {
//     console.error("Authorization error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");
const Collection = require("../models/CollectionModel");
const Product = require("../models/ProductModel");

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

    // Find user and check if soft deleted
    const user = await User.findById(decoded._id);
    if (!user || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deactivated",
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

// Middleware: Allow only admin or creator of the resource (Collection example)
exports.isAdminOrCreatorOfCollection = async (req, res, next) => {
  try {
    const collectionId = req.params.id;
    const collection = await Collection.findById(collectionId);

    if (!collection || collection.isDeleted) {
      return res.status(404).json({ success: false, message: "Collection not found or deleted" });
    }

    if (req.user.role === "admin" || collection.creator.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Middleware: Allow only admin or creator of the product (Product example)
exports.isAdminOrCreatorOfProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product || product.isDeleted) {
      return res.status(404).json({ success: false, message: "Product not found or deleted" });
    }

    if (req.user.role === "admin" || product.creator.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};