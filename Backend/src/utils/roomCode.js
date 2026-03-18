// Genrates unique room code

const characterset = "ABCDEFGHIJKLMNOPQRSTUVQXYZ1234567890";

function genrateRoomcode(length = 6){
    let code = ""

    for (let i = 0; i<length; i++){
        const randomIndex = Math.floor(Math.random() * characterset.length);

        code += characterset[randomIndex];
    }

    return code;
}

module.exports = genrateRoomcode;