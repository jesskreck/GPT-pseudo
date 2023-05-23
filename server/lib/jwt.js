import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

export const generateToken = (existingUser) => {
    const payload = {
        sub: existingUser._id,
        email: existingUser.email
    }
    const options = {
        expiresIn: "7d",
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token
}