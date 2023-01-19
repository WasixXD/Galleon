
class Client {
    constructor(req, res) {
        this.req = req
        this.res = res 
    }

    get method() {
        return this.req.method
    }

    send(message) {
        this.res.write(message + "\n")
        return this
    }


    end(message) {
        this.res.end(message)
        return this
    }


}



export default Client