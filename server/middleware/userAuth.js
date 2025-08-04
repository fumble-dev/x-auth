import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "iloveyou";

export const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please log in."
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again."
            });
        }

        req.userId = decoded.id;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired or invalid. Please log in again."
        });
    }
};
