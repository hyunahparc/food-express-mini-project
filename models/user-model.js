const mongoose = require("mongoose");
// hashed password : bcrypt 사용하기
const bcrypt = require("bcrypt");


// 스키마 만들기
const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    role: {
        type: String, 
        enum: ["user", "admin"],
        required: true,
    }
});

// 비밀번호 해시 처리 (DB 저장 전에 실행됨)
// “User를 저장하기 전에 비밀번호를 해시로 변환해라.”
// 이 부분 나중에 미들웨어로 따로 빼도 됨
userSchema.pre("save", async function(next) {
    // 비밀번호가 변경되지 않았다면 넘어가기 (update 시 중복 암호화 방지)
    if(!this.isModified("password")) return next();

    try {
        // salt(랜덤 문자열) 생성 - 복잡도 10
        const salt = await bcrypt.genSalt(10);
        // 비밀번호를 salt와 함께 해시
        this.password = await bcrypt.hash(this.password, salt);
        // 다음 단계로 이동 (해시된 비밀번호를 실제로 저장함)
        next();
    } catch(err) {
        // 에러 발생 시 mongoose에 에러 전달
        next(err);
    }
});

// 비밀번호 검증 메서드 (로그인 시)
userSchema.methods.comparePassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};


// User 모델 생성 후 테이블과 연결
const User = mongoose.model("User", userSchema);



module.exports = User;