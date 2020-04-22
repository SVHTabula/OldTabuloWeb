import React, { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import { CompactPicker as SketchPicker } from "react-color";
import io from "socket.io-client";

const guestStrokeStyle = "#F0C987";
const line = [];
const userId = v4();
const socket = io(process.env.SERVER_URL);

export default function DrawingCanvas() {
  const [isPainting, setIsPainting] = useState(false);
  const [userStrokeStyle, setUserStrokeStyle] = useState("#EE92C2");
  const [prevPos, setPrevPos] = useState({ offsetX: 0, offsetY: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    socket.on("draw", (data) => {
      const { id, line } = data;
      if (id !== userId) {
        line.forEach((position) => {
          paint(position.start, position.stop, guestStrokeStyle);
        });
      }
    });
  }, []);

  function onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    setIsPainting(true);
    setPrevPos({ offsetX, offsetY });
  }

  function onMouseMove({ nativeEvent }) {
    if (isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      const position = {
        start: { ...prevPos },
        stop: { ...offSetData },
      };
      line.push.apply(position);
      paint(prevPos, offSetData, userStrokeStyle);
    }
  }

  function endPaintEvent() {
    if (isPainting) {
      setIsPainting(false);
      socket.emit("paint", { line, userId });
      line.splice(0, line.length);
    }
  }

  function paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(x, y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setPrevPos({ offsetX, offsetY });
  }

  function handleColorChange(event) {
    setUserStrokeStyle(event.target.value);
  }

  return (
    <div>
      <div>
        <button
          onClick={() => {
            canvasRef.current.getContext("2d").lineWidth -= 10;
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            canvasRef.current.getContext("2d").lineWidth += 10;
          }}
        >
          +
        </button>
      </div>
      <textarea onChange={handleColorChange}></textarea>
      <div>
        <button onClick={() => setUserStrokeStyle("#ffffff")}>White</button>
        <button onClick={() => setUserStrokeStyle("#000000")}>Black</button>
        <button onClick={() => setUserStrokeStyle("#ff0000")}>Red</button>
        <button onClick={() => setUserStrokeStyle("#00ff00")}>Green</button>
        <button onClick={() => setUserStrokeStyle("#0000ff")}>Blue</button>
        <button onClick={() => setUserStrokeStyle("#ffff00")}>Yellow</button>
        <button onClick={() => setUserStrokeStyle("#ff6600")}>Orange</button>
        <button onClick={() => setUserStrokeStyle("#110011")}>Purple</button>
        <SketchPicker
          color={userStrokeStyle}
          onChangeComplete={(e) => setUserStrokeStyle(e.hex)}
        />
      </div>
      <div>
        <canvas
          ref={canvasRef}
          style={{ background: "black" }}
          onMouseDown={onMouseDown}
          onMouseLeave={endPaintEvent}
          onMouseUp={endPaintEvent}
          onMouseMove={onMouseMove}
        />
      </div>
    </div>
  );
}
