import React, {useContext, useState} from "react";
import RoomContext from '../contexts/room';
import TextField from "@material-ui/core/TextField";

export default function TheSidebarRoomInformation() {
  // const [showJoinPassword, setShowJoinPassword] = useState(false);
  // const [showAdminPassword, setShowAdminPassword] = useState(false);

  const { roomId, joinPassword, adminPassword } = useContext(RoomContext);
  console.log(`adminPasswrd: ${adminPassword} lol`);
  console.log(roomId, joinPassword, adminPassword);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <TextField
        label="Room ID (Share with students)"
        defaultValue={roomId}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
}
