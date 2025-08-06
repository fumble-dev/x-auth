import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in."
            });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        console.error("getUserData Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching user data."
        });
    }
};
