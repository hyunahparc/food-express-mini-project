const { app, server } = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/user-model");

// Save JWT token after login
let token;

// close server after all tests
afterAll(async () => {
    // Delete test users (e.g., emails ending with @example.com)
    await User.deleteMany({ email: /@example\.com$/ });
    // Close the database connection
    await mongoose.connection.close();
    // Stop the server
    server.close();
});

describe("USER API", () => {
    const userData = {
        username: "jestuser",
        email: "jestuser@example.com",
        password: "123456",
        role: "user",
    };   

    // USER REGISTER
    it("should register a new user successfully", async () => {
        // Supertest run the app and call /users/register
        const res = await supertest(app)
            .post("/users/register")
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.body.user).toHaveProperty("_id");
    });

    // USER LOGIN + SAVE JWT
    it("should login the user and return JWT token", async () => {
        const res = await supertest(app)
        .post("/users/login")
        .send({
            email: userData.email,
            password: userData.password,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // Save the token
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