// client/server.js
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Path = require("path");

const addStaticRoutes = async (server) => {
  await server.register(Inert);

  console.log("Registering static routes...");
 
  // Serve files from the "public/assets" directory first
  server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public", "assets"),
      },
    },
    options: {
      auth: false, // Disable authentication for static files
    },
  });

  // Serve files from the "public" directory with public access
  server.route({
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public"),
      },
    },
    options: {
      auth: false, // Disable authentication for static files
    },
  });

  // Serve files from the "dist" directory with public access
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "dist"),
        index: ["index.html"],
      },
    },
    options: {
      auth: false, // Disable authentication for static files
    },
  });

  console.log("Static routes registered successfully.");
  console.log("Dist Path:", Path.join(__dirname, "dist"));
  console.log("Public Path:", Path.join(__dirname, "public"));
  console.log("Assets Path:", Path.join(__dirname, "public", "assets"));
};

module.exports = addStaticRoutes;



