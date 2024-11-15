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


      // Log user creation info
      console.log(`Account created at: ${new Date().toISOString()}`);
      console.log(`name: "${newUser.name}"`);
      console.log(`email: "${newUser.email}"`);
      console.log(`password: "${newUser.password}"`);
      console.log(`referenceNumber: "${newUser.referenceNumber}"`);


      // Generate session ID and save session
      const sessionId = uuidv4();
      const session = new Session({
        userId: newUser._id,
        sessionId,
        isActive: true,
        createdAt: new Date(),
      });
      await session.save();

      // Log session creation info
      console.log(`Session created at: ${new Date().toISOString()}`);
      console.log("Session info:", {
        _id: session._id,
        userId: session.userId,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
        isActive: session.isActive,
      });

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

  static async logoutUser(request, h) {
    try {
       const sessionId = request.state['auth-cookie']?.id;
       console.log("Attempting logout with session ID:", sessionId); // Log session ID for debugging
 
       if (!sessionId) {
          console.log("No session ID found in auth-cookie");
          throw Boom.unauthorized("No active session found");
       }
 
       const session = await Session.findOneAndUpdate(
          { sessionId, isActive: true },
          { isActive: false },
          { new: true }
       );
 
       if (!session) {
          console.log("Session not found or already inactive");
          throw Boom.unauthorized("Session not found or already inactive");
       }
 
       // Clear the cookie
       h.unstate('auth-cookie');
       console.log(`User logged out at: ${new Date().toISOString()}`);
       console.log("Updated Session info:", {
          _id: session._id,
          userId: session.userId,
          sessionId: session.sessionId,
          createdAt: session.createdAt,
          isActive: session.isActive, 
       });
 
       return h.response({ message: "User logged out successfully" }).code(200);
    } catch (error) {
       console.error("Error during logout:", error);
       return Boom.badImplementation("Internal server error");
    }
 } 
}

module.exports = UserController;
