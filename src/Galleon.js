import Client from "./Client.js"
import { createServer } from "node:http";
import { existsSync } from "node:fs"
import { readdir, lstat } from "node:fs/promises";
import { Buffer } from "node:buffer"
import { resolve, basename } from "node:path";
import { URL } from "node:url";
import { resourceUsage } from "node:process";


class Galleon {
    #get_paths = []
    #post_paths = []
    #source_paths = []
    
    constructor() {
        
        //#TODO: Make middlewares work as expressjs
        this.server = createServer()
        .on("request", async (request, response) => {
        
            //Handle some types of HTTP methods

            
            let ship = new Client(request, response)

    
                if(request.method === "GET") {
                    
                    
                    this.#get_paths.forEach((value) => {
                        
                    
                        let haveFather_n_equalURL = (value.father && "/" + basename(value.father) + value.path == request.url)
                        if(value.path == request.url || haveFather_n_equalURL || !!value.receive) {
                            //if it a .get() it should have a callback
                            if(!!value.callback) {
                                // se eu tiver sources para seguir -> ent eu quero arquivos a partir desse source
                                
                                if(request.url.includes(value.path) && !!value.receive){
                                    
                                    //#TODO: chain dynamic routes
                                    ship.params[value.receive] = request.url.slice(request.url.lastIndexOf('/') + 1, request.url.length)
                                    
                                
                                } 

                                if(this.#source_paths.length > 0) ship.source = this.#source_paths
                                value.callback(ship)
 
                            } else {
                                 //arquivo extras pra mandar
                                for(let _ of this.#source_paths) {
                                
                                    ship.sendFile(value.father + value.path)
                                }
                            }

                        }
                    })
                    
                }
                
                if(request.method == "POST") {
                    //ver algum body no post
                    await request.on("data", (data) => {
                        let reader = Buffer.from(data).toString("utf-8")

                        if(request.headers['content-type'] == "application/json"){
                            ship.body = JSON.parse(reader)
                        }

                        
                    
                    
                    })
                
                   

                    this.#post_paths.forEach( (value) => {
                        if(value.path == request.url) 
                             value.callback(ship)
                    })
                    
                }
                
                
                
                
                response.end("")
                
            })
        .on("error", (err) => {
            
            throw new Error(err)
        })
            
    }



    get(PATH, callback) {
        let properties = {path: PATH, method: "GET", callback}
        if(PATH.includes(":")) {
            let numberOfParams = PATH.match(/:/g || [])
            if(numberOfParams.length > 1) {
                properties.receive = []
                let occurrencie = PATH.split("/:")
                for(let i = 1; i < occurrencie.length; i++) {
                    properties.receive.push(occurrencie[i])

                }
            } else {

                properties.receive = PATH.slice(PATH.lastIndexOf(":"), PATH.length).replace(":", "")
            }
            properties.path = PATH.slice(0, PATH.lastIndexOf(":")).replace(":", "")
        }
        this.#get_paths.push(properties)
        
    }


    post(PATH, callback) {
        this.#post_paths.push({path: PATH, method: "POST", callback})
    }


    async source(PATH) {
        const directoryExist = existsSync(resolve(PATH))
        this.#source_paths.push(PATH)
    
        if(directoryExist) {
            const files = await readdir(resolve(PATH))
            
            for(const file of files) {
                let full_path = PATH + "/" + file            
                let isDirectory = (await lstat(full_path)).isDirectory()
                //if it is a directory, get all paths inside
                if(isDirectory) await this.source(full_path)
                
                //else push for the get section
                if(!isDirectory) this.#get_paths.push({father: PATH, path: "/" + file, method: "GET"})
            }

        
        }
    } 




    listen(PORT, log) {

        this.server.listen(PORT, log)
        
    }
}

export default Galleon