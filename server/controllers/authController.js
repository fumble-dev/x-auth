import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import transporter from "../config/nodemailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "iloveyou";
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        name = name.trim();
        email = email.toLowerCase().trim();
        password = password.trim();

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, cookieOptions);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "🎉 Welcome to X-Auth!",
            text: `Hello ${name},

Welcome to X-Auth! We're thrilled to have you as part of our developer community.

Your account has been successfully created with the email: ${email}.

You can now log in and start building secure and seamless authentication experiences.

If you did not create this account, please contact our support team immediately.

Best regards,
The X-Auth Team`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        email = email.toLowerCase().trim();
        password = password.trim();

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong during logout"
        });
    }
};

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in."
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.isAccountVerified) {
            return res.status(403).json({
                success: false,
                message: "Account is already verified."
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expireAt = Date.now() + 24 * 60 * 60 * 1000;

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = expireAt;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🔐 X-Auth Account Verification OTP",
            text: `Hello ${user.name},

To complete your registration and verify your X-Auth account, please use the following One-Time Password (OTP):

OTP: ${otp}

This code is valid for the next 24 hours. For your security, do not share this OTP with anyone.

If you did not request this verification, please ignore this email.

Thanks for joining us!
- The X-Auth Team`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("OTP Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId } = req;
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "Missing details."
        });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isOtpInvalid = !user.verifyOtp || user.verifyOtp !== otp;
        const isOtpExpired = user.verifyOtpExpireAt < Date.now();

        if (isOtpInvalid || isOtpExpired) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Please try again."
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Account verified successfully."
        });

    } catch (error) {
        console.error("verifyEmail Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User is authenticated."
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired or invalid. Please log in again."
        });
    }
};

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required to reset your password."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email."
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expireAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.resetOtp = otp;
        user.resetOtpExpireAt = expireAt;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🔑 Password Reset OTP - X-Auth",
            text: `Hello ${user.name},

We received a request to reset your X-Auth password. Please use the following One-Time Password (OTP) to proceed:

OTP: ${otp}

This OTP is valid for 15 minutes. If you did not request this, you can safely ignore this email.

Stay secure,
The X-Auth Team`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Password reset OTP has been sent to your email."
        });

    } catch (error) {
        console.error("sendResetOtp Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Please provide email, OTP, and new password."
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email."
            });
        }

        const isOtpInvalid = !user.resetOtp || user.resetOtp !== otp;
        const isOtpExpired = user.resetOtpExpireAt < Date.now();

        if (isOtpInvalid || isOtpExpired) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP. Please request a new one."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Your password has been reset successfully. You can now log in."
        });

    } catch (error) {
        console.error("resetPassword Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};
