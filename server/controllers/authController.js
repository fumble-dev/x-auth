import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "All details are required."
        })
    }

    try {

        const userFound = await userModel.findOne({ email });
        if (userFound) {
            return res.json({
                success: false,
                message: "User already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            name, 
            email, 
            password: hashedPassword
        })
        await newUser.save();

        return res.json({
            success : true,
            message : "User registered successfully"
        })
        
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }

}