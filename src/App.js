import React, { useState, useRef, useEffect, Fragment } from 'react';
import './App.css';
import TheDrawingCanvas, {canvasRef} from './components/TheDrawingCanvas';
import TheSidebar from './components/TheSidebar';
import SocketContext from './contexts/socket';
import UserContext from './contexts/user';
import CanvasContext from "./contexts/canvas";

import io from "socket.io-client";
import { v4 } from 'uuid';
import useLoadImage from "./hooks/useLoadImage";
import TheAccountDialog from "./components/TheAccountDialog";

const socket = io('https://tabula-web.herokuapp.com');

export default function App() {
  const userId = useRef(v4());
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef('#ffffff');
  const loadImage = useLoadImage(canvasRef);

  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    if (joinedRoom) {
      socket.on("setWidth", (width) => {
        lineWidthRef.current = width;
      });

      socket.on("setColor", (color) => {
        lineColorRef.current = color;
      });

      window.addEventListener("resize", () => {
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
      });
    }
  });

  return (
    <Fragment>
      <div className="main">
        <SocketContext.Provider value={{socket}}>
          <UserContext.Provider value={{userId: userId.current, joinedRoom, setJoinedRoom}}>
            <CanvasContext.Provider value={{
              lineWidthRef,
              lineColorRef
            }}>
              {joinedRoom ?
                <>
                  <TheSidebar />
                  <TheDrawingCanvas />
                </> :
                <TheAccountDialog />
              }
            </CanvasContext.Provider>
          </UserContext.Provider>
        </SocketContext.Provider>
      </div>
    </Fragment>
  );
}
