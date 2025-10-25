const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                // 이메일로 사용자 찾기
                const user = await User.findOne({ email: email });
                if(!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                const isMatch = await user.comparePassword(password);
                if(!isMatch) {
                    return done(null, false, { message: "Incorrect password" });
                }
                //인증 성공
                return done(null, user); // user 객체를 req.user에 넣어줌
            } catch(err) {
                return done(err);
            }
        }
    )
);



module.exports = passport;