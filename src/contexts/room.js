import React from 'react';

const RoomContext = React.createContext({
  roomId: null,
  setRoomId: null,
  joinPassword: null,
  setJoinPassword: null,
  adminPassword: null,
  setAdminPassword: null
});

export default RoomContext;
