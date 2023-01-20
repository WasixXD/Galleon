import Client from "./Client.js"
import { createServer } from "node:http";

import { Buffer } from "node:buffer"


class Galleon {
    #get_paths = []
    #post_paths = []
    
    
    constructor() {
        
        
        this.server = createServer()
        .on("request", async (request, response) => {
            console.log("\n", request.method, request.url, "from Galleon")
            
            let ship = new Client(request, response)
                response.on("pipe", (data) => {
                    
                })
                
                if(request.method === "GET") {
                    this.#get_paths.forEach((value) => {
                        if(value.path == request.url) 
                        value.callback(ship)
                    })
                    
                }
                
                if(request.method == "POST") {
                     
                    await request.on("data", (data) => {
                        let reader = Buffer.from(data).toString("utf-8")

                        if(request.headers['content-type'] == "application/json"){
                            ship.body = JSON.parse(reader)
                        }

                        console.log(`Received: ${ship.body}`)
                    
                    
                    })
                
                   

                    this.#post_paths.forEach( (value) => {
                        if(value.path == request.url) 
                             value.callback(ship)
                    })
                    
                }
                
                
                
                
                response.end("")
            })
            
    }



    get(PATH, callback) {
        this.#get_paths.push({path: PATH, method: "GET", callback})
    }


    post(PATH, callback) {
        this.#post_paths.push({path: PATH, method: "POST", callback})
    }


    listen(PORT, log) {

        this.server.listen(PORT, log)
        
    }
}

export default Galleon