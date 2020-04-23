import React, { useState, useRef, useEffect, Fragment } from "react";
import "./App.css";
import TheDrawingCanvas, { canvasRef } from "./components/TheDrawingCanvas";
import TheDrawingCanvasSaveButton from "./components/TheDrawingCanvasSaveButton";
import TheSidebar from "./components/TheSidebar";
import SocketContext from "./contexts/socket";
import UserContext from "./contexts/user";
import CanvasContext from "./contexts/canvas";
import RoomContext from "./contexts/room";

import io from "socket.io-client";
import { v4 } from "uuid";
import useLoadImage from "./hooks/useLoadImage";
import TheRoomEntryScreen from "./components/TheRoomEntryScreen";

const socket = io("https://tabula-web.herokuapp.com");

export default function App() {
  const userId = useRef(v4());
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef("#ffffff");
  const loadImage = useLoadImage(canvasRef);

  const [roomId, setRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    if (roomId) {
      socket.on("setWidth", (width) => {
        lineWidthRef.current = width;
      });

      socket.on("setColor", (color) => {
        lineColorRef.current = color;
      });

      function handleResize() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = canvas.toDataURL();
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = lineColorRef.current;
        ctx.lineWidth = lineWidthRef.current;
        loadImage(imageData);
        socket.emit("setCanvasBounds", {
          height: window.innerHeight,
          width: window.innerWidth,
        });
      }

      window.addEventListener("resize", handleResize);
      handleResize();
    }
  });

  return (
    <Fragment>
      <div className="main" style={{position: 'relative'}}>
        <SocketContext.Provider value={{ socket }}>
          <UserContext.Provider
            value={{
              userId: userId.current,
              isTeacher,
              setIsTeacher
            }}
          >
            <CanvasContext.Provider
              value={{
                lineWidthRef,
                lineColorRef,
              }}
            >
              <RoomContext.Provider value={{
                roomId, setRoomId,
                joinPassword, setJoinPassword,
                adminPassword, setAdminPassword
              }}>
                {roomId && isTeacher ? <TheSidebar/> : null }
                {roomId ?
                  <>
                    <TheDrawingCanvas />
                    <TheDrawingCanvasSaveButton />
                  </> : null }
                {!roomId ? <TheRoomEntryScreen /> : null }
              </RoomContext.Provider>
            </CanvasContext.Provider>
          </UserContext.Provider>
        </SocketContext.Provider>
      </div>
    </Fragment>
  );
}
