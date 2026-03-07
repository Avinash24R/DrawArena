const Room = require("./room")
const genrateRoomcode = require("../utils/roomCode")

class RoomManager{
    constructor(){
        this.rooms = new Map()
    }
    createRoom(hostSocketId){
        let roomId = genrateRoomcode()
        const max_attempts = 50
        
            var limit = 0;
            while (this.rooms.has(roomId)){
                if (limit >= max_attempts){
                    throw new Error("Unable to genratecode unique room code")
                }
                roomId = genrateRoomcode()
                limit++
            }
        const room = new Room(roomId , hostSocketId)

        this.rooms.set(roomId , room)

        return room
    }

    getRoom(roomId){
        return this.rooms.get(roomId)
    }

    joinroom(roomId , player){
        const room = this.rooms.get(roomId)

        if(!room) return null

        room.addPlayer(player)

        return room
    }

    removePlayer(roomId , socketId){
        const room = this.rooms.get(roomId)

        if(!room) return null

        room.removePlayer(socketId)

        room.removePlayer(socketId)
        if(room.player.length === 0){
            this.room.delete(roomId)
        }
    }
}

module.exports = new RoomManager()