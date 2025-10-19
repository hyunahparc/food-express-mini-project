// 토큰 검증 미들웨어

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Authorization 헤더가 없거나 형식이 잘못된 경우
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
        // 401은 unauthorized 오류?
    }

    // 헤더에 토큰이 있으면 토큰 가져오기
    const token = authHeader.split(" ")[1]; // "Bearer TOKEN" → TOKEN

    try {
        // 토큰 검증 (유효한 JWT인지 확인)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 요청 객체에 사용자 정보 추가 (id, email 등) - 이후 컨트롤러에서 사용 가능
        req.user = decoded;
        // 다음 미들웨어 or 컨트롤러로 이동
        next();
    } catch(err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    } // 왜 403??
};








module.exports = auth;