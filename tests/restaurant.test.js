const { app, server } = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant-model");

let token;

afterAll(async () => {
    await Restaurant.deleteMany({ name: /Test Restaurant/ });
    await mongoose.connection.close();
    server.close();
});


describe("RESTAURANT API", () => {
    const adminUser = {
        username: "adminuser",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
    };

    let createdRestaurantId;

    beforeAll(async () => {
        // Create admin account and login
        await supertest(app).post("/users/register").send(adminUser);
        const loginRes = await supertest(app)
        .post("/users/login")
        .send({ email: adminUser.email, password: adminUser.password });
        token = loginRes.body.token;
    });

    // CREATE RESTAURANT (ADMIN ONLY)
    it("should create a restaurant (admin only)", async () => {
        const res = await supertest(app)
        .post("/restaurants/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Test Restaurant",
            address: "123 Food St",
            phone: "010-1111-2222",
            opening_hours: "10:00-22:00",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("restaurant");
        createdRestaurantId = res.body.restaurant._id;
    });  

    // GETALL RESTAURANT (PUBLIC)
    it("should get all restaurants (public)", async () => {
        const res = await supertest(app).get("/restaurants");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
    });  

    // UPDATE RESTAURANT (ADMIN ONLY)
    it("should update a restaurant (admin only)", async () => {
        const res = await supertest(app)
        .put(`/restaurants/update/${createdRestaurantId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "010-9999-8888" });

        expect(res.statusCode).toBe(200);
        expect(res.body.restaurant.phone).toBe("010-9999-8888");
    });  

    it("should delete a restaurant (admin only)", async () => {
        const res = await supertest(app)
        .delete(`/restaurants/remove/${createdRestaurantId}`)
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });  
});