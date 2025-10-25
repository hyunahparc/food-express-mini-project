// Import the express library
const express = require("express");
const passport = require("passport");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// 환경 설정
require("./config/db-config");
require("./config/passport");

// Initializing the app 앱 초기화
const app = express();

// express.json()
// : 요청 바디(request body)를 JSON으로 파싱하는 내장 미들웨어. 클라이언트가 보낸 JSON 데이터를 request.body로 바로 사용할 수 있게 만들어줌
app.use(express.json());
app.use(passport.initialize());

// ROUTING 라우팅 설정
const UserRouter = require("./routes/user-route");
const RestaurantRouter = require("./routes/restaurant-route");
const MenuRouter = require("./routes/menu-route");

app.use("/users", UserRouter);
app.use("/restaurants", RestaurantRouter);
app.use("/menus", MenuRouter);

// SWAGGER
// swagger.yaml 불러오기
const swaggerDocument = YAML.load('./swagger.yaml');
// /api-docs 경로에 Swagger UI 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 서버 실행
const server = app.listen(8080, (err) => {
    console.log("Server running on http://localhost:8080");
});



module.exports = {
    app,
    server,
}