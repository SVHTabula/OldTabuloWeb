import React, { useContext, useState, useEffect } from "react";
import { CompactPicker as SketchPicker } from "react-color";
import SocketContext from "../contexts/socket";
import CanvasContext from "../contexts/canvas";
import { canvasRef } from "./DrawingCanvas";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ColorPicker() {
  const { lineColorRef, lineWidthRef } = useContext(CanvasContext);
  const { socket } = useContext(SocketContext);

  const [lineColor, setColor] = useState(lineColorRef.current);
  const [lineWidth, setWidth] = useState(lineWidthRef.current);

  function loadImage(url) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = url;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  }
  function openImage() {
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        loadImage(reader.result);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }
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
    <div style={{ padding: 20 }}>
      <div>
        <Slider onChange={(value) => setLineWidth(value)} />
        <p>{lineWidth}</p>
      </div>
      <div>
        <SketchPicker
          color={lineColor}
          onChangeComplete={(e) => setLineColor(e.hex)}
        />
      </div>
      <input id="fileItem" type="file" onChange={() => openImage()}/>
    </div>
  );
}
