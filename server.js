require("dotenv").config();
require("./db");

const jwt = require("jsonwebtoken");
const Hapi = require("@hapi/hapi");

const { scheme } = require("./utils/auth_scheme");

const authRoutes = require("./routes/auth_route");
const appRoutes = require("./routes/app_routes");

const init = async () => {
  const server = Hapi.server({
    port: 4000,
    host: "myaddress",
    routes: {
      cors: {
        // Allowed request from these origins
        origin: ["http://myaddress:3000", "http://localhost:3000"],
      },
    },
  });

  // Setting up the Auth Strategy
  server.auth.scheme("jwt-auth", scheme);
  server.auth.strategy("jwt-auth-strategy", "jwt-auth");

  // JWT Authorization routes
  server.route(authRoutes);

  // Application routes
  server.route(appRoutes);

  await server.start();

  server.ext("onRequest", (request, h) => {
    console.log("onRequest hit!");
    return h.continue;
  });

  process.on("uncaughtException", (error) => {
    console.log(error);
  });
  console.log("Server Started at: " + server.info.uri);
};

init();
