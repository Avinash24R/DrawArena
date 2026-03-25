import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './lobby.css';
import { socket } from '../../socket';

function Lobby() {
    const location = useLocation();
    const { roomSize } = location.state || {}
    const navigate = useNavigate();
    const [joined , setJoined] = useState(1)

    const {roomId , playerName} = location.state || {}
    const [room , setRoom] = useState(null)
    
    
    useEffect(() => {
        if (!roomId) return

        socket.emit("join_room" , {
            roomId,
            playerName: playerName
        })
        socket.on("room_update" , updateRoom => {
            setRoom(updateRoom)
        })
        return ()=>{
            socket.off("room_update")
        }
        
    }, [roomId , playerName]);

    const handleSimulateJoin = () => {
        setJoined((prev) => Math.min(prev + 1, roomSize));
    };
    //Auto start when room is full
    useEffect(() => {
        if (room && room.players.length >= room.maxPlayers) {
            // everyone is here, go to the drawing canvas
            navigate('/draw' , {state: {roomId}});
        }
    }, [room, roomId, navigate]);

    if (!room) {
        return <div
className="lobby">Joining room ...</div>    }


    return (
        <div className="lobby">
            {/* background bubbles */}
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />

            <h1>Lobby</h1>
            <h2>Room Code: {room.roomId}</h2>

            <p>
                {room.players.length} / {room.maxPlayers} players joined
            </p>

            <h3>Players</h3>

            <ul>
                {room.players.map(p => (
                <li key={p.id}>{p.name}</li>
                ))}
            </ul>

            {room.players.length < room.maxPlayers && (
                <p>Waiting for players...</p>
            )}
        </div>
    );
}

export default Lobby;
