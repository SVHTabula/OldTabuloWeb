import React from "react";
import TheSidebarColorPicker from "./TheSidebarColorPicker";
import TheSidebarWidthSlider from "./TheSidebarWidthSlider";
import TheSidebarImageSaver from "./TheSidebarImageSaver";

export default function TheSidebar() {
  return (
    <div style={{ padding: 20 }}>
      <h3 style={{ textAlign: 'center' }}>Tabula</h3>
      <TheSidebarWidthSlider />
      <TheSidebarColorPicker />
      <TheSidebarImageSaver />
    </div>
  );
}
