import React, { useContext, useState, useEffect } from "react";
import { CompactPicker as SketchPicker } from "react-color";
import SocketContext from "../contexts/socket";
import CanvasContext from "../contexts/canvas";
import { canvasRef } from "./DrawingCanvas";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

export default function ColorPicker() {
  const { lineColorRef, lineWidthRef } = useContext(CanvasContext);
  const { socket } = useContext(SocketContext);

  const [lineColor, setColor] = useState(lineColorRef.current);
  const [lineWidth, setWidth] = useState(lineWidthRef.current);

  useEffect(() => {
    lineColorRef.current = lineColor;
  }, [lineColor]);

  useEffect(() => {
    lineWidthRef.current = lineWidth;
  }, [lineWidth]);

  function setLineColor(lineColor) {
    setColor(lineColor);
    canvasRef.current.getContext("2d").strokeStyle = lineColor;
    socket.emit("setColor", lineColor);
  }

  function setLineWidth(lineWidth) {
    setWidth(lineWidth);
    canvasRef.current.getContext("2d").lineWidth = lineWidth;
    socket.emit("setWidth", lineWidth);
  }

  return (
    <div style={{padding: 20}}>
      <div>
        <Slider onChange={(value) => setLineWidth(value)}/>
        <p>{lineWidth}</p>
      </div>
      <div>
        <SketchPicker
          color={lineColor}
          onChangeComplete={(e) => setLineColor(e.hex)}
        />
      </div>
    </div>
  );
}
