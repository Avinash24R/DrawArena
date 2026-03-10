const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const { setSocketup } = require("./socket")

const app = express()
app.use(express.json())

//create HTTP Server

const server = http.createServer(app)

const io = new Server(server , {
    cors :{
        origin :"*",
        methods: ["GET" ,"POST"]
    }
})

setSocketup(io)

app.get("/" ,(req, res)=>{
    res.send("Drawing Game Server Running")
})

const PORT = 5000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})