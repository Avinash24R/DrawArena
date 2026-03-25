const Room = require("./room")
const genrateRoomcode = require("../utils/roomCode")

class RoomManager{
    constructor(){
        this.rooms = new Map()
    }
    createRoom(hostSocketId , maxPlayers){
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
        const room = new Room(roomId , hostSocketId , maxPlayers)

        this.rooms.set(roomId , room)

        return room
    }

    getRoom(roomId){
        return this.rooms.get(roomId)
    }

    joinRoom(roomId , player){
        const room = this.rooms.get(roomId)

        if(!room) return null

        room.addPlayer(player)

        return room
    }

    removePlayer(roomId , socketId){
        const room = this.rooms.get(roomId)

        if(!room) return null

        room.removePlayer(socketId)

        if(room.players.length === 0){
            this.rooms.delete(roomId)
        }
    }
}

module.exports = new RoomManager()