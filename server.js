// server.js

const Hapi = require('@hapi/hapi');
const Cookie = require('@hapi/cookie');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const Inert = require('@hapi/inert');
const Path = require('path');


dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

 
  await connectDB();


  await server.register([Cookie, Inert]);

  
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'auth-cookie',
      password: process.env.COOKIE_SECRET, 
      isSecure: false, 
      path: '/',
      isHttpOnly: true,
      isSameSite: 'Lax',
    },
    redirectTo: false, 
  });
  
  

  server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public", "assets"),
      },
    },
    options: {
      auth: false, 
    },
  });


  server.route({
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public"),
      },
    },
    options: {
      auth: false, 
    },
  });

  
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "pages"),
        index: ["index.html"],
      },
    },
    options: {
      auth: false,
    },
  });

  console.log("Static routes registered successfully.");

 
  server.route(userRoutes);


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
