// server/routes/userRoutes.js

const UserController = require('../controller/userController');
const Joi = require('joi');
const Boom = require('@hapi/boom');

const userRoutes = [
  {
    method: 'POST',
    path: '/api/user',
    handler: UserController.registerUser,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          name: Joi.string().required().messages({
            'any.required': 'Name is required',
          }),
          email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
              'string.email': 'Invalid email format',
              'any.required': 'Email is required',
            }),
          password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
            .required()
            .messages({
              'string.min': 'Password must be at least 8 characters long',
              'string.pattern.base': 'Password must contain uppercase, lowercase, digit, and special character',
              'any.required': 'Password is required',
            }),
        }),
        failAction: (request, h, err) => {
          const validationError = err;
          const customMessage = validationError?.details?.[0]?.message || 'Invalid request payload input';
          throw Boom.badRequest(customMessage);
        },
      },
    },
  },

  {
    method: 'GET',
    path: '/api/users',
    handler: UserController.getAllUsers,
    options: {
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/api/logout',
    handler: UserController.logoutUser,
    options: { auth: 'session' },
  },
  // {
  //   method: 'POST',
  //   path: '/login',
  //   handler: UserController.loginUser,
  // }
];

module.exports = userRoutes;
