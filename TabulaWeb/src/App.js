import React, {useEffect} from 'react';
import $ from 'jquery';
import './App.css';
import io from 'socket.io-client';

const clickX = [], clickY = [], clickDrag = [], connected = [];
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

let context;
let paint = false;

function redraw() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;

  for(let i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      context.moveTo(clickX[i]-1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
}

const socket = io('http://localhost:3000');

function App() {
  useEffect(() => {
    context = document.getElementById('canvas').getContext('2d');

    $('#canvas').mousedown(function(e) {
      let mouseX = e.pageX - this.offsetLeft;
      let mouseY = e.pageY - this.offsetTop;

      paint = true;
      addClick(mouseX, mouseY);
      redraw();
    });

    $('#canvas').mousemove(function(e) {
      if (paint) {
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;

        addClick(mouseX, mouseY, true);
        redraw();
      }
    });

    $('#canvas').mouseup(function(e) {
      paint = false;
      let mouseX = e.pageX - this.offsetLeft;
      let mouseY = e.pageY - this.offsetTop;
      addClick(mouseX, mouseY, false);
    });

    $('#canvas').mouseleave(function(e) {
      paint = false;
    });

  }, []);
  return (
    <div className="App">
      <canvas id="canvas" width="1000" height="1000" style={{border: '1px' +
          ' solid black'}}>

      </canvas>
    </div>
  );
}

export default App;
