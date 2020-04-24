import React from "react";
import TheSidebarColorPicker from "./TheSidebarColorPicker";
import TheSidebarWidthSlider from "./TheSidebarWidthSlider";
import TheSidebarImageSaver from "./TheSidebarImageSaver";
import TheSidebarTitle from "./TheSidebarTitle";
import TheSidebarRoomInformation from "./TheSidebarRoomInformation";
import DarkMode from "./DarkModeToggle";

export default function TheSidebar() {
  return (
    <div id="sidebar" style={{display: 'flex',background: 'var(--background2)', flexDirection: 'column', height: '100vh', color: 'var(--background)',}}>
      <TheSidebarTitle />
      <TheSidebarWidthSlider />
      <TheSidebarColorPicker />
      <TheSidebarImageSaver />
      <DarkMode />

      <div style={{marginTop: 'auto'}}>
        <TheSidebarRoomInformation/>
      </div>
    </div>
  );
}
