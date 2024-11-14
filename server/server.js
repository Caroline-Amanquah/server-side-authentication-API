// backend/server.js

const Hapi = require('@hapi/hapi');
const connectDB = require('./config/database'); // Ensure this import is correct
const userRoutes = require('./routes/userRoutes');
// const addStaticRoutes = require('../frontend/server');
const Cookie = require('@hapi/cookie');
const dotenv = require('dotenv');

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  await connectDB(); // Make sure connectDB is properly imported here
  await server.register(Cookie);
  // Add API routes
  server.route(userRoutes);

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'auth-cookie',
      password: process.env.COOKIE_SECRET,
      isSecure: process.env.NODE_ENV === 'production',
    },
    redirectTo: false,
  });
  server.auth.default('session');

//   server.route(userRoutes);
//   await addStaticRoutes(server);

  server.start().then(() => {
    console.log(`Server running on ${server.info.uri}`);
    console.log('Routes registered:', server.table().map(route => route.path));
  });
};

if (require.main === module) {
  init();
}

module.exports = init;
