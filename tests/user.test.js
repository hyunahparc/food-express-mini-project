const { app, server } = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user-model");

// 로그인 후 저장할 JWT
let token;

// close server after all tests
afterAll(async () => {
    // 테스트용 유저 삭제 (예: @example.com 이메일)
    await User.deleteMany({ email: /@example\.com$/ });
    // DB 연결 종료
    await mongoose.connection.close();
    // 서버 종료
    server.close();
});

describe("USER API", () => {
    const userData = {
        username: "jestuser",
        email: "jestuser@example.com",
        password: "123456",
        role: "user",
    };   

    // USER REGISTER 회원가입
    it("should register a new user successfully", async () => {
        // 슈퍼테스트야 내 앱 실행시켜서 /users/register 해라
        const res = await supertest(app)
            .post("/users/register")
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.body.user).toHaveProperty("_id");
    });

    // USER LOGIN + SAVE JWT 로그인
    it("should login the user and return JWT token", async () => {
        const res = await supertest(app)
        .post("/users/login")
        .send({
            email: userData.email,
            password: userData.password,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // 토큰 저장
    });

    // USER UPDATE WITH JWT TOKEN
    it("should update the user info using JWT token", async () => {
        const res = await supertest(app)
        .put("/users/update")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "jestuser_updated" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBe("jestuser_updated");
    });

    // USER DELETE WITH JWT TOKEN
    it("should delete the user account using JWT token", async () => {
        const res = await supertest(app)
        .delete("/users/remove")
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Account deleted successfully");
    }); 
});