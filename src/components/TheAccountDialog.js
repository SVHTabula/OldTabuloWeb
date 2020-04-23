import React, { useContext } from "react";
import { Dialog, TextField, Button } from "@material-ui/core";
import UserContext from "../contexts/user";

export default function TheAccountDialog() {
  const { joinedRoom, setJoinedRoom } = useContext(UserContext);
  return (
    <Dialog open={true}>
      <div style={{ padding: 20 }}>
        <h3>Enter your room id</h3>
        <TextField id="roomInput"/>
        <br />
        <Button
          variant="contained"
          style={{ marginTop: 10 }}
          onClick={() => setJoinedRoom(document.getElementById('roomInput').value)}
        >
          Join Room
        </Button>
      </div>
    </Dialog>
  );
}
