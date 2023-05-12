// STEP 1 OF 3: MODEL
// create schema
// create model. Best practice: declare model with capitalized, singular version of collection name + link to collection using lowercase, singular version of collection name
// export model 
// import in CONTROLLER

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true })


// mongoose best practice: 
const User = mongoose.model("user", userSchema)

export default User