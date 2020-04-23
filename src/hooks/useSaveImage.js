export default function useSaveImage(canvasRef) {
  return function() {
    const canvas = canvasRef.current;
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", "output.png");
    downloadLink.setAttribute(
      "href",
      canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    );
    downloadLink.click();
  }
}
