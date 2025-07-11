// const User = require("../models/UserModels");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer")

// // Register user
// exports.registerUser = async (req, res) => {
//     const { email, firstName, lastName, password, role } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing fields",
//         });
//     }

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User exists",
//             });
//         }

//         const hashedPas = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             // userId: uuidv4(),
//             email,
//             firstName,
//             lastName,
//             password: hashedPas,
//             role: role || "normal", 
//         });

//         await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: "User Registered",
//         });
//     } catch (err) {
        
//     console.error("Register error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };

// // Login user
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Missing field",
//         });
//     }

//     try {
//         const getUser = await User.findOne({ email });

//         if (!getUser) {
//             return res.status(403).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         const passwordCheck = await bcrypt.compare(password, getUser.password);

//         if (!passwordCheck) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid credentials",
//             });
//         }

//         const payload = {
//             _id: getUser._id,
//             email: getUser.email,
//             firstName: getUser.firstName,
//             lastName: getUser.lastName,
//         };

//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

//         return res.status(200).json({
//             success: true,
//             message: "Login Successful",
//             data: getUser,
//             token: token,
//         });
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };
// const transpoter = nodemailer.createTransport(
//     {
//         service: "gmail",
//         auth:{
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     }
// )

// exports.sendResetLink = async (req, res) => {
//     const { email } = req.body
//     try{
//         const user = await User.findOne({ email })
//         if(!user) return res.status(404).json({success: false, message: "User not found"})
//         const token = jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: "20m"})
//         const resetUrl = process.env.CLIENT_URL + "/reset-password/" + token
//         const mailOptions = {
//             from: `"Your app" <${process.env.EMAIL_USER}>`, // backtick
//             to: email,
//             subject: "Reset your password",
//             html: `<p>Click on the link to reset.. ${resetUrl}</p>`
//         }
//         transpoter.sendMail( mailOptions, (err, info) => {
//             if(err) return res.status(403).json({success: false, message: "Email failed"})
//             console.log(info)
//             return res.status(200).json({success: true, message: "Email sent"})
//         })
//     }catch(err){
//         return res.status(500).json({success: false, message: "Server err"})
//     }
// }

// exports.resetPassword = async  (req, res) => {
//     const { token } = req.params;
//     const { password } = req.body
//     try{
//         const decoded = jwt.verify(token, process.env.SECRET)
//         const hashed = await bcrypt.hash(password, 10)
//         await User.findByIdAndUpdate(decoded.id, { password: hashed })
//         return res.status(200).json({ success: true, message: "Password updated" })
//     }catch(err){
//         return res.status(500).json({success: false, message: "Server err/Invalid token"})
//     }
// }
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
        const existingUser = await User.findOne({ email });

        if (existingUser) {
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
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found",
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

// exports.sendResetLink = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user)
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//             expiresIn: "20m",
//         });

//         const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

//         const mailOptions = {
//             from: `"CreatorMarket" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Reset Your Password",
//             html: `<p>Click the link below to reset your password:</p>
//                    <a href="${resetUrl}">${resetUrl}</a>`,
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error("Email error:", err);
//                 return res.status(500).json({
//                     success: false,
//                     message: "Failed to send email",
//                 });
//             }

//             return res.status(200).json({
//                 success: true,
//                 message: "Reset email sent",
//             });
//         });
//     } catch (err) {
//         console.error("Reset link error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };

exports.sendResetLink = async (req, res) => {
    const { email } = req.body;
    console.log("Incoming reset request for:", email); // 🔍 ADD THIS

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "20m" });
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const mailOptions = {
            from: `"CreatorMarket" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password",
            html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
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
