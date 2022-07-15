const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");

// This is the authorization scheme
// Checks that eah API has Access to the resource or not
// authenticate method is must

const scheme = function (server, option) {
  return {
    authenticate: function (request, h) {
      const authHeader = request.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        return h.authenticated({ credentials: data });
      } catch (error) {
        return h.unauthenticated(boom.badRequest("Error in token"));
      }
    },
  };
};

module.exports = { scheme };
