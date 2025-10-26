// Joi schema validation for register and login

const Joi = require("joi");


// Register validation
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
  }), // If there is a default role in model, you can remove .required() and use .optional()
});

// Login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Update validation
const updateSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 20 characters",
  }),
  password: Joi.string().min(4).optional().messages({
    "string.min": "Password must be at least 4 characters long",
  }),
});

// Admin-only user update (all fields are optional)
const adminUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(20).optional().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 20 characters",
  }),
  role: Joi.string().valid("user", "admin").optional().messages({
    "any.only": "Role must be either 'user' or 'admin'",
  }),
});



module.exports = {
    registerSchema,
    loginSchema,
    updateSchema,
    adminUpdateSchema,
}
