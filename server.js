require("dotenv").config()
require("./db")

const jwt = require("jsonwebtoken")
const Hapi = require("@hapi/hapi")

const { scheme } = require("./utils/auth_scheme")


const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: "localhost"
    })

    // Setting up the Auth Strategy
    server.auth.scheme("jwt-auth", scheme)
    server.auth.strategy("jwt-auth-strategy", "jwt-auth")

    // JWT routes
    server.route(require("./routes/auth_route"))

    // Application routes
    server.route(require("./routes/app_routes"))


    await server.start()
    console.log("Server Started at: " + server.info.uri)
}

init()