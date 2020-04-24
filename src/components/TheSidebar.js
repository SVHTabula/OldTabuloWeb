import React from "react";
import TheSidebarColorPicker from "./TheSidebarColorPicker";
import TheSidebarWidthSlider from "./TheSidebarWidthSlider";
import TheSidebarImageSaver from "./TheSidebarImageSaver";
import TheSidebarTitle from "./TheSidebarTitle";
import TheSidebarRoomInformation from "./TheSidebarRoomInformation";
import TheSidebarCanvasResizer from "./TheSidebarCanvasResizer";
import TheSidebarBlackboardSwitch from "./TheSidebarBlackboardSwitch";

export default function TheSidebar() {
  return (
    <div id="sidebar" style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <TheSidebarTitle />
      <TheSidebarWidthSlider />
      <TheSidebarColorPicker />
      <TheSidebarImageSaver />
      <TheSidebarCanvasResizer />
      <TheSidebarBlackboardSwitch />
      <div style={{marginTop: 'auto'}}>
        <TheSidebarRoomInformation />
      </div>
    </div>
  );
}
