import { useState , useEffect , useRef} from "react";
import './chatBox.css';

function ChatBox() {
    const [messages , setMessages] = useState([]);
    const [players , setPlayers] = useState([]);
    // message input should be a string, not an array
    const [messageInput , setMessageInput] = useState("");

    // whether players section is expanded
    const [showPlayers, setShowPlayers] = useState(true);

    const bottomRef = useRef(null);

    useEffect(() => {
        // dummy data for testing - only set once on mount
        setPlayers([
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" }
        ]);
        setMessages([
            { player: "Alice", text: "Hello everyone!" },
            { player: "Bob", text: "Let's draw an apple." }
        ]);
    }, []); // empty dependency array

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [messages]);
    /* example
    [
 {id:1, name:"Alice"},
 {id:2, name:"Bob"}
]

[
 {player:"Alice", text:"hello"},
 {player:"Bob", text:"apple"}
]
    */
   function sendMessage(){
    if(messageInput.trim() === "") return

    const newMessage = {
        player: "you",
        text: messageInput
    }
    setMessages(prev => [...prev , newMessage])
    setMessageInput("")
   }
   return (
    <div className="chatbox">

        <div className="playerlist">
            <h3
                className="section_title clickable"
                onClick={() => setShowPlayers((open) => !open)}
            >
                Players {showPlayers ? "▲" : "▼"}
            </h3>

            {showPlayers && players.map(player => (
                <div className="player" key={player.id}>
                    <span className="player_avatar">
                        {player.name[0]}
                    </span>

                    <span className="player_name">
                        {player.name}
                    </span>
                </div>
            ))}
        </div>

        <div className="chatmessages">

            {messages.map((msg , index) => (
                <div className="message" key={index}>

                    <span className="msg_player">
                        {msg.player}
                    </span>

                    <span className="msg_text">
                        {msg.text}
                    </span>

                </div>
            ))}

            <div ref={bottomRef} />

            </div>

            <div className="textbox">

                <input
                    type="text"
                    placeholder="Type your guess..."
                    value={messageInput}
                    onChange={(e)=>setMessageInput(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                            sendMessage()
                        }
                    }}
                />

            </div>

    </div>
);
}

export default ChatBox;