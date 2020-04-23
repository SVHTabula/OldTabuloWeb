import React, { useContext } from "react";
import SocketContext from "../contexts/socket";
import { canvasRef } from "./TheDrawingCanvas";

export default function TheSidebarImageSaver() {
  const { socket } = useContext(SocketContext);

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
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute("download", "output.png");
    downloadLink.setAttribute(
      "href",
      canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    );
    downloadLink.click();
  }

  return (
    <div>
      <input id="fileItem" type="file" onChange={() => openImage()} />
      <br />
      <button onClick={() => saveImage()}>
        Save
      </button>
    </div>
  );
}
