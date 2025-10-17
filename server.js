// Import the express library
const express = require("express");
// Initializing the app
const app = express();
// express.json()
// : 요청 바디(request body)를 JSON으로 파싱하는 내장 미들웨어. 클라이언트가 보낸 JSON 데이터를 request.body로 바로 사용할 수 있게 만들어줌
app.use(express.json());

// db-config 파일 불러오기
require("./config/db-config");

// ROUTING 라우팅 설정