import { createReadStream, readFileSync, statSync, } from "node:fs"
import { join, resolve } from "node:path"


class Client {
    #body = null
    constructor(req, res) {
        this.req = req
        this.res = res 
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
        const file_path = resolve(path)
        
        const { size } = statSync(file_path)
        this.res.writeHead(200, {
            'Content-Type' : "text/html; charset=UTF-8",
            'Content-Length': size
        })

         let file = readFileSync(file_path)
         this.send(file)
        
    }


    json(json) {
        console.log(json)
    

        this.res.writeHead(200, {
            "Content-Type": "application/json"

        })

        this.send(JSON.stringify(json))
    }


    end(message) {
        this.res.end(message)
        return this
    }


}



export default Client