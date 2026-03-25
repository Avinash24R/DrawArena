import ChatBox from './chatBox';
import Canvas from '../canvas/canvas';
import './GameArea.css';
import { useLocation } from 'react-router-dom';

function GameArea() {
    const location = useLocation()
    const roomId = location.state?.roomId

    if(!roomId){
        return <h2>NO room found</h2>
    }
    return (
        <div className="game_area">
            <Canvas roomId={roomId} />
            <ChatBox roomId={roomId} />
        </div>
    );
}

export default GameArea;