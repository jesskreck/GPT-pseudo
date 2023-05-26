// STEP 3 OF 3: ROUTES
// import routes aka functions from controller 
// use it in callback for new route



import express from "express"

import { testingRoute, getUsers, getUserById, createUser, loginUser, getUserWithToken } from "../controller/userController.js";
import jwtAuth from "../middlewares/jwtAuth.js";

const userRouter = express.Router()

//NOTE for troubleshooting: Are routes imported in this file? If yes, does import have ".js"? If yes, are they exported in controller?
//NOTE for testing: Endpoint established as "/api/" in index.js
userRouter.get("/test", testingRoute)
userRouter.get("/all", getUsers)
userRouter.get("/id/:id", getUserById)
userRouter.get("/auth", jwtAuth, getUserWithToken)

userRouter.post("/new", createUser)
userRouter.post("/login", loginUser)
userRouter.post("/register", createUser)

export default userRouter