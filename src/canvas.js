import React, { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import io from 'socket.io-client';

const userStrokeStyle = "#EE92C2";
const guestStrokeStyle = "#F0C987";
const line = [];
const userId = v4();
const socket = io(process.env.SERVER_URL);

export default function DrawingCanvas() {
  const [isPainting, setIsPainting] = useState(false);
  const [prevPos, setPrevPos] = useState({ offsetX: 0, offsetY: 0});
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    cv.width = 1000;
    cv.height = 800;
    const ctx = cv.getContext("2d");
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
      socket.emit('paint', { line, userId });
      line.splice(0, line.length);
    }
  }

  function paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    const ctx = canvas.current.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(x, y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setPrevPos({ offsetX, offsetY });
  }

  return (
    <div>
      <button
        onClick={() => {
          canvas.current.getContext('2d').lineWidth -= 10;
        }}
      >
        -
      </button>
      <button
        onClick={() => {
          canvas.current.getContext('2d').lineWidth += 10;
        }}
      >
        +
      </button>
      <canvas
        ref={canvas}
        style={{ background: "black" }}
        onMouseDown={onMouseDown}
        onMouseLeave={endPaintEvent}
        onMouseUp={endPaintEvent}
        onMouseMove={onMouseMove}
      />
    </div>
  );
}