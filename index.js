import Galleon  from "./src/Galleon.js"

const ship = new Galleon() 
const PORT = 3000 || process.env.PORT


const api_response = [
    {
        emoji: "🚢",
        id: 1,
        data: "Galleon Emoji"

    },
    {
        emoji: "🛳️",
        id: 2,
        data: "Front Galleon"
    }
]


ship.post("/api", (server) => {
    if(!!server)
        console.log(`O título será ${server.body.title}`)
    server.send("POST /api")
})

ship.get("/api", (server) => {
    server.json(api_response)
})

ship.post("/", (server) => {
    server.send("POST /")
})

ship.get("/", (server) => {
    server.sendFile("index.html")
        
})

ship.listen(PORT, _ => console.log(`Server running at http://locahost:${PORT}`))