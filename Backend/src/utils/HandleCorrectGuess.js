

function handleCorrectGuess(room, guesserId){

    const guesser = room.getPlayer(guesserId)

    const drawer = room.getPlayer(room.currentDrawer)

    if(!guesser || !drawer) return

    guesser.score += 2
    drawer.score += 1

}

export default {handleCorrectGuess}