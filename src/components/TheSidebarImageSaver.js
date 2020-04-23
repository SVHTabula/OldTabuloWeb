import React, { useContext } from "react";
import SocketContext from "../contexts/socket";
import { canvasRef } from "./TheDrawingCanvas";
import useLoadImage from "../hooks/useLoadImage";

export default function TheSidebarImageSaver() {
  const { socket } = useContext(SocketContext);
  const loadImage = useLoadImage(canvasRef);

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
