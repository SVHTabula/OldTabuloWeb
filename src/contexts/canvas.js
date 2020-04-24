import React from 'react';

const CanvasContext = React.createContext({
  lineColorRef: null,
  lineWidthRef: null,
  isBlackboardModeRef: null
});

export default CanvasContext;
