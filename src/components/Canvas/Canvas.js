import React, { useState, useRef, useEffect } from 'react';
import './Canvas.scss';

const Canvas = (props) => {
  const { brushSize, color, selectedTool } = props;
  const canvasEle = useRef();
  const canvasOverlayEle = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [mostRecentDrawData, setMostRecentDrawData] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [existingLines, setExistingLines] = useState([]);
  const [mousePos, setMousePos] = useState(null);
  const [requireCanvasOverlay, setRequireCanvasOverlay] = useState(false);

  const fillCircle = (mouseX, mouseY, radius, fillColor, canvas) => {
    // todo maybe move this context globally
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = calculateOpacity(props.layer.opacity);
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
    ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, false);
    ctx.fill();
  };

  const draw = (mouseX, mouseY) => {
    const ctx = canvasEle.current.getContext('2d');
    if (mostRecentDrawData) {
      reDrawCanvasOnSizeChanges(true);
    } else {
      // clear canvas
      ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    }
    // might need to re draw the canvas here.
    ctx.strokeSyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();

    existingLines.forEach((line) => {
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
    });

    ctx.stroke();

    if (isDrawing) {
      const { startX, startY } = startPosition;
      ctx.strokeStyle = 'darkred';
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
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

  const onMouseDown = (e) => {
    setIsDrawing(true);

    if (selectedTool === 'Line Tool') {
      const rect = canvasOverlayEle.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPosition({
        startX: x,
        startY: y,
      });
      draw(x, y);
    }
  };

  const onMouseMove = (e) => {
    if (!isDrawing || props.allowedToDraw === false) {
      return;
    }
    const canvas = canvasEle.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const radius = brushSize;
    const fillColor = color;

    if (selectedTool === 'Pen Tool') {
      fillCircle(x, y, radius, fillColor, canvas);
    } else if (selectedTool === 'Line Tool') {
      setMousePos({
        mouseX: x,
        mouseY: y,
      });
      const startX = startPosition.x;
      const startY = startPosition.y;
      draw(x, y);
    }
  };

  const onMouseUp = (e) => {
    setIsDrawing(false);
    setMostRecentDrawData(canvasEle.current.toDataURL());
    if (selectedTool === 'Line Tool') {
      let existingLinesNew = existingLines;
      const { startX, startY } = startPosition;
      const { mouseX, mouseY } = mousePos;

      existingLines.push({
        startX: startX,
        startY: startY,
        endX: mouseX,
        endY: mouseY,
      });
      setExistingLines(existingLines);
    }
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

  useEffect(() => {
    if (selectedTool === 'Line Tool') {
      console.log('require overlay');
      setRequireCanvasOverlay(true);
      return () => {
        setRequireCanvasOverlay(false);
      };
    }
  }, [selectedTool]);

  return (
    <div>
      <canvas
        ref={canvasOverlayEle}
        className={`${requireCanvasOverlay === false ? 'hide' : ''} ${
          props.layer.isSelected === false ? 'disable-pointer-events' : ''
        }`}
        style={{ zIndex: `-${props.layer.order}` }}
        width={props.canvasWidth}
        height={props.canvasHeight}
        onMouseDown={props.allowedToDraw === true && requireCanvasOverlay === true ? onMouseDown : undefined}
        onMouseMove={isDrawing === true && requireCanvasOverlay === true ? onMouseMove : undefined}
        onMouseUp={isDrawing === true && requireCanvasOverlay === true ? onMouseUp : undefined}
      ></canvas>
      <canvas
        ref={canvasEle}
        style={{ zIndex: `-${props.layer.order}` }}
        className={`${props.layer.name} ${props.layer.isVisible === false ? 'hide' : ''} ${
          props.layer.isSelected === false ? 'disable-pointer-events' : ''
        }`}
        width={props.canvasWidth}
        height={props.canvasHeight}
        onMouseDown={props.allowedToDraw === true && requireCanvasOverlay === false ? onMouseDown : undefined}
        onMouseMove={isDrawing === true && requireCanvasOverlay === false ? onMouseMove : undefined}
        onMouseUp={isDrawing === true && requireCanvasOverlay === false ? onMouseUp : undefined}
      ></canvas>
    </div>
  );
};

export default Canvas;
