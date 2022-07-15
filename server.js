require("dotenv").config();
require("./db");

const jwt = require("jsonwebtoken");
const Hapi = require("@hapi/hapi");

const { scheme } = require("./utils/auth_scheme");

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
  server.route(require("./routes/auth_route"));

  // Application routes
  server.route(require("./routes/app_routes"));

  await server.start();
  // server.ext("onPreResponse", (request, h) => {
  //   return request.response
  //     .header("Access-Control-Allow-Origin", "*")
  //     .header(
  //       "Access-Control-Allow-Methods",
  //       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  //     )
  //     .header("Access-Control-Allow-Headers", "X-Requested-With")
  //     .header("Access-Control-Allow-Credentials", true);
  // });
  server.ext("onRequest", (request, h) => {
    console.log("onRequest hit!");
    return h.continue;
  });
  // onPreRequest, onPreAuth etc
  // server.ext("event", handler){
  process.on("uncaughtException", (error) => {
    console.log(error);
  });
  console.log("Server Started at: " + server.info.uri);
};

init();
