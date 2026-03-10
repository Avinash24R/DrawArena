const fs = require("fs");
const path = require("path")

const filePath = path.join(__dirname, "word.txt");

const data = fs.readFileSync(filePath, "utf8");

const words = data.split(/\r?\n/).map(w => w.trim()).filter(Boolean);

function  getNextDrawer(room){
    const index = room.turnIndex % room.players.length

    return room.players[index]
}

function getWordOptions(){

  const shuffled = [...words].sort(()=>0.5-Math.random())

  return shuffled.slice(0,3)

}

function startTurn(io, room){

  const drawer = room.players[room.turnIndex % room.players.length]

  room.currentDrawer = drawer.id

  const options = getWordOptions()

  io.to(drawer.id).emit("choose_word", options)

}

function startTimer(io, room){
    
  if(room.timerInterval){
     clearInterval(room.timerInterval)
  } 
  room.timer = 60

  room.timerInterval = setInterval(()=>{

     room.timer--

     io.to(room.roomId).emit("timer", room.timer)

     if(room.timer <= 0){

        clearInterval(room.timerInterval)
        room.timerInterval = null

        endTurn(io, room)

     }

  },1000)

}

function endTurn(io, room){
    if(room.timerInterval){
      clearInterval(room.timerInterval)
      room.timerInterval = null
   }

   io.to(room.roomId).emit("turn_end", {
       word: room.currentWord
   })

   room.turnIndex++

   room.correctGuessers.clear()

   io.to(room.roomId).emit("clear_canvas")

   checkRound(io, room)

}

function checkRound(io, room){

  if(room.turnIndex % room.players.length === 0){

     room.round++

     if(room.round > room.maxRounds){

        io.to(room.roomId).emit("game_over", room.players)
        return

     }

  }

  startTurn(io, room)

}

module.exports = {
  getNextDrawer,
  getWordOptions,
  startTurn,
  startTimer,
  endTurn,
  checkRound
}