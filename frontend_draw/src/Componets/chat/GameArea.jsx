import ChatBox from './chatBox';
import Canvas from '../canvas/canvas';
import './GameArea.css';

function GameArea() {
    return (
        <div className="game_area">
            <Canvas />
            <ChatBox />
        </div>
    );
}

export default GameArea;