import Client from "./Client.js"
import { createServer } from "node:http";
import { existsSync } from "node:fs"
import { readdir, lstat } from "node:fs/promises";
import { Buffer } from "node:buffer"
import { resolve, basename } from "node:path";


class Galleon {
    #get_paths = []
    #post_paths = []
    #source_paths = []
    
    constructor() {
        
        //#TODO: Make middlewares work as expressjs
        this.server = createServer()
        .on("request", async (request, response) => {
        
            //Handle all types of HTTP methods
            console.log("\n", request.method, request.url, "from Galleon")
            
            let ship = new Client(request, response)

    
                if(request.method === "GET") {
                    
                    //#TODO: Change the get_maps from Array to Map

                    this.#get_paths.forEach((value) => {
                        
                    
                        let haveFather_n_equalURL = (value.father && "/" + basename(value.father) + value.path == request.url)
                        if(value.path == request.url || haveFather_n_equalURL) {
                            //if it a .get() it should have a callback
                            if(!!value.callback) {
                                // se eu tiver sources para seguir -> ent eu quero arquivos a partir desse source
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

                        console.log(`Received: ${ship.body}`)
                    
                    
                    })
                
                   

                    this.#post_paths.forEach( (value) => {
                        if(value.path == request.url) 
                             value.callback(ship)
                    })
                    
                }
                
                
                
                
                response.end("")
                
            })
        .on("error", (err) => {
            
            throw new Error("mai que carai")
        })
            
    }



    get(PATH, callback) {
        this.#get_paths.push({path: PATH, method: "GET", callback})
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