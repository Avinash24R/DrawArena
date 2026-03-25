import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {socket} from "../../socket"
import './home.css';


function Home() {

  const navigate = useNavigate()

  const [playerName, setPlayerName] = useState("")
  const [roomSize, setRoomSize] = useState(2)
  const [roomCode, setRoomCode] = useState("")

  useEffect(() => {

    // ✅ Room created (host)
    socket.on("room_created", room => {
      navigate("/lobby", {
        state: {
          roomId: room.roomId,
          playerName
        }
      })
    })

    // ✅ Joined room successfully (guest)
    socket.on("room_update", room => {
      navigate("/lobby", {
        state: {
          roomId: room.roomId,
          playerName
        }})
        
    })

    // ❌ Error handler
    socket.on("error", msg => {
      alert(msg)
    })

    return () => {
      socket.off("room_created")
      socket.off("room_update")
      socket.off("error")
    }

  }, [navigate, playerName])

  // 🔥 CREATE ROOM
  const handleCreateRoom = () => {

    if (!playerName) {
      alert("Enter your name")
      return
    }

    socket.emit("create_room", {
      playername: playerName,
      maxPlayers: roomSize
    })
  }

  // 🔥 JOIN ROOM
  const handleJoinRoom = () => {

    if (!playerName || !roomCode) {
      alert("Enter name and room code")
      return
    }

    socket.emit("join_room", {
      roomId: roomCode.toUpperCase(),
      playername: playerName
    })
  }

  return (
    <div className="home">

      <h1>Draw Game</h1>

      <input
        placeholder="Your name"
        value={playerName}
        onChange={e => setPlayerName(e.target.value)}
      />

      <h2>Create Room</h2>

      <input
        type="number"
        min="2"
        max="10"
        value={roomSize}
        onChange={e => setRoomSize(e.target.value)}
      />

      <button onClick={handleCreateRoom}>
        Create Room
      </button>

      <h2>Join Room</h2>

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={e => setRoomCode(e.target.value)}
      />

      <button onClick={handleJoinRoom}>
        Join Room
      </button>

    </div>
  )
}

export default Home