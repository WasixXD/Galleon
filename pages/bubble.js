const canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let svg = document.querySelector(".copy").addEventListener("click", () => {
    let text= "npm i galleonjs@latest"
    navigator.clipboard.writeText(text)
})


class Bubble {

    constructor(x, y, radius, color, speed, opacity) {
        this.x = x
        this.y = y
        this.radius = radius 
        this.color = color
        this.speed = speed
        this.opacity = opacity
    }


    update() {
        
        
        if(this.y >= canvas.height + this.radius || this.y < 0) {
            this.y = Math.floor(Math.random() * innerHeight - this.radius)
        }
 
        
        // this.x += this.speed

        this.y -= this.speed
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgb(219, 223, 172, ${this.opacity}%)`
    
        ctx.stroke()
        this.update()
        
    }
}

let bubbles = []

function createBubbles() {
    for(let i = 0; i < 60; i++) {
        let radius = Math.floor(Math.random() * 20)
        let x = Math.floor(Math.random() * canvas.width) - radius
        let y = Math.floor(Math.random() * innerHeight) - radius
        let speed = (Math.random() * 3) + 1
        let opacity = Math.floor(Math.random() * 100) + 15
        bubbles.push(new Bubble(x, y, radius, "#DBDFAC", speed, opacity))
    }

}


function init() {
    requestAnimationFrame(init)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

   
    for(let bubble of bubbles) {

        bubble.draw()
    }
}

createBubbles()
init()