import React, { useEffect, useRef } from "react";
import { v4 } from "uuid";
import { CompactPicker as SketchPicker } from "react-color";
import io from "socket.io-client";

const socket = io('https://tabula-web.herokuapp.com');
const userId = v4();
const line = [];
const canvasRef = React.createRef();

export default function DrawingCanvas() {
  const guestStrokeStyleRef = useRef("#F0C987");
  const userStrokeStyleRef = useRef("#EE92C2");
  const isPaintingRef = useRef(false);
  const prevPosRef = useRef({ offsetX: 0, offsetY: 0 });

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
          paint(position.start, position.stop, guestStrokeStyleRef.current);
        });
      }
    });

    canvas.onmousedown = function(nativeEvent) {
      const { offsetX, offsetY } = nativeEvent;
      isPaintingRef.current = true;
      prevPosRef.current = { offsetX, offsetY };
    };

    canvas.onmousemove = function(nativeEvent) {
      if (isPaintingRef.current) {
        const { offsetX, offsetY } = nativeEvent;
        const offSetData = { offsetX, offsetY };
        const position = {
          start: { ...prevPosRef.current },
          stop: { ...offSetData },
        };
        line.push(position);
        paint(prevPosRef.current, offSetData, userStrokeStyleRef.current);
      }
    };

    canvas.onmouseup = canvas.onmouseleave = function() {
      if (isPaintingRef.current) {
        isPaintingRef.current = false;
        socket.emit("paint", { line, userId });
        line.splice(0, line.length);
      }
    };

    function paint(prevPos, currPos, strokeStyle) {
      const { offsetX, offsetY } = currPos;
      const { offsetX: x, offsetY: y } = prevPos;
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = strokeStyle;
      ctx.moveTo(x, y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      prevPosRef.current = { offsetX, offsetY };
    }

  }, []);

  function handleColorChange(event) {
    userStrokeStyleRef.current = event.target.value;
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
        <button onClick={() => userStrokeStyleRef.current = "#ffffff"}>White</button>
        <button onClick={() => userStrokeStyleRef.current = "#000000"}>Black</button>
        <button onClick={() => userStrokeStyleRef.current = "#ff0000"}>Red</button>
        <button onClick={() => userStrokeStyleRef.current = "#00ff00"}>Green</button>
        <button onClick={() => userStrokeStyleRef.current = "#0000ff"}>Blue</button>
        <button onClick={() => userStrokeStyleRef.current = "#ffff00"}>Yellow</button>
        <button onClick={() => userStrokeStyleRef.current = "#ff6600"}>Orange</button>
        <button onClick={() => userStrokeStyleRef.current = "#110011"}>Purple</button>
        <SketchPicker
          color={userStrokeStyleRef.current}
          onChangeComplete={(e) => userStrokeStyleRef.current = e.hex}
        />
      </div>
      <div>
        <canvas
          ref={canvasRef}
          style={{ background: "black" }}
        />
      </div>
    </div>
  );
}
