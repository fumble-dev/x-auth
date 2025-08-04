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
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, cookieOptions);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to X-Auth",
            text: `Welcome to X-Auth. Your account has been created with email id: ${email} `
        }
        await transporter.sendMail(mailOptions)

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
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
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. It will expire in 24 hours.`
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
