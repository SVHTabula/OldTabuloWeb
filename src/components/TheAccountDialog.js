import React, { useContext } from "react";
import { Dialog, TextField, Button, DialogTitle } from "@material-ui/core";
import UserContext from "../contexts/user";

export default function TheAccountDialog() {
  const { joinedRoom, setJoinedRoom } = useContext(UserContext);
  function createRoom() {}
  return (
    <Dialog open={true}>
      <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
        <DialogTitle style={{ margin: 0, paddingBottom: 25 }}>
          <span style={{ fontWeight: "bold" }}>Connect to Tabula Room</span>
        </DialogTitle>
        <TextField
          id="roomInput"
          label="Room ID"
          variant="outlined"
          style={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          style={{ marginTop: 10, flexGrow: 1 }}
          color="primary"
          onClick={() =>
            setJoinedRoom(document.getElementById("roomInput").value)
          }
        >
          Join Room
        </Button>
        <Button
          variant="contained"
          style={{ marginTop: 10, flexGrow: 1 }}
          color="secondary"
          onClick={() =>
            setJoinedRoom(document.getElementById("roomInput").value)
          }
        >
          Create Room
        </Button>
      </div>
    </Dialog>
  );
}
