import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './lobby.css';

function Lobby() {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomSize } = location.state || { roomSize: 0 };

    // number of people who have joined (including the creator)
    const [joined, setJoined] = useState(1);

    useEffect(() => {
        // in a real app you'd open a websocket/room connection here
        // and update `joined` as other clients arrive.
    }, []);

    const handleSimulateJoin = () => {
        setJoined((prev) => Math.min(prev + 1, roomSize));
    };

    useEffect(() => {
        if (joined >= roomSize && roomSize > 0) {
            // everyone is here, go to the drawing canvas
            navigate('/draw');
        }
    }, [joined, roomSize, navigate]);

    if (roomSize <= 0) {
        return (
            <div className="lobby">
                <h1>Invalid room</h1>
                <p>No room parameters were provided. Go back to the home page.</p>
            </div>
        );
    }

    return (
        <div className="lobby">
            {/* background bubbles */}
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />

            <h1>Lobby</h1>
            <p>Room for {roomSize} players</p>
            <p>{joined} / {roomSize} joined</p>
            {joined < roomSize && <p>Waiting for players to join...</p>}
            <button onClick={handleSimulateJoin}>Simulate player join</button>
        </div>
    );
}

export default Lobby;
