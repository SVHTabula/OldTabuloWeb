import React, { useState, useRef, useEffect, Fragment } from "react";
import "./App.css";
import TheDrawingCanvas from "./components/TheDrawingCanvas";
import TheDrawingCanvasSaveButton from "./components/TheDrawingCanvasSaveButton";
import TheSidebar from "./components/TheSidebar";
import SocketContext from "./contexts/socket";
import UserContext from "./contexts/user";
import CanvasContext from "./contexts/canvas";
import RoomContext from "./contexts/room";

import io from "socket.io-client";
import { v4 } from "uuid";
import TheRoomEntryScreen from "./components/TheRoomEntryScreen";

const socket = io("https://tabula-web.herokuapp.com");

export default function App() {
  const userId = useRef(v4());
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef("#000000");

  const [roomId, setRoomId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    if (roomId) {
      socket.on("setWidth", (width) => {
        lineWidthRef.current = width;
      });

      socket.on("setColor", (color) => {
        lineColorRef.current = color;
      });
    }
  });

  return (
    <Fragment>
      <div className="main" style={{ position: "relative", height: '100vh'}}>
        <SocketContext.Provider value={{ socket }}>
          <UserContext.Provider
            value={{
              userId: userId.current,
              isTeacher,
              setIsTeacher,
            }}
          >
            <CanvasContext.Provider
              value={{
                lineWidthRef,
                lineColorRef,
              }}
            >
              <RoomContext.Provider
                value={{
                  roomId,
                  setRoomId,
                  joinPassword,
                  setJoinPassword,
                  adminPassword,
                  setAdminPassword,
                }}
              >
                {roomId && isTeacher ? <TheSidebar /> : null}
                {roomId ? (
                  <>
                    <TheDrawingCanvas />
                    {!isTeacher ? <TheDrawingCanvasSaveButton /> : null}
                  </>
                ) : null}
                {!roomId ? <TheRoomEntryScreen /> : null}
              </RoomContext.Provider>
            </CanvasContext.Provider>
          </UserContext.Provider>
        </SocketContext.Provider>
      </div>
    </Fragment>
  );
}
