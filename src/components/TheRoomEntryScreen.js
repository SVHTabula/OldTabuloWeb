import React, { useState, useContext } from "react";
import { Paper, TextField, Button, DialogTitle } from "@material-ui/core";
import SocketContext from "../contexts/socket";
import FormHelperText from "@material-ui/core/FormHelperText";
import RoomContext from "../contexts/room";

export default function TheRoomEntryScreen() {
  const { socket } = useContext(SocketContext);

  const { setAdminPassword, setJoinPassword, setRoomId } = useContext(RoomContext);
  const [formRoomId, setFormRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={10}>
        <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
          <DialogTitle style={{ margin: 0, paddingBottom: 25 }}>
            <span style={{ fontWeight: "bold" }}>Connect to Tabula Room</span>
          </DialogTitle>
          <TextField
            label="Room ID"
            variant="outlined"
            style={{ flexGrow: 1 }}
            value={formRoomId}
            onChange={(e) => setFormRoomId(e.target.value)}
          />
          <TextField
            label="Join Password"
            variant="outlined"
            style={{ flexGrow: 1, marginTop: 10 }}
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
          />
          <Button
            variant="contained"
            style={{ marginTop: 10, flexGrow: 1 }}
            color="primary"
            onClick={() => {
              socket.emit('joinRoom', { id: formRoomId, password: roomPassword }, function(result) {
                if (result.success) {
                  setRoomId(formRoomId);
                } else {
                  setErrorMessage(result.message);
                }
              });
            }}
          >
            Join Room
          </Button>
          <Button
            variant="contained"
            style={{ marginTop: 5, flexGrow: 1 }}
            color="secondary"
            onClick={() => {
              socket.emit('createRoom', {id: formRoomId, roomPassword }, function(result) {
                if (result.success) {
                  setRoomId(formRoomId);
                  setJoinPassword(roomPassword);
                  setAdminPassword(result.adminPassword);
                } else {
                  setErrorMessage(result.message);
                }
              })
            }}
          >
            Create Room
          </Button>
          <FormHelperText error={true} style={{textAlign: 'center', marginBottom: 5}}>
            {errorMessage}
          </FormHelperText>
        </div>
      </Paper>
    </div>
  );
}
