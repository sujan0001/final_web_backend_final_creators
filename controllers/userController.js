// const User = require("../models/UserModels");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

// // ===== REGISTER USER =====
// exports.registerUser = async (req, res) => {
//     const { email, firstName, lastName, password, role } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing required fields",
//         });
//     }

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             email,
//             firstName,
//             lastName,
//             password: hashedPassword,
//             role: role || "consumer", // default to "consumer"
//         });

//         await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: "User registered successfully",
//         });
//     } catch (err) {
//         console.error("Register error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };

// // ===== LOGIN USER =====
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing email or password",
//         });
//     }

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(403).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid credentials",
//             });
//         }

//         const payload = {
//             _id: user._id,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             role: user.role,
//         };

//         const token = jwt.sign(payload, process.env.JWT_SECRET, {
//             expiresIn: "7d",
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: payload,
//         });
//     } catch (err) {
//         console.error("Login error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };

// // ===== RESET PASSWORD: SEND EMAIL LINK =====
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // sending reset link to gmail
// exports.sendResetLink = async (req, res) => {
//     const { email } = req.body;
//     console.log("Incoming reset request for:", email); // 🔍 ADD THIS

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ success: false, message: "User not found" });

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "20m" });
//         const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

//         const mailOptions = {
//             from: `"CreatorMarket" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Reset Your Password",
//             html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Email error:", err);
//                 return res.status(500).json({ success: false, message: "Failed to send email" });
//             }

//             return res.status(200).json({ success: true, message: "Reset email sent" });
//         });
//     } catch (err) {
//         console.error("Reset link error:", err);
//         return res.status(500).json({ success: false, message: "Server error" });
//     }
// };

// // ===== RESET PASSWORD: UPDATE PASSWORD =====
// exports.resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

//         return res.status(200).json({
//             success: true,
//             message: "Password updated successfully",
//         });
//     } catch (err) {
//         console.error("Reset password error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Invalid or expired token",
//         });
//     }
// };
// new feature add------------------------------------------------------------
const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ===== REGISTER USER =====
exports.registerUser = async (req, res) => {
  const { email, firstName, lastName, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    // Check if user with email exists AND is not soft-deleted
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isDeleted) {
        return res.status(400).json({
          success: false,
          message: "Account with this email was deactivated. Contact support to reactivate.",
        });
      }
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: role || "consumer", // default to "consumer"
      isDeleted: false, // ensure default value if added to schema
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===== LOGIN USER =====
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing email or password",
    });
  }

  try {
    // Find user and block if soft-deleted
    const user = await User.findOne({ email });
    if (!user || user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "User not found or account deactivated",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===== RESET PASSWORD: SEND EMAIL LINK =====
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// sending reset link to gmail
exports.sendResetLink = async (req, res) => {
  const { email } = req.body;
  console.log("Incoming reset request for:", email);

  try {
    const user = await User.findOne({ email });

    // Block reset for deleted user accounts
    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "20m" });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"CreatorMarket" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err);
        return res.status(500).json({ success: false, message: "Failed to send email" });
      }

      return res.status(200).json({ success: true, message: "Reset email sent" });
    });
  } catch (err) {
    console.error("Reset link error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== RESET PASSWORD: UPDATE PASSWORD =====
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is soft deleted before allowing reset
    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ===== SOFT DELETE USER (ADMIN ONLY) =====
// You can add this endpoint in userController and protect it with isAdmin middleware
exports.softDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ success: false, message: "User not found or already deleted" });
    }

    user.isDeleted = true;
    await user.save();

    return res.status(200).json({ success: true, message: "User deactivated successfully" });
  } catch (err) {
    console.error("Soft delete user error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};  

// ===== GET CREATORS (Oldest to Newest, Not Deleted) =====
exports.getAllCreators = async (req, res) => {
  try {
    const creators = await User.find({
      role: "creator",
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: 1 }) // oldest first
      .select("firstName lastName email profile createdAt");

    return res.status(200).json({ success: true, data: creators });
  } catch (err) {
    console.error("Get All Creators Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ===== GET ALL USERS (ADMIN ONLY) =====
exports.getAllUsers = async (req, res) => {
  try {
    const { 
      role, 
      status, 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Filter by role if specified
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    // Filter by status (active/deleted)
    if (status === 'active') {
      filter.isDeleted = { $ne: true };
    } else if (status === 'deleted') {
      filter.isDeleted = true;
    }
    // If status is 'all' or not specified, don't add isDeleted filter
    
    // Search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(filter)
      .select('firstName lastName email role isDeleted createdAt updatedAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    // Get user statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { 
            $sum: { $cond: [{ $ne: ['$isDeleted', true] }, 1, 0] } 
          },
          deletedUsers: { 
            $sum: { $cond: [{ $eq: ['$isDeleted', true] }, 1, 0] } 
          },
          creators: { 
            $sum: { $cond: [{ $eq: ['$role', 'creator'] }, 1, 0] } 
          },
          consumers: { 
            $sum: { $cond: [{ $eq: ['$role', 'consumer'] }, 1, 0] } 
          },
          admins: { 
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } 
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        deletedUsers: 0,
        creators: 0,
        consumers: 0,
        admins: 0
      }
    });
    
  } catch (err) {
    console.error("Get All Users Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};