import React, { useContext, useEffect, useRef } from "react";
import TheDrawingCanvasPhoneOutline, { phoneOutlineRef } from "./TheDrawingCanvasPhoneOutline";
import useLoadImage from "../hooks/useLoadImage";

import SocketContext from "../contexts/socket";
import UserContext from "../contexts/user";
import CanvasContext from "../contexts/canvas";

const line = [];
export const canvasRef = React.createRef();

export default function TheDrawingCanvas() {
  const isPaintingRef = useRef(false);
  const prevPosRef = useRef({ offsetX: 0, offsetY: 0 });
  const { socket } = useContext(SocketContext);
  const { userId, isTeacher } = useContext(UserContext);
  const { lineWidthRef, lineColorRef } = useContext(CanvasContext);

  const loadImage = useLoadImage(canvasRef);

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

    socket.on("setPhoneBounds", (bounds) => {
      const { x, y, width, height } = bounds;
      phoneOutlineRef.current.style.left = `${x}px`;
      phoneOutlineRef.current.style.top = `${y}px`;
      phoneOutlineRef.current.style.width = `${width}px`;
      phoneOutlineRef.current.style.height = `${height}px`;
    });

    socket.on("setCanvasBounds", (bounds) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageData = canvas.toDataURL();
      ctx.canvas.width = bounds.width;
      ctx.canvas.height = bounds.height;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = lineColorRef.current;
      ctx.lineWidth = lineWidthRef.current;
      loadImage(imageData);
    })
  });

  useEffect(() => {
    if (!isTeacher) return;
    const canvas = canvasRef.current;

    socket.emit("setCanvasBounds", {
      height: canvas.height,
      width: canvas.width,
    });

    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = lineColorRef.current;
    ctx.lineWidth = lineWidthRef.current;

    canvas.addEventListener("mousedown", (nativeEvent) => {
      const { offsetX, offsetY } = nativeEvent;
      isPaintingRef.current = true;
      prevPosRef.current = { offsetX, offsetY };
      line.push({
        start: { ...prevPosRef.current },
        stop: { ...prevPosRef.current }
      });
    });

    canvas.addEventListener("mousemove", (nativeEvent) => {
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

    canvas.addEventListener("mouseleave", endPaintEvent);
    canvas.addEventListener("mouseup", endPaintEvent);
  });


  return (
    <div id="drawingCanvasContainer" style={{
      width: '100vw',
      height: '100vh',
      overflow: 'auto',
    }}>
      <canvas
        ref={canvasRef}
        id="drawingCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          borderWidth: 1,
          borderColor: 'black',
          borderStyle: 'solid'
        }}
      />
      <TheDrawingCanvasPhoneOutline />
    </div>
  );
}
