import React, { useContext } from "react";
import { CompactPicker as SketchPicker } from "react-color";
import SocketContext from "../contexts/socket";
import CanvasContext from "../contexts/canvas";
import { canvasRef } from "./DrawingCanvas";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';

export default function ColorPicker() {
  const { lineColorRef, lineWidthRef } = useContext(CanvasContext);
  const { socket } = useContext(SocketContext);

  function setLineColor(lineColor) {
    lineColorRef.current = lineColor;
    canvasRef.current.getContext("2d").strokeStyle = lineColor;
    socket.emit("setColor", lineColor);
  }

  function setLineWidth(lineWidth) {
    lineWidthRef.current = lineWidth;
    canvasRef.current.getContext("2d").lineWidth = lineWidth;
    socket.emit("setWidth", lineWidth);
  }

  return (
    <div>
      <div>
        <Slider onChange={(value) => setLineWidth(value)}/>
        <p>{lineWidthRef.current}</p>
        <button onClick={() => setLineWidth(lineWidthRef.current - 10)}>
          -
        </button>
        <button onClick={() => setLineWidth(lineWidthRef.current + 10)}>
          +
        </button>
      </div>
      <div>
        <SketchPicker
          color={lineColorRef.current}
          onChangeComplete={(e) => setLineColor(e.hex)}
        />
      </div>
    </div>
  );
}
