import React from 'react';
import DarkTheme from 'react-dark-theme'


const DarkModeToggle = () => {
  const lightTheme = {
    background: 'white',
    text: 'black',
    background2: 'black',
    text2: 'white',
  }
  
  const darkTheme = {
    background: 'black',
    text: 'white',
    background2: 'white',
    text2: 'black',
  }

  return (
    <div>
        <DarkTheme light={lightTheme} dark={darkTheme} />
      </div>
  );
};

export default DarkModeToggle;