import React, { useContext, useEffect, useRef } from "react";
import PhoneOutline, { phoneOutlineRef } from "./PhoneOutline";

import SocketContext from "../contexts/socket";
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
    socket.on("paint", (data) => {
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    //loadImage("https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fkimcampion.com%2Fwp-content%2Fuploads%2F2015%2F06%2Fwild_lion-1600x1200.jpg");

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = lineColorRef.current;
    ctx.lineWidth = lineWidthRef.current;

    canvas.addEventListener('mousedown', (nativeEvent) => {
      const { offsetX, offsetY } = nativeEvent;
      isPaintingRef.current = true;
      prevPosRef.current = { offsetX, offsetY };
    });

    canvas.addEventListener('mousemove', (nativeEvent) => {
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
    });

    function endPaintEvent() {
      if (isPaintingRef.current) {
        isPaintingRef.current = false;
        socket.emit("paint", { line, userId });
        line.splice(0, line.length);
      }
    }

    canvas.addEventListener('mouseleave', endPaintEvent);
    canvas.addEventListener('mouseup', endPaintEvent);
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      canvas.getContext('2d').canvas.width = window.innerWidth;
      canvas.getContext('2d').canvas.height = window.innerHeight;
      socket.emit('setCanvasBounds', {
        height: window.innerHeight,
        width: window.innerWidth
      })
    });

    socket.on('setPhoneBounds', (bounds) => {
      const {x, y, width, height} = bounds;
      phoneOutlineRef.current.style.left = `${x}px`;
      phoneOutlineRef.current.style.top = `${y}px`;
      phoneOutlineRef.current.style.width = `${width}px`;
      phoneOutlineRef.current.style.height = `${height}px`;
    });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} id="drawingCanvas" />
      <PhoneOutline />
    </div>
  );
}
