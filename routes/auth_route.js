const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const boom = require("@hapi/boom");

module.exports = [
  {
    method: "POST",
    path: "/api/auth/login",
    options: {
      validate: {
        payload: Joi.object().keys({
          username: Joi.string().required(),
          password: Joi.string().required().min(6).max(128),
        }),
        failAction: async (request, h, error) => {
          throw error;
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { username, password } = request.payload;

        const user = await User.findOne({ username: username })
          .select({ _id: 1, username: 1, password: 1 })
          .exec();

        if (!user) {
          return boom.badData("User don't exist!");
        } else {
          const res = await bcrypt.compare(password, user.password);
          if (res) {
            // Sign a token with username
            const token = jwt.sign(
              {
                id: user._id,
                username: username,
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "2h",
              }
            );
            return h
              .response({ _id: user._id, username: username, token: token })
              .code(200)
              .message("Token returned");
          } else {
            return boom.badData("Wrong Credentials");
          }
        }
      } catch (error) {
        return boom.badRequest();
      }
    },
  },
  {
    method: "POST",
    path: "/api/auth/register",
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().min(6).max(128),
        }),
        failAction: async (request, h, error) => {
          throw error;
        },
      },
    },
    handler: async (request, h) => {
      // GET the users data
      const { username, password } = request.payload;

      console.log(username, password);
      // Check the user in db
      const user = await User.findOne({ username: username })
        .select({ __v: 0 })
        .exec();
      if (user) {
        // User already exists in db
        console.log("user already exist");
        return { user, status: "oldUser" };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = User({
          username: username,
          password: hashedPassword,
        });
        const qres = await newUser.save();

        console.log(newUser);
        return { newUser, status: "created" };
      }
    },
  },
];
