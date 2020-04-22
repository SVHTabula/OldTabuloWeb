import React, { useContext, useEffect, useRef } from "react";

import SocketContext from '../contexts/socket';
import UserContext from "../contexts/user";
import CanvasContext from "../contexts/canvas";

const line = [];
export const canvasRef = React.createRef();

export default function DrawingCanvas() {
  const isPaintingRef = useRef(false);
  const prevPosRef = useRef({ offsetX: 0, offsetY: 0 });
  const { socket } = useContext(SocketContext);
  const { userId } = useContext(UserContext);
  const { lineWidthRef, lineColorRef } = useContext(CanvasContext);

  function paint(prevPos, currPos) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = lineColorRef.current;
    ctx.lineWidth = lineWidthRef.current;
    ctx.moveTo(x, y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    prevPosRef.current = { offsetX, offsetY };
  }

  useEffect(() => {
    socket.on("draw", (data) => {
      const { id, line } = data;
      if (id !== userId) {
        line.forEach((position) => {
          paint(position.start, position.stop);
        });
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = lineColorRef.current;
    ctx.lineWidth = lineWidthRef.current;

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
        paint(prevPosRef.current, offSetData, lineColorRef.current);
      }
    };

    canvas.onmouseup = canvas.onmouseleave = function() {
      if (isPaintingRef.current) {
        isPaintingRef.current = false;
        socket.emit("paint", { line, userId });
        line.splice(0, line.length);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ background: "black" }}
    />
  );
}
