import React, { useContext, useState, useEffect } from "react";
import SocketContext from "../contexts/socket";
import CanvasContext from "../contexts/canvas";
import { canvasRef } from "./TheDrawingCanvas";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function TheSidebarWidthSlider() {
  const { lineWidthRef } = useContext(CanvasContext);
  const { socket } = useContext(SocketContext);

  const [lineWidth, setWidth] = useState(lineWidthRef.current);

  useEffect(() => {
    lineWidthRef.current = lineWidth;
  });

  function setLineWidth(lineWidth) {
    setWidth(lineWidth);
    canvasRef.current.getContext("2d").lineWidth = lineWidth;
    socket.emit("setWidth", lineWidth);
  }

  return (
    <div>
      <Slider onChange={(value) => setLineWidth(value)} />
      <p>Brush size: {lineWidth+1}px</p>
    </div>
  );
}
