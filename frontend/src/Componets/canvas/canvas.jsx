import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEraser, faFillDrip , faBars } from "@fortawesome/free-solid-svg-icons";
import "./canvas.css";
import {socket} from "../../socket"
function Canvas({roomId}) {

  const [isDrawer, setIsDrawer] = useState(false)
  const [drawerId, setDrawerId] = useState(null)

  const [timer, setTimer] = useState(null)

  const [wordOptions, setWordOptions] = useState([])
  const [wordLength, setWordLength] = useState(null)

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  

  const isDrawing = useRef(false);

  const prevCoord = useRef({ x: 0, y: 0 });
  const [showTools, setShowTools] = useState(false);

  const [currentColor, setCurrentColor] = useState("black");
  const [tool, setTool] = useState("pencil");
  const [strokeSize, setStrokeSize] = useState(5);


  useEffect(() => {

  // 🔥 Drawer must choose word
  socket.on("choose_word", (options) => {
    setWordOptions(options)
  })

  // 🔥 Turn started
  socket.on("turn_started", data => {

    setDrawerId(data.drawer)
    setWordLength(data.length)

    setIsDrawer(socket.id === data.drawer)

    setWordOptions([]) // hide selection UI
  })

  // 🔥 Timer updates
  socket.on("timer", t => setTimer(t))

  return () => {
    socket.off("choose_word")
    socket.off("turn_started")
    socket.off("timer")
  }

}, [])

  useEffect(() => {

  socket.on("draw", line => {

    const ctx = contextRef.current
    if (!ctx) return

    if (line.tool === "pencil") {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = line.color
      ctx.lineWidth = line.size
    }

    if (line.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = line.size
    }

    ctx.beginPath()
    ctx.moveTo(line.from.x, line.from.y)
    ctx.lineTo(line.to.x, line.to.y)
    ctx.stroke()
  })

  socket.on("clear_canvas", () => {
    const ctx = contextRef.current
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  })

  return () => {
    socket.off("draw")
    socket.off("clear_canvas")
  }

  }, [])

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startSketch = (e) => {
    if(!isDrawer) return
    const ctx = contextRef.current;

    if (tool === "bucket") {
      ctx.fillStyle = currentColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.globalCompositeOperation = "source-over";

      socket.emit("draw" , {
        roomId,
        line: {
          type: "fill",
          color: currentColor
        }
      })
      return;
    }

    const { x, y } = getPosition(e);

    isDrawing.current = true;
    prevCoord.current = { x, y };
  };

  const sketch = (e) => {
    if(!isDrawer) return
    if (!isDrawing.current) return;

    const ctx = contextRef.current;
    const { x, y } = getPosition(e);

    if (tool === "pencil") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = strokeSize;
    }

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeSize;
    }

    ctx.beginPath();
    ctx.moveTo(prevCoord.current.x, prevCoord.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    //send to server
    socket.emit("draw" ,{
      roomId,
      line:{
        from: prevCoord.current,
        to: { x ,y},
        color: currentColor,
        size: strokeSize,
        tool

      }
    })

    prevCoord.current = { x, y };
  };

  const stopSketch = () => {
    isDrawing.current = false;
  };

  return (
  <div className="canvas-container">

    {/* ===== TURN INFO ===== */}
    <div className="turn-info">

      <div className="timer">⏱ {timer}s</div>

      {isDrawer ? (
        <div className="role">🎨 You are drawing</div>
      ) : (
        <div className="role">
          ✏️ Guess the word ({wordLength ?? "_"} letters)
        </div>
      )}

    </div>

    {/* ===== WORD CHOICE (Drawer Only) ===== */}
    {isDrawer && wordOptions.length > 0 && (
      <div className="word-select">
        <h3>Choose a word</h3>

        {wordOptions.map(word => (
          <button
            key={word}
            onClick={() => {
              socket.emit("word_selected", { roomId, word })
              setWordOptions([])
            }}
          >
            {word}
          </button>
        ))}

      </div>
    )}

    {/* ===== TOOL TOGGLE (Mobile) ===== */}
    <button
      className="tool-toggle"
      onClick={() => setShowTools(!showTools)}
      aria-label="Toggle tools"
    >
      <FontAwesomeIcon icon={faBars} />
    </button>

    {/* ===== SIDEBAR ===== */}
    <div className={`sidebar ${showTools ? "open" : ""}`}>

      <div className="colors">
        {["red","green","blue","yellow","purple","orange","black","white"].map(color => (
          <div
            key={color}
            className={`color ${currentColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setCurrentColor(color)
              setShowTools(false)
            }}
          />
        ))}
      </div>

      <div className="tools">
        <div
          className={`tool ${tool === "pencil" ? "active" : ""}`}
          onClick={() => { setTool("pencil"); setShowTools(false) }}
        >
          <FontAwesomeIcon icon={faPencil} />
        </div>

        <div
          className={`tool ${tool === "eraser" ? "active" : ""}`}
          onClick={() => setTool("eraser")}
        >
          <FontAwesomeIcon icon={faEraser} />
        </div>

        <div
          className={`tool ${tool === "bucket" ? "active" : ""}`}
          onClick={() => setTool("bucket")}
        >
          <FontAwesomeIcon icon={faFillDrip} />
        </div>

        <div className="stroke-control">

          <label>Brush</label>

          <input
            type="range"
            min="1"
            max="40"
            value={strokeSize}
            onChange={e => setStrokeSize(e.target.value)}
          />

          <span>{strokeSize}px</span>

        </div>

      </div>

    </div>

    {/* ===== CANVAS ===== */}
    <canvas
      ref={canvasRef}
      className="canvas"

      onMouseDown={startSketch}
      onMouseMove={sketch}
      onMouseUp={stopSketch}
      onMouseLeave={stopSketch}

      onTouchStart={startSketch}
      onTouchMove={sketch}
      onTouchEnd={stopSketch}
    />

  </div>
);
}

export default Canvas;