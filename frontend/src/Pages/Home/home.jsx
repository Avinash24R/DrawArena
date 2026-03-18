import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';


function Home() {
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        // ask for number of people in the room; default to 2
        const answer = window.prompt("How many people should be in the room?", "2");
        const num = parseInt(answer, 10);
        if (!isNaN(num) && num > 0) {
            navigate('/lobby', { state: { roomSize: num } });
        }
    };

    return (
        <div className="home">
            {/* background circles */}
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />

            <h1>Welcome to Draw App</h1>
            <p>Create a room and invite friends to draw together.</p>
            <div className="create-room">
                <button className="start-button" onClick={handleCreateRoom}>
                    Create Room
                </button>
            </div>
        </div>
    );
}

export default Home;