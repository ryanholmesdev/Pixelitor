import React, { useState, useRef, useEffect } from 'react';
import './Canvas.scss';

const Canvas = (props) => {
  const { brushSize, color, selectedTool } = props;
  const canvasEle = useRef();
  const canvasOverlayEle = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [mostRecentDrawData, setMostRecentDrawData] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [requireCanvasOverlay, setRequireCanvasOverlay] = useState(false);

  const setCanvasSettings = (canvasCtx) => {
    canvasCtx.globalAlpha = calculateOpacity(props.layer.opacity);
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = brushSize;
    return canvasCtx;
  };

  const draw = (mouseX, mouseY, canvasEle, clearCanvas) => {
    const ctx = canvasEle.getContext('2d');
    // clear when drawing on overlayed canvas.
    if (clearCanvas) ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    // set up start coords.
    let startX = mouseX;
    let startY = mouseY;
    if (startPosition) {
      startX = startPosition.startX;
      startY = startPosition.startY;
    }
    setCanvasSettings(ctx);

    // Begin draw.
    ctx.beginPath();
    if (selectedTool === 'Pen Tool') {
      ctx.moveTo(mouseX, mouseY);
      ctx.arc(mouseX, mouseY, brushSize, 0, Math.PI * 2, false);
    } else if (selectedTool === 'Line Tool') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(mouseX, mouseY);
    } else if (selectedTool === 'Circle Tool') {
      let radius = mouseX - startX;
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    } else if (selectedTool === 'Rectangle Tool') {
      let height = startX - mouseX;
      let width = startY - mouseY;
      ctx.rect(mouseX, mouseY, width, height);
    } else {
      console.error('Selected tool not available');
      return;
    }
    ctx.stroke();
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
    // If using overlay required to save start position of mouse.
    if (requireCanvasOverlay) {
      const rect = canvasOverlayEle.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartPosition({
        startX: x,
        startY: y,
      });
      draw(x, y, canvasOverlayEle.current, true);
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

    if (!requireCanvasOverlay) {
      // just regular draw.
      draw(x, y, canvas, false);
    } else {
      setMousePos({
        mouseX: x,
        mouseY: y,
      });
      draw(x, y, canvasOverlayEle.current, true);
    }
  };

  const onMouseUp = (e) => {
    setIsDrawing(false);
    if (requireCanvasOverlay) {
      const { mouseX, mouseY } = mousePos;
      draw(mouseX, mouseY, canvasEle.current, false);
      setStartPosition(null);
      // Clear the overlayed canvas.
      const overlayCtx = canvasOverlayEle.current.getContext('2d');
      overlayCtx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    }

    const imageData = canvasEle.current.toDataURL();
    setMostRecentDrawData(imageData);
    let newLayer = props.layer;
    newLayer.latestData = imageData;
    props.updateLayer(newLayer);
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
    if (selectedTool === 'Line Tool' || selectedTool === 'Circle Tool' || selectedTool === 'Rectangle Tool') {
      setRequireCanvasOverlay(true);
      return () => {
        setRequireCanvasOverlay(false);
      };
    }
  }, [selectedTool]);

  return (
    <div>
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
    </div>
  );
};

export default Canvas;
