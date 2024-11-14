// backend/controllers/UserController.js

const  User  = require('../models/userModel');
const  Session  = require('../models/sessionModel');
const { v4: uuidv4 } = require('uuid');
const Boom = require('@hapi/boom');
const validator = require('validator');

// Helper function to generate a unique reference number
function generateReferenceNumber() {
  const randomMiddle = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `HD${randomMiddle}F`;
}

class UserController {
  static async registerUser(request, h) {
    const { name, email, password } = request.payload;

    try {
      // Validate email format
      if (!validator.isEmail(email)) {
        throw Boom.badRequest('Invalid email format');
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw Boom.conflict('User already exists');
      }

      // Generate a unique reference number
      const referenceNumber = generateReferenceNumber();

      // Create and save the new user with a reference number
      const newUser = new User({ name, email, password, referenceNumber });
      await newUser.save();

      // Generate session ID and save session
      const sessionId = uuidv4();
      const session = new Session({
        userId: newUser._id,
        sessionId,
        isActive: true,
        createdAt: new Date(),
      });
      await session.save();

      // Set session cookie securely
      h.state('auth-cookie', { id: sessionId }, { 
        isSecure: true, // Set to true in production
        path: '/',
        isHttpOnly: true,
        isSameSite: 'Lax', 
      });

      return h.response({
        message: 'User created successfully',
        user: { name: newUser.name, referenceNumber: newUser.referenceNumber }
      }).code(201);
    } catch (error) {
      console.error("Error during registration:", error);
      return Boom.badImplementation("Internal server error");
    }
  }

  static async getAllUsers(request, h) {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: 'sessions',
            localField: '_id',
            foreignField: 'userId',
            as: 'sessions',
          },
        },
      ]);

      if (!users || users.length === 0) {
        return h.response({ message: "No users found." }).code(404);
      }

      return h.response(users).code(200);
    } catch (error) {
      console.error("Error fetching users with sessions:", error);
      return Boom.badImplementation("Internal server error");
    }
  }
}

module.exports = UserController;
