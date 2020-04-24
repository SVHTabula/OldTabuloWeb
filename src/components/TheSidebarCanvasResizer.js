import React, { useContext, useState } from "react";
import SocketContext from "../contexts/socket";
import { canvasRef } from "./TheDrawingCanvas";
import useLoadImage from "../hooks/useLoadImage";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import CanvasContext from "../contexts/canvas";

export default function TheSidebarCanvasResizer() {
  const { socket } = useContext(SocketContext);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const loadImage = useLoadImage(canvasRef);

  const { lineColorRef, lineWidthRef } = useContext(CanvasContext);

  function saveBounds(width, height) {
    setWidth(width);
    setHeight(height);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = canvas.toDataURL();
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = lineColorRef.current;
    ctx.lineWidth = lineWidthRef.current;
    loadImage(imageData);
    socket.emit("setCanvasBounds", {height, width});
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', marginTop: 10}}>
      <div style={{display: 'flex'}}>
        <TextField
          label="Width"
          variant="outlined"
          type="number"
          style={{ flexGrow: 0.75, marginRight: 5}}
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />

        <div style={{alignSelf: 'center'}}>x</div>
        <TextField
          label="Height"
          variant="outlined"
          type="number"
          style={{ flexGrow: 0.75, marginLeft: 5}}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <br></br>
      <Button
        onClick={() => saveBounds(width, height)}
        variant="outlined"
        color="primary"
        style={{ flexGrow: 1, margin: 5 }}
      >
        Resize Canvas
      </Button>
      <Button
        onClick={() => saveBounds(window.innerWidth, window.innerHeight)}
        variant="outlined"
        color="primary"
        style={{ flexGrow: 1, margin: 5 }}
      >
        Resize Canvas to Window
      </Button>
    </div>
  );
}
