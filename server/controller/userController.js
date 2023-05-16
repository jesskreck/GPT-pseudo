// STEP 2 OF 3: CONTROLLER 
// import model
// write functions what model should do (CRUD)
// export function(s) for router
// import in ROUTES



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
    console.log(req.body);
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })
    try {
        const result = await newUser.save();
        console.log('result create user:>> ', result);
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
}


export { testingRoute, getUsers, getUserById, createUser }