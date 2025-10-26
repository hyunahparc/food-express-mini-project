// Validation middleware

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false}); // 모든 오류 표시
    if(error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map((err) => err.message),
        });
    }
    next();
};



module.exports = validate;