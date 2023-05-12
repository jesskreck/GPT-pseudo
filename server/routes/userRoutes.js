// STEP 3 OF 3: ROUTES
// import routes aka functions from controller 
// use it in callback for new route



import express from "express"

import { testingRoute, getUsers, getUserById, createUser } from "../controller/userController.js";

const userRouter = express.Router();

// double check: are routes that are listed here, (1) imported in this file, (2) exported in userController? Is import including ".js"?
userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUserById)



userRouter.post("/new", createUser)

export default userRouter