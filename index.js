import Galleon  from "./src/Galleon.js"

const ship = new Galleon() 
const PORT = 3000 || process.env.PORT

ship.get("/oi", (server) => {
    server.send("Oi do /oi")
})

ship.get("/", (server) => {
    server.send("OI do /")
        
})

ship.listen(PORT, _ => console.log(`Server running at http://locahost:${PORT}`))