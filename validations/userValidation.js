// register, login JOI 스키마 정의

const Joi = require("joi");


// 회원가입 검증 register validation
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long",
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("user", "admin").required().messages({
    "any.only": "Role must be either 'user' or 'admin'",
    "any.required": "Role is required",
  }), // model에서 default 주면 .required() 없애고 .optional() 쓰면 됨
});

// 로그인 검증 login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// 업데이트 검증 update validation
const updateSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional(),
  password: Joi.string().min(4).optional(),
});



module.exports = {
    registerSchema,
    loginSchema,
    updateSchema,
}
