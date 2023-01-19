import Client from "./Client.js"
import { createServer } from "node:http";
import { EventEmitter } from "node:events"


class Galleon {
   #get_paths = []
    constructor() {
        this.emmiter = new EventEmitter()
    
        this.server = createServer()
            .on("request", (request, response) => {
                console.log(request.method, request.url, " from Galleon")
                
                
                if(request.method === "GET") {
                   
                    
                    this.#get_paths.forEach((value) => {
                       
                        if(value.path == request.url) 
                            
                            value.callback(new Client(request, response))
                    })

                    response.end("")
                }
            })
            
    }




    get(PATH, callback) {
        this.#get_paths.push({path: PATH, method: "GET", callback})
        
    }


    listen(PORT, log) {

        this.server.listen(PORT, log)
        
    }
}

export default Galleon