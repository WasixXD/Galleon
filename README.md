
<img src="https://github.com/WasixXD/Galleon/blob/master/galleon.png?raw=true" />

### A minimal web development framework for NodeJS 
#### Check the [docs](https://wasixxd.github.io/Galleon/pages/docs.html)
```js
import Galleon from "galleonjs"

const ship = new Galleon() 
const PORT = 3000 || process.env.PORT

ship.get("/", (server) => {
    server.send("AHOY") 
})

ship.listen(PORT, _ => console.log(`Server running at http://locahost:${PORT}`))
```
# Brief 📖
This is a attempt to make a ExpressJS clone without any package (PS: i used one)

# Challenges 🐢
- Use NodeJS default library
- Work with request and response handler
- Send different types of data through the web

# Goals 🏆
- [ x ] Can setup a server
- [ x ] Can respond to GET and POST methods
- [ x ] Send multiple files such as `html`, `jpeg`, `css`, `js`, `json`
- [ x ] has different functions to handle a application

# How it works? 💼
It uses the `node:http` library to create a server and through events can handle HTTP methods

# How to install 🚀
Be sure to use Node >= v18.12.1 
```bash
> npm i galleonjs@latest
```

PS: AHOY!
