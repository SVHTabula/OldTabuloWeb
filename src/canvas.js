import React, { useEffect, useRef } from "react";
import { v4 } from "uuid";
import { CompactPicker as SketchPicker } from "react-color";
import io from "socket.io-client";

const socket = io('https://tabula-web.herokuapp.com');
const userId = v4();
const line = [];
const canvasRef = React.createRef();

export default function DrawingCanvas() {
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
          paint(position.start, position.stop, userStrokeStyleRef.current);
        });
      }
    });
    socket.on("newColor", (data) => {
      userStrokeStyleRef.current = data;
    });
    socket.on("newWidth", (data) => {
      ctx.lineWidth = data;
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
    userStrokeStyleRef.current = event;
    socket.emit("colorChange", event);
  }

  function handleLineWidth(difference) {
    canvasRef.current.getContext("2d").lineWidth += difference;
    socket.emit("widthChange", canvasRef.current.getContext("2d").lineWidth);
  }

  return (
    <div>
      <div>
        <button
          onClick={() => {
            handleLineWidth(-10);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            handleLineWidth(10);
          }}
        >
          +
        </button>
      </div>
      <div>
        <SketchPicker
          color={userStrokeStyleRef.current}
          onChangeComplete={(e) => handleColorChange(e.hex)}
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
