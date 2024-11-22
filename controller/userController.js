// controllers/UserController.js

const  User  = require('../models/userModel');
const  Session  = require('../models/sessionModel');
const { v4: uuidv4 } = require('uuid');
const Boom = require('@hapi/boom');

// Function generates a unique reference number
const generateReferenceNumber = () => {
  const randomMiddle = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `HD${randomMiddle}F`;
}
// Function formats the timestamp using JavaScript Intl.DateTimeFormat API
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

class UserController {
  static async registerUser(request, h) {
    const { name, email, password } = request.payload;

    try {

      // Checks if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw Boom.conflict('User already exists');
      }
      
      
      // Generates a unique reference number
      const referenceNumber = generateReferenceNumber();

      // Creates and saves the new user with a reference number
      const newUser = new User({ name, email, password, referenceNumber });
      await newUser.save();


      // Logs user creation info
      console.log(`Account created at: ${formatDate(new Date())}`);
      console.log(`name: "${newUser.name}"`);
      console.log(`email: "${newUser.email}"`);
      console.log(`password: "${newUser.password}"`);
      console.log(`referenceNumber: "${newUser.referenceNumber}"`);


      // Generates session ID and saves session
      const sessionId = uuidv4();
      const session = new Session({
        userId: newUser._id,
        sessionId,
        isActive: true,
        createdAt: new Date(),
      });
      await session.save();

      // Logs session creation info
      console.log(`Session created at: ${formatDate(new Date())}`);
      console.log("Session info:", {
        _id: session._id,
        userId: session.userId,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
        isActive: session.isActive,
      });

      // Sets session cookie securely using cookie attributes in the browser (Application>Storage>Cookies)
      h.state('auth-cookie', { id: sessionId }, { 
        isSecure: true, 
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
      const sessionId = request.state["auth-cookie"]?.id;
      console.log("Attempting logout with session ID:", sessionId);
  
      if (!sessionId) {
        console.log("No session ID found in auth-cookie");
        return h.response({ message: "No active session found" }).code(200); // Graceful response
      }
  
      const session = await Session.findOneAndUpdate(
        { sessionId, isActive: true },
        { isActive: false },
        { new: true }
      );
  
      if (!session) {
        console.log("Session not found or already inactive");
        return h.response({ message: "Session not found or already inactive" }).code(200); // Graceful response
      }
  
      // Clear the cookie
      h.unstate("auth-cookie");
      console.log(`User logged out at: ${formatDate(new Date())}`);
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

  static async loginUser(request, h) {
    const { email, password } = request.payload;
  
    try {
      // Finds the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw Boom.unauthorized("Invalid email or password");
      }
  
      // Validates the password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw Boom.unauthorized("Invalid email or password");
      }
  
      // Generates a new session
      const sessionId = uuidv4();
      const session = new Session({
        userId: user._id,
        sessionId,
        isActive: true,
        createdAt: new Date(),
      });
      await session.save();

       

    // Logs the login and user information
    console.log(`User logged in at: ${formatDate(new Date())}`);
    console.log("User info:");
    console.log(`name: "${user.name}"`);
    console.log(`email: "${user.email}"`);
    console.log(`referenceNumber: "${user.referenceNumber}"`);

    console.log("Session info:", {
      _id: session._id,
      userId: session.userId,
      sessionId: session.sessionId,
      createdAt: session.createdAt,
      isActive: session.isActive,
    });
  
  
      h.state("auth-cookie", { id: sessionId }, {
        isSecure: true, 
        path: "/",
        isHttpOnly: true,
        isSameSite: "Lax",
    });
  
      return h.response({
        message: "Login successful",
        user: { 
        name: user.name, 
        referenceNumber: user.referenceNumber, 
      },
      }).code(200);
    } catch (error) {
      console.error("Error during login:", error);
      return Boom.badImplementation("Internal server error");
    }
  }
  static async getCurrentUser(request, h) {
    try {
      const sessionId = request.state["auth-cookie"]?.id;
  
      if (!sessionId) {
        throw Boom.unauthorized("No active session found");
      }
  
      const session = await Session.findOne({ sessionId, isActive: true });
      if (!session) {
        throw Boom.unauthorized("Session not found or inactive");
      }
  
      const user = await User.findById(session.userId);
      if (!user) {
        throw Boom.unauthorized("User not found");
      }
  
      return h.response({
        name: user.name,
        referenceNumber: user.referenceNumber,
      }).code(200);
    } catch (error) {
      console.error("Error fetching user data:", error);
      return Boom.badImplementation("Internal server error");
    }
  }  
}

module.exports = UserController;
