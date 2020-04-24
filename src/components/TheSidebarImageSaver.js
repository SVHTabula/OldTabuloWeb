import React, { useContext, useEffect } from "react";
import SocketContext from "../contexts/socket";
import { canvasRef } from "./TheDrawingCanvas";
import useLoadImage from "../hooks/useLoadImage";
import { Button } from "@material-ui/core";

export default function TheSidebarImageSaver() {
  const { socket } = useContext(SocketContext);
  const loadImage = useLoadImage(canvasRef);

  useEffect(() => {
    socket.on("clearCanvas", () => {
      clearCanvas();
    });
  });

  function openImage() {
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        loadImage(reader.result);
        socket.emit("updateImage", reader.result);
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function saveImage() {
    const canvas = canvasRef.current;
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "output.png");
    downloadLink.setAttribute(
      "href",
      canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
    downloadLink.click();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (
      window.confirm(
        "Are you sure you want to create a new canvas?\nYOU WILL LOSE ANY UNSAVED DATA!"
      )
    ) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit("clearCanvas", true);
    }
  }

  return (
    <div>
      <input
        id="fileItem"
        type="file"
        onChange={() => openImage()}
        style={{ display: "none" }}
      />
      <div style={{ display: "flex", flexDirection: "column", marginTop: 20, color: 'var(--background)' }}>
        <Button
          onClick={() => clearCanvas()}
          variant="outlined"
          color="primary"
          style={{ flexGrow: 1, margin: 5 }}
        >
          New
        </Button>
        <label htmlFor="fileItem" style={{ display: "flex", flexGrow: 1, margin: 10 }}>
          <Button
            component="div"
            variant="contained"
            color="primary"
            style={{ flexGrow: 1 }}
          >
            Open
          </Button>
        </label>
        <Button
          onClick={() => saveImage()}
          variant="contained"
          color="secondary"
          style={{ flexGrow: 1, margin: 5 }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
