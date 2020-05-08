import React, { useState, useRef, useEffect } from 'react';
import './Canvas.scss';

const Canvas = (props) => {
  const canvasEle = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [mostRecentDrawData, setMostRecentDrawData] = useState(null);

  const fillCircle = (x, y, radius, fillColor, canvas) => {
    // todo maybe move this context globally
    const canvasContext = canvas.getContext('2d');
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.arc(x, y, radius, 0, Math.PI * 2, false);
    canvasContext.fill();
  };

  const onMouseDown = () => {
    setIsDrawing(true);
  };

  const onMouseMove = (e) => {
    if (!isDrawing || props.allowedToDraw === false) {
      return;
    }
    const canvas = canvasEle.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const radius = props.brushSize;
    const fillColor = props.color;
    fillCircle(x, y, radius, fillColor, canvas);
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    setMostRecentDrawData(canvasEle.current.toDataURL());
  };

  const reDrawCanvasOnSizeChanges = () => {
    const drawData = mostRecentDrawData;
    if (drawData) {
      const canvasContext = canvasEle.current.getContext('2d');
      var image = new Image();
      image.onload = function () {
        canvasContext.drawImage(image, 0, 0);
      };
      image.src = drawData;
    }
  };

  useEffect(() => {
    if (mostRecentDrawData !== null) {
      reDrawCanvasOnSizeChanges();
    }
    // eslint-disable-next-line
  }, [props.canvasWidth, props.canvasHeight]);

  return (
    <canvas
      ref={canvasEle}
      style={{ zIndex: `-${props.layer.order}` }}
      className={`${props.layer.name} ${props.layer.isVisible === false ? 'hide' : ''} ${
        props.layer.isSelected === false ? 'disable-pointer-events' : ''
      }`}
      width={props.canvasWidth}
      height={props.canvasHeight}
      onMouseDown={props.allowedToDraw === true ? onMouseDown : undefined}
      onMouseMove={isDrawing === true ? onMouseMove : undefined}
      onMouseUp={isDrawing === true ? onMouseUp : undefined}
    ></canvas>
  );
};

export default Canvas;
