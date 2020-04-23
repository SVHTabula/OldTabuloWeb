import React, { useRef, useEffect, Fragment } from 'react';
import './App.css';
import DrawingCanvas from './components/DrawingCanvas';
import ColorPicker from './components/ColorPicker';
import SocketContext from './contexts/socket';
import UserContext from './contexts/user';
import CanvasContext from "./contexts/canvas";

import io from "socket.io-client";
import { v4 } from 'uuid';

const socket = io('https://tabula-web.herokuapp.com');

export default function App() {
  const userId = useRef(v4());
  const lineWidthRef = useRef(5);
  const lineColorRef = useRef('#ffffff');

  useEffect(() => {
    socket.on("setWidth", (width) => {
      lineWidthRef.current = width;
    });

    socket.on("setColor", (color) => {
      lineColorRef.current = color;
    });
  },[]);

  return (
    <Fragment>
      <div className="main">
        <SocketContext.Provider value={{socket}}>
          <UserContext.Provider value={{userId: userId.current}}>
            <CanvasContext.Provider value={{
              lineWidthRef,
              lineColorRef
            }}>
              <ColorPicker />
              <DrawingCanvas />
            </CanvasContext.Provider>
          </UserContext.Provider>
        </SocketContext.Provider>
      </div>
    </Fragment>
  );
}
