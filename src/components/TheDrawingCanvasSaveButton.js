import React from "react";
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import { canvasRef } from "./TheDrawingCanvas";
import useSaveImage from "../hooks/useSaveImage";

export default function TheDrawingCanvasSaveButton() {
  const saveImage = useSaveImage(canvasRef);

  return (
    <Fab
      color="primary"
      style={{position: 'absolute', bottom: 20, left: 20}}
      onPress={saveImage}
    >
      <SaveIcon />
    </Fab>
  );
}
