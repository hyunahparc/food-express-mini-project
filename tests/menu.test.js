const { app, server } = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Menu = require("../models/menu-model");
const Restaurant = require("../models/restaurant-model");

let token;
let restaurantId;
let menuId;

afterAll(async () => {
    await Menu.findByIdAndDelete(menuId);
    await Restaurant.findByIdAndDelete(restaurantId);
    await mongoose.connection.close();
    server.close();
});

describe("MENU API", () => {
    const adminUser = {
        username: "adminmenu",
        email: "adminmenu@example.com",
        password: "123456",
        role: "admin",
    };

    beforeAll(async () => {
        // 관리자 생성 및 로그인
        await supertest(app).post("/users/register").send(adminUser);
        const loginRes = await supertest(app)
        .post("/users/login")
        .send({ email: adminUser.email, password: adminUser.password });
        token = loginRes.body.token;

        // 레스토랑 먼저 생성 (menu는 restaurant_id 필요)
        const restRes = await supertest(app)
        .post("/restaurants/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "MenuTest Restaurant",
            address: "456 Taste Rd",
            phone: "010-3333-4444",
            opening_hours: "09:00-21:00",
        });
        restaurantId = restRes.body.restaurant._id;
    });

    // CREATE MENU (ADMIN ONLY)
    it("should create a menu (admin only)", async () => {
        const res = await supertest(app)
        .post("/menus/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
            restaurant_id: restaurantId,
            name: "Kimchi Stew",
            description: "Spicy and delicious",
            price: 9000,
            category: "main",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("menu");
        menuId = res.body.menu._id;
    });

    // GETALL MENU (PUBLIC)
    it("should get all menus (public)", async () => {
        const res = await supertest(app).get("/menus");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("data");
    });

    // UPDATE MENU (ADMIN ONLY)
    it("should update a menu (admin only)", async () => {
        const res = await supertest(app)
        .put(`/menus/update/${menuId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ price: 9500 });

        expect(res.statusCode).toBe(200);
        expect(res.body.menu.price).toBe(9500);
    });

    // DELETE MENU (ADMIN ONLY)
    it("should delete a menu (admin only)", async () => {
        const res = await supertest(app)
        .delete(`/menus/remove/${menuId}`)
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});