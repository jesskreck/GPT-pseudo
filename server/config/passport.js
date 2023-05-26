import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import * as dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

const passportConfig = () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };
    const myStrategy = new JwtStrategy(opts, function (jwt_payload, done) {
        //NOTE .sub prop was declared by us in server/lib/jwt.js
        User.findById(jwt_payload.sub)
            .then((user) => {
                //NOTE cannot put return in front of done because it will exit the function and not read the second part of the ternary
                return user ? done(null, user) : done(null, false);
            })
            .catch((error) => {
                return done(error, false); 
            });
    });

    passport.use(myStrategy);
};

export default passportConfig;
