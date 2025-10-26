const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                // Find the user by email
                const user = await User.findOne({ email: email });
                if(!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                const isMatch = await user.comparePassword(password);
                if(!isMatch) {
                    return done(null, false, { message: "Incorrect password" });
                }
                // Authentication successful
                return done(null, user); // Attach the user object to req.user
            } catch(err) {
                return done(err);
            }
        }
    )
);



module.exports = passport;