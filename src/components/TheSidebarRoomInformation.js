import React, {useContext, useState} from "react";
import RoomContext from '../contexts/room';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

export default function TheSidebarRoomInformation() {
  const [showJoinPassword, setShowJoinPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const { roomId, joinPassword, adminPassword } = useContext(RoomContext);
  console.log(roomId, joinPassword, adminPassword);

  return (
    <div style={{display: 'flex', flexDirection: 'column', color: 'var(--text2)'}}>
      <TextField
        label="Room ID (Share with students)"
        defaultValue={roomId}
        InputProps={{
          readOnly: true,
        }}
        style = {{color: 'var(--text2)'}}
      />
      <h3>Join Password (Share with students)</h3>
      <TextField
        type={showJoinPassword ? 'text' : 'password'}
        label="Join Password"
        value={joinPassword}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowJoinPassword(!showJoinPassword)}
                onMouseDown={(e) => e.preventDefault}
              >
                {showJoinPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
        style={{marginBottom: 20}}
      />
      <TextField
        label="Admin Password (DON'T SHARE)"
        type={showAdminPassword ? 'text' : 'password'}
        value={adminPassword}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                onMouseDown={(e) => e.preventDefault}
              >
                {showAdminPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </div>
  );
}
