import React from "react";
import TheSidebarColorPicker from "./TheSidebarColorPicker";
import TheSidebarWidthSlider from "./TheSidebarWidthSlider";
import TheSidebarImageSaver from "./TheSidebarImageSaver";
import TheSidebarTitle from "./TheSidebarTitle";
import TheSidebarRoomInformation from "./TheSidebarRoomInformation";

export default function TheSidebar() {
  return (
    <div id="sidebar">
      <TheSidebarTitle />
      <TheSidebarWidthSlider />
      <TheSidebarColorPicker />
      <TheSidebarImageSaver />
      <TheSidebarRoomInformation />
    </div>
  );
}
