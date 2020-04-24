import React from "react";
import TheSidebarColorPicker from "./TheSidebarColorPicker";
import TheSidebarWidthSlider from "./TheSidebarWidthSlider";
import TheSidebarImageSaver from "./TheSidebarImageSaver";
import TheSidebarTitle from "./TheSidebarTitle";
import TheSidebarRoomInformation from "./TheSidebarRoomInformation";
import TheSidebarCanvasResizer from "./TheSidebarCanvasResizer";

export default function TheSidebar() {
  return (
    <div id="sidebar" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <TheSidebarTitle />
      <TheSidebarWidthSlider />
      <TheSidebarColorPicker />
      <TheSidebarImageSaver />
      <TheSidebarCanvasResizer />
      <div style={{marginTop: 'auto'}}>
        <TheSidebarRoomInformation/>
      </div>
    </div>
  );
}
