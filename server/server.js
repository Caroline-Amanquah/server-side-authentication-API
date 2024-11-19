// server/server.js

const Hapi = require('@hapi/hapi');
const Cookie = require('@hapi/cookie');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const addStaticRoutes = require('../client/server');
const Inert = require('@hapi/inert');
const Path = require('path');

// Load environment variables
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  // Connect to MongoDB
  await connectDB();

  // Register plugins
  await server.register([Cookie, Inert]);

  // Define the session authentication strategy
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'auth-cookie',
      password: process.env.COOKIE_SECRET, // Ensure this is set in your .env file
      isSecure: false, // Set to true in production
      path: '/',
      isHttpOnly: true,
      isSameSite: 'Lax',
    },
    redirectTo: false, // Do not redirect if authentication fails
  });
  
  console.log('Available auth strategies:', server.auth.strategy);
  console.log('Session strategy registered successfully.');

  // Register static routes
  await addStaticRoutes(server);

  // Register other user-defined API routes
  server.route(userRoutes);

  // Start the server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  console.log('Routes registered:', server.table().map(route => route.path));
};

if (require.main === module) {
  init().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
}

module.exports = init;
