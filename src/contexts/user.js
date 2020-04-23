import React from 'react';

const UserContext = React.createContext({
  UserId: null,
  joinedRoom: null,
  setJoinedRoom: () => {}
});

export default UserContext;
