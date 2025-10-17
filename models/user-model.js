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
        default: "user",
        required: true,
    }
});

// 비밀번호 해시 처리 (DB 저장 전에 실행됨)
userSchema.pre("save", async function(next) {
    // 비밀번호가 변경되지 않았다면 넘어가기 (update 시 중복 암호화 방지)
    if(!this.isModified("password")) return next();

    try {
        // salt(랜덤 문자열) 생성 - 복잡도 10
        const salt = await bcrypt.genSalt(10);
        // 비밀번호를 salt와 함께 해시
        this.password = await bcrypt.hash(this.password, salt);
        // 다음 단계로 이동 (실제 저장 수행)
        next();
    } catch(err) {
        // 에러 발생 시 mongoose에 에러 전달
        next(err);
    }
});


// User 모델 생성 후 테이블과 연결
const User = mongoose.model("User", userSchema);



module.exports = User;