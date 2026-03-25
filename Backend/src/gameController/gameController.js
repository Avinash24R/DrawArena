const  roomManager = require("../rooms/roomManager")

function createRoom(socket , playerName, maxPlayers){
    const room = roomManager.createRoom(socket.id , maxPlayers)

    const player = {
        id: socket.id,
        name: playerName,
        score: 0
    }

    room.addPlayer(player)

    socket.join(room.roomId)

    return room
}
function joinRoom(socket , roomId , playerName){
    const player = {
        id: socket.id,
        name: playerName,
        score: 0
    }

    const room = roomManager.joinRoom(roomId ,player)

    if(!room){
        return null
    }
    socket.join(roomId)

    return room
}

function leaveRoom(socket , roomId){
    roomManager.removePlayer(roomId , socket.id)

    socket.leave(roomId)

}

module.exports = {createRoom ,joinRoom , leaveRoom};