import Galleon  from "./src/Galleon.js"
import fs from "node:fs"


const ship = new Galleon() 
const PORT = 3000 || process.env.PORT

const json = JSON.parse(fs.readFileSync("./public/data.json"))


ship.source("./public")


ship.post("/api", (server) => {
    if(!!server)
        console.log(`O título será ${server.body.title}`)
    server.send("POST /api")
})

ship.get("/api", (server) => {
    server.json(json)
})

ship.get("/secret", (server) => {
    server.redirect("/api")
})

ship.get("/page", (server) => {
    server.send("/page.html")
})

ship.post("/", (server) => {
    server.send("POST /")
})

ship.get("/", (server) => {
    server.sendFile("/index.html")
        
})

ship.listen(PORT, _ => console.log(`Server running at http://locahost:${PORT}`))