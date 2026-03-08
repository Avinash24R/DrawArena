const roomManager = require("./rooms/roomManager")
const handleCorrectGuess = require("./utils/HandleCorrectGuess")
const { createRoom, joinRoom, leaveRoom } = require("./gameController/gameController")

function setSocketup(io){
    io.on("connection" , (socket) =>{
        console.log("User Connected:" , socket.id)

        //create room
        socket.on("create_room" ,({playername})  =>{
            const room = createRoom(socket , playername)

            socket.data.roomId = room.roomId
            socket.data.playername = room.playername

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

        // guess
        socket.on("guess" ,({roomId , message})=>{
            const room  = roomManager.getRoom(roomId)

            if(!room) return
            if(!room.currentWord) return

            const guess = message.trim().toLowerCase()

            const currentWord = room.currentWord.toLowerCase()

            // prevent drawer guessing
            if(socket.id === room.currentDrawer) return

            // prevent multiple guesses
            if(room.correctGuessers.has(socket.id)) return

            if(guess === currentWord){
                room.correctGuessers.add(socket.id)
                handleCorrectGuess(room , socket.id)
                io.to(room.roomId).emit("correct_guess", {
                    guesserId:socket.id,
                    word: room.currentWord,
                    players: room.players

                })
            }else{
                io.to(roomId).emit("chat_message", {
                player: socket.id,
                message
            })
            }
        })
        //drawing
        socket.on("draw" ,({roomId, line})=>{
            const room = roomManager.getRoom(roomId)

            if(!room) return
            // only drawer can draw 
            if(socket.id !== room.currentDrawer) return
            socket.to(roomId).emit("draw", line)
        }) 

        //disconnect
        socket.on("disconnect" ,()=>{
            console.log("User disconected:" , socket.id)
            if(socket.data.roomId){
                leaveRoom(socket  , socket.data.roomId)

                io.to(socket.data.roomId).emit("Player_left" , socket.id)
            }
        })

    })

}
export default { setSocketup }
