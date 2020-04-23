import React from 'react';

const UserContext = React.createContext({
  userId: null,
  isTeacher: null,
  setIsTeacher: null
});

export default UserContext;
