const jwt = require("jsonwebtoken")
const {v4: uuidv4} = require("uuid")
module.exports = [
    {
        method: "POST",
        path: "/api/auth/login",
        handler: async (request, h) => {
            try{
                const {username} = request.payload
                // Sign a token with username
                const token = jwt.sign({
                    id : uuidv4(),
                    username: username},
                    process.env.SECRET_KEY, {
                        expiresIn: '2h'
                    })
                return h.response({username: username, token: token})
                    .code(301)
                    .message("Token returned")
        }catch(error){
           return h.response(Error)
        }
        }
    }
]