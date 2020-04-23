export default function useLoadImage(canvasRef) {
  return function(url) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = url;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  }
}
