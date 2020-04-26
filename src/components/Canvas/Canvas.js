import React, { useState, useEffect } from 'react';
import './Canvas.scss';
import Moveable from 'react-moveable';
import { layerHistory } from '../../data/Layers';

const Canvas = (props) => {
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [canvasEle] = useState(React.createRef());
  const [canvasWrapperEle] = useState(React.createRef());
  const [canvasContext, setCanvasContext] = useState(null);
  const [target, setTarget] = React.useState();
  const [frame] = React.useState({
    translate: [0, 0],
    width: 100,
    height: 100,
  });
  const [isResizing, setIsReszing] = React.useState(false);

  let isDrawing = false;
  const minCanvasWidth = 20;
  const minCanvasHeight = 20;
  const maxCanvasWidth = 700;
  const maxCanvasHeight = 700;

  useEffect(() => {
    setCanvasContext(canvasEle.current.getContext('2d'));
    setTarget(canvasWrapperEle.current);
  }, [canvasEle, canvasWrapperEle]);

  const onMouseDown = () => {
    isDrawing = true;
  };

  const onMouseMove = (e) => {
    if (!isDrawing || isAllowedToDraw() === false) {
      return;
    }
    const rect = canvasEle.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const radius = props.brushSize;
    const fillColor = props.color;
    fillCircle(x, y, radius, fillColor);
  };

  const onMouseUp = () => {
    isDrawing = false;
    // save the history of this draw.
    const activeLayerIndex = props.layers.findIndex((l) => l.isSelected === true);
    let newLayers = props.layers;
    let id = newLayers[activeLayerIndex].layerHistory.length;
    const canvasData = canvasEle.current.toDataURL();
    newLayers[activeLayerIndex].layerHistory.push(new layerHistory(id, 'draw', canvasData));
    props.updateLayers(newLayers);
  };

  const isAllowedToDraw = () => {
    return props.activeToolName === 'Pen Tool' ? true : false;
  };

  const fillCircle = (x, y, radius, fillColor) => {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    canvasContext.arc(x, y, radius, 0, Math.PI * 2, false);
    canvasContext.fill();
  };

  const reDrawCanvas = () => {
    const layersHistoryLength = props.layers[0].layerHistory.length;
    if (layersHistoryLength > 0) {
      const data = props.layers[0].layerHistory[layersHistoryLength - 1];
      var image = new Image();
      image.onload = function () {
        canvasContext.drawImage(image, 0, 0);
      };
      image.src = data.canvasData;
    }
  };

  return (
    <div className="page-wrapper">
      <div
        className="canvas-wrapper"
        ref={canvasWrapperEle}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      >
        <canvas
          className={`${isResizing === true ? 'resizing-active' : ''}`}
          width={canvasWidth}
          height={canvasHeight}
          ref={canvasEle}
          onMouseDown={onMouseDown.bind(this)}
          onMouseUp={onMouseUp.bind(this)}
          onMouseMove={onMouseMove.bind(this)}
        ></canvas>
      </div>

      <Moveable
        className={`moveable-canvas-container ${props.activeToolName !== 'Select Tool' ? 'not-active' : ''}`}
        target={target}
        resizable={props.activeToolName === 'Select Tool' ? true : false}
        keepRatio={false}
        throttleResize={0}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        edge={false}
        zoom={1}
        origin={false}
        draggable={props.activeToolName === 'Select Tool' ? true : false}
        onResizeStart={({ setOrigin, dragStart }) => {
          setOrigin(['%', '%']);
          dragStart && dragStart.set(frame.translate);
          setIsReszing(true);
        }}
        onResize={({ target, width, height, drag }) => {
          width = width >= maxCanvasWidth ? maxCanvasWidth : width;
          width = width <= minCanvasWidth ? minCanvasWidth : width;
          height = height >= maxCanvasHeight ? maxCanvasHeight : height;
          height = height <= minCanvasHeight ? minCanvasHeight : height;

          const beforeTranslate = drag.beforeTranslate;
          frame.translate = beforeTranslate;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        onResizeEnd={({ target }) => {
          /*
            Need to actually set the canvas width and height properties and remove the values
            from the inline styling. This is done on rezise end because the canvas 
            has to be re drawn once the width and height has changed.
          */

          // get the width and height from inline styling.
          const width = parseFloat(target.style.width.replace('px', ''));
          const height = parseFloat(target.style.height.replace('px', ''));

          // We need to actually set the canvas width and height properties and remove the inline stying.
          setCanvasWidth(width);
          setCanvasHeight(height);

          // remove inline style no longer need.
          // lastly redraw canvas
          reDrawCanvas();
          setIsReszing(false);
        }}
        onDragStart={({ set }) => {
          set(frame.translate);
        }}
        onDrag={({ target, beforeTranslate }) => {
          frame.translate = beforeTranslate;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
      />
    </div>
  );
};

export default Canvas;
