import React, { useState, useEffect, useRef } from 'react';
import './CanvasDocument.scss';
import Moveable from 'react-moveable';
import Canvas from '../Canvas/Canvas';

const CanvasDocument = (props) => {
  const { settings, activeToolName } = props;
  const { minCanvasWidth, minCanvasHeight, maxCanvasWidth, maxCanvasHeight, color, brushSize } = settings;

  const [canvasWidth, setCanvasWidth] = useState(settings.canvasWidth);
  const [canvasHeight, setCanvasHeight] = useState(settings.canvasHeight);

  const [canvasWrapperEle] = useState(React.createRef());
  const pageWrapperEle = useRef(null);
  const [moveableBounds, setMoveableBounds] = useState(null);

  const [target, setTarget] = React.useState();
  const [frame] = React.useState({
    translate: [0, 0],
    width: 100,
    height: 100,
  });

  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [isResizing, setIsReszing] = React.useState(false);
  const [isAllowedToDraw, setIsAllowedToDraw] = useState(false);

  useEffect(() => {
    setTarget(canvasWrapperEle.current);
  }, [canvasWrapperEle]);

  const setIsUserAllowedToDraw = () => {
    const isAllowed = activeToolName === 'Pen Tool' ? true : false;
    setIsAllowedToDraw(isAllowed);
  };

  useEffect(setIsUserAllowedToDraw, [activeToolName]);
  useEffect(() => {
    setMoveableBounds(getMoveableBound());
  }, []);

  const getMoveableBound = () => {
    const wrapper = pageWrapperEle.current;
    if (wrapper) {
      return { top: wrapper.offsetTop, left: wrapper.offsetLeft };
    } else {
      // use defaults.
      return { top: 20, left: 75 };
    }
  };

  return (
    <div className="page-wrapper" ref={pageWrapperEle}>
      <div
        ref={canvasWrapperEle}
        className={`canvas-wrapper ${isDraggingCanvas === true || isResizing === true ? 'active' : ''}`}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      >
        {props.layers.map((layer) => {
          return (
            <Canvas
              key={layer.id}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              layer={layer}
              allowedToDraw={
                isAllowedToDraw === true && layer.isVisible === true && layer.isSelected === true ? true : false
              }
              brushSize={brushSize}
              color={color}
            ></Canvas>
          );
        })}
      </div>

      <Moveable
        className={`moveable-canvas-container ${activeToolName !== 'Select Tool' ? 'not-active' : ''}`}
        target={target}
        resizable={activeToolName === 'Select Tool' ? true : false}
        keepRatio={false}
        throttleResize={0}
        throttleDrag={1}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        edge={false}
        zoom={1}
        origin={false}
        snappable={true}
        bounds={moveableBounds}
        draggable={activeToolName === 'Select Tool' ? true : false}
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
            Need to actually set the canvas width and height properties, doing so will empty the canvas so will need to redraw it.
          */
          // get the width and height from inline styling.
          const width = parseFloat(target.style.width.replace('px', ''));
          const height = parseFloat(target.style.height.replace('px', ''));
          if (canvasWidth !== width || canvasHeight !== height) {
            setCanvasWidth(width);
            setCanvasHeight(height);
          }
          setIsReszing(false);
        }}
        onDragStart={({ set }) => {
          set(frame.translate);
          setIsDraggingCanvas(true);
        }}
        onDrag={({ target, beforeTranslate }) => {
          frame.translate = beforeTranslate;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        onDragEnd={() => {
          setIsDraggingCanvas(false);
        }}
      />
    </div>
  );
};

export default CanvasDocument;
