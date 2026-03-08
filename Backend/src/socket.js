const {createRoom ,joinRoom, leaveRoom} = require("./gameController/gameController")


function setSocketup(io){
    io.on("connection" , (socket) =>{
        console.log("User Connected:" , socket.id)

        //create room
        socket.on("create_room" ,({playername})  =>{
            const room = createRoom(socket , playername)

            socket.emit("Room Created" , room)
        })

        //join room
        socket.on("join_room" ,({roomId, playername})=>{
            const room = joinRoom(socket , roomId , playername)
            if (!room){
                socket.emit("error", "Room not found")
                return
            }
            socket.data.roomId = roomId
            socket.data.playername = playername
            io.to(roomId).emit("room update" , room)
        }) 


        //chat messages
        socket.on("chat_message" ,({roomId , message})=>{
            io.to(roomId).emit("chat_message" , {
                player: socket.id,
                message
            })
        })
        //drawing
        socket.on("draw" ,({roomId, line})=>{
            socket.to(roomId).emit("draw", line)
        }) 

        //disconnect
        socket.on("disconnect" ,()=>{
            console.log("User disconected:" , socket.id)
            if(socket.data.roomId){
                leaveRoom(socket  , socket.data.roomId)

                io.to(socket.data.roomId).emit("Player_left:" , socket.id)
            }
        })

    })

}
export default { setSocketup }
