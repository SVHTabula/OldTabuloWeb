import React, {useState, useEffect, useContext} from "react";
import Switch from '@material-ui/core/Switch';
import {canvasRef} from './TheDrawingCanvas';
import {phoneOutlineRef} from "./TheDrawingCanvasPhoneOutline";
import SocketContext from "../contexts/socket";

export default function TheSidebarBlackboardSwitch() {
  const [isBlackboardMode, setIsBlackboardMode] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = isBlackboardMode ? 'black' : 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    phoneOutlineRef.current.style.borderColor = isBlackboardMode ? 'white' : 'black';
    socket.emit('setIsBlackboardMode', isBlackboardMode);
  }, [isBlackboardMode]);

  return (
    <div>
      <br></br>
      Blackboard Mode:
      <Switch
        checked={isBlackboardMode}
        onChange={() => setIsBlackboardMode(!isBlackboardMode)}
        name="Blackboard Mode"
      />
      <br></br>
    </div>
  );
}
