/*
each room has a 
uquie id , 
host ,
players : [{id : socketId, name , score} , ...],
status : "waiting" ,// playing , finished
maxpalyer : 8,
currentDrawer : null , 
currentWord : null ,

round : 0,

maxround : 5 ,

timer : 60s 

*/

class Room {
    constructor(roomId , hostSocketId) {
        this.roomId = roomId
        this.host = hostSocketId

        this.players = []

        this.status = "waiting"
        this.currentDrawer = null
        this.currentWord = null
        this.round = 1

        this.maxrounds = 3
        this.turnIndex = 0 
        this.timer = 60
        this.timeInterval = null

        this.correctGuessers = new Set()
    }
    addPlayer(player){
        this.players.push(player)
    }
    removePlayer(socketId){
        this.players = this.players.filter(
            player => player.id != socketId
        )
    }

    getPlayer(socketId){
        return this.players.find(
            player => player.id === socketId
        )
    }
}

module.exports = Room