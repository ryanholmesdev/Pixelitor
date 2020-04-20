import React, { Component } from 'react';
import './Canvas.scss';
export class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasEle = React.createRef();
    this.isDrawing = false;
    this.canvesContext = null;
    this.state = { x: 0, y: 0 };
  }
  componentDidMount = () => {
    this.canvesContext = this.canvasEle.current.getContext('2d');
  };

  onMouseDown = () => {
    this.isDrawing = true;
  };

  onMouseUp = () => {
    this.isDrawing = false;
  };

  onMouseMove = (e) => {
    if (!this.isDrawing) {
      return;
    }

    var rect = this.canvasEle.current.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var radius = 10; // or whatever
    var fillColor = '#ff0000';
    this.fillCircle(x, y, radius, fillColor);
  };

  fillCircle = (x, y, radius, fillColor) => {
    this.canvesContext.fillStyle = fillColor;
    this.canvesContext.beginPath();
    this.canvesContext.moveTo(x, y);
    this.canvesContext.arc(x, y, radius, 0, Math.PI * 2, false);
    this.canvesContext.fill();
  };

  render() {
    const { x, y } = this.state;
    return (
      <canvas
        height={200}
        width={200}
        ref={this.canvasEle}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
      ></canvas>
    );
  }
}

export default Canvas;
