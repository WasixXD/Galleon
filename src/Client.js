import { readFileSync, statSync, } from "node:fs"
import { resolve, extname } from "node:path"
import { lookup } from "mime-types"

class Client {
    #body = null
    #source = []
    constructor(req, res) {
        this.req = req
        this.res = res 
    }


    set source(data) {
        this.#source.push(data)
    }

    get source() {
        return this.#body
    }


    set body(data) {
        this.#body = data
        
    }

    get body() {
        return this.#body
    }
    

    get method() {
        return this.req.method
    }

    error(error_message) {
        this.send(error_message)
        return this
    }

    send(message) {
        this.res.write(message + "\n")
        return this
    }


    sendFile(path) {
        
        let dir = ""
        
        if(this.#source.length > 0) dir = this.#source[0][0]
        
        const file_path = resolve(dir + path)
    
        
        const file_type = extname(file_path)

       
      
        const { size } = statSync(file_path)

    
        

        this.res.writeHead(200, {
            'Content-Type' : `${lookup(file_type)}`,
            "Accept": "image/webp",
            'Content-Length': size,
            "X-Content-Type-Options": "nosniff"
        })

        
         let file = readFileSync(file_path)
         
         
        this.res.write(file, "binary")
        
    }


    json(json) {
    
    

        this.res.writeHead(200, {
            "Content-Type": "application/json"

        })

        this.send(JSON.stringify(json))
    }


    redirect(URL) {
   
        this.res.writeHead(302, {
            "Location": "http://" + this.req.headers.host + URL
        })

        this.send()
    }

    end(message) {
        this.res.end(message)
        return this
    }


}



export default Client