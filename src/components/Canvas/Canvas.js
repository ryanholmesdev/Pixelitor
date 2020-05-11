import React, { useState, useRef, useEffect } from 'react';
import './Canvas.scss';

const Canvas = (props) => {
  const canvasEle = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [mostRecentDrawData, setMostRecentDrawData] = useState(null);

  const fillCircle = (x, y, radius, fillColor, canvas) => {
    // todo maybe move this context globally
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = calculateOpacity(props.layer.opacity);
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  };

  // Opacity is 0 - 100 need to format like 0.99
  const calculateOpacity = (opacity) => {
    if (opacity !== 100) {
      if (opacity.toString().length === 1) {
        return Number(`0.0${opacity}`);
      }
      return Number(`0.${opacity}`);
    }
    return 1.0;
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

  const reDrawCanvasOnSizeChanges = (clearCanvasFirst) => {
    const drawData = mostRecentDrawData;
    if (drawData) {
      let ctx = canvasEle.current.getContext('2d');
      if (clearCanvasFirst === true) ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
      ctx.globalAlpha = calculateOpacity(props.layer.opacity);
      var image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = drawData;
    }
  };

  useEffect(() => {
    if (mostRecentDrawData !== null) {
      reDrawCanvasOnSizeChanges(false);
    }
    // eslint-disable-next-line
  }, [props.canvasWidth, props.canvasHeight]);

  useEffect(() => {
    if (mostRecentDrawData !== null) {
      reDrawCanvasOnSizeChanges(true);
    }
    // eslint-disable-next-line
  }, [props.layer.opacity]);

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
