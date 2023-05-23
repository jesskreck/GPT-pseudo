// STEP 2 OF 3: CONTROLLER 
// import model
// write functions what model should do (CRUD)
// export function(s) for router
// import in ROUTES



import { encryptPassword, verifyPassword } from "../lib/bcrypt.js";
import { generateToken } from "../lib/jwt.js";
import User from "../models/userModel.js";


const testingRoute = (req, res) => {
    res.send("testing user route again....")
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async (req, res) => {
    try {
        const params = req.params;
        console.log('params :>> ', params);
        res.send(params)
    } catch (error) {
        console.log(error);
    }
}

const createUser = async (req, res) => {
    console.log("createUser started");
    if (!req.body.email || !req.body.password) {
        return res.status(406).json({ error: "Please fill out all the fields" })
    }
    const encryptedPassword = await encryptPassword(req.body.password);
    const newUser = new User({
        email: req.body.email,
        password: encryptedPassword
    })
    try {
        const registeredUser = await newUser.save();
        res.status(200).json({
            message: "Successfully registered!",
            newUser: registeredUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("server error");
    }
}



const loginUser = async (req, res) => {
    console.log("loginUser started");
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            return res.status(401).json({ error: "no user found" })
        }
        if (existingUser) {
            const verified = await verifyPassword(req.body.password, existingUser.password);
            if (!verified) {
                res.status(406).json({ error: "password doesn't match" })
            }
            if (verified) {
                const token = generateToken(existingUser);
                res.status(200).json({
                    verified: true,
                    token: token,
                    user: {
                        _id: existingUser._id,
                        username: existingUser.username,
                    }
                })
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "something went wrong.." })
    }
}


export { testingRoute, getUsers, getUserById, createUser, loginUser }