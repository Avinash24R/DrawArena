import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEraser, faFillDrip , faBars } from "@fortawesome/free-solid-svg-icons";
import "./canvas.css";

function Canvas() {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  

  const isDrawing = useRef(false);
  const prevCoord = useRef({ x: 0, y: 0 });
  const [showTools, setShowTools] = useState(false);

  const [currentColor, setCurrentColor] = useState("black");
  const [tool, setTool] = useState("pencil");
  const [strokeSize, setStrokeSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = strokeSize;

      contextRef.current = ctx;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

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
    const ctx = contextRef.current;

    if (tool === "bucket") {
      ctx.fillStyle = currentColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.globalCompositeOperation = "source-over";
      return;
    }

    const { x, y } = getPosition(e);

    isDrawing.current = true;
    prevCoord.current = { x, y };
  };

  const sketch = (e) => {
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

    prevCoord.current = { x, y };
  };

  const stopSketch = () => {
    isDrawing.current = false;
  };

  return (
    <div className="canvas-container">

      <button
        className="tool-toggle"
        onClick={() => setShowTools(!showTools)}
        aria-label="Toggle tools"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={`sidebar ${showTools ? 'open' : ''}`}>

        <div className="colors">
          {["red","green","blue","yellow","purple","orange","black","white" ].map((color) => (
            <div
              key={color}
              className={`color ${currentColor === color ? "active" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => {setCurrentColor(color); setShowTools(false);}}
            />
          ))}
        </div>

        <div className="tools">
          <div
            className={`tool ${tool === "pencil" ? "active" : ""}`}
            onClick={() => {
  setTool("pencil")
  setShowTools(false)
}}
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
            onChange={(e) => setStrokeSize(e.target.value)}
        />

        <span>{strokeSize}px</span>

        </div>
        </div>
        

      </div>

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