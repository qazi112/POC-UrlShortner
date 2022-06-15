const validUrl = require('valid-url')
const shortid = require('shortid')
const Url = require("../models/url")
const boom = require("@hapi/boom")

module.exports = [
    // @POST /api/shorten
    // Takes {longUrl : "---url"} and returns a new generated short Url
    {
        method: "POST",
        path: "/api/shorten",
        handler: async (request, h) => {
            const baseUrl = request.info.host
            console.log(baseUrl)
            const { longUrl } = request.payload
            const urlCode = shortid.generate()
            
            if (validUrl.isUri(longUrl)){
                // check in db
                const response = await Url.findOne({longUrl: longUrl}).exec()
                const shortUrl = baseUrl + '/' + urlCode
                if (response){
                    console.log("Already exists")
                    return h.response(response)
                }else{
                    const newUrl = new Url({
                        urlCode: urlCode,
                        longUrl: longUrl,
                        shortUrl: shortUrl,
                        clicks: 0,
                        date: new Date()
                    })
                    await newUrl.save()
                    return h.response(newUrl)
                }

            }else{
                return h.response(boom.badData("Invalid Url Entered"), longUrl)
            }
            
        }
    },
    {
        method: "GET",
        path: "/{urlCode}",
        handler: async (request, h) => {
            const urlCode = request.params.urlCode
            const url = await Url.findOne({urlCode:urlCode}).exec()
            if(url){
                console.log(url)
                await Url.updateOne({urlCode: urlCode}, {$inc: {clicks : 1}}).exec()
                return h.response(h.redirect(url.longUrl))
            }else{
                return h.response().code(404).message("URL not found")
            }
        }
    }
]