import React, { useState, useContext } from "react";
import { Dialog, TextField, Button, DialogTitle } from "@material-ui/core";
import SocketContext from "../contexts/socket";
import FormHelperText from "@material-ui/core/FormHelperText";
import RoomContext from "../contexts/room";

export default function TheAccountDialog() {
  const { socket } = useContext(SocketContext);

  const { setAdminPassword, setJoinPassword, setRoomId } = useContext(RoomContext);
  const [formRoomId, setFormRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <Dialog open={!formRoomId}>
      <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
        <DialogTitle style={{ margin: 0, paddingBottom: 25 }}>
          <span style={{ fontWeight: "bold" }}>Connect to Tabula Room</span>
        </DialogTitle>
        <TextField
          label="Room ID"
          variant="outlined"
          style={{ flexGrow: 1 }}
          value={formRoomId}
          onChange={({value}) => setFormRoomId(value)}
        />
        <TextField
          label="Admin Password"
          variant="outlined"
          style={{ flexGrow: 1, marginTop: 10 }}
          value={roomPassword}
          onChange={({value}) => setRoomPassword(value)}
        />
        <Button
          variant="contained"
          style={{ marginTop: 10, flexGrow: 1 }}
          color="primary"
          onClick={() => {
            socket.emit('joinRoom', function(result) {
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
            socket.emit('createRoom', function(result) {
              if (result.success) {
                console.log('hi');
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
    </Dialog>
  );
}
