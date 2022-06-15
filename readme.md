User Manual

    - Execute following commands:
        ?> npm install
        ?> nodemon server.js

    - Create following files:
        - create .env file and add,
            - SECRET_KEY=<any-key>
    
    - Get the JWT Token,
        - Visit route @POST '/api/auth/login'
            - {username: "<username>"}
            - Check the response
    
    - USE URL-SHORTNER:
        - POST Request @ "/api/shortner"
        - {"longUrl" : "any long url"}
        - Check the response and note the shortUrl
    - Now paste the shortUrl in browser and you will be redirected to that longUrl
    - In DB, number of clicks are also maintained
    