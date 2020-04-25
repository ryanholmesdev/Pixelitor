import React, { useState, useEffect } from 'react';
import './Canvas.scss';
import Moveable from 'react-moveable';

const Canvas = (props) => {
  const [canvasWidth] = useState(500);
  const [canvasHeight] = useState(600);
  const [canvasEle] = useState(React.createRef());
  const [canvasContext, setCanvasContext] = useState(null);
  const [target, setTarget] = React.useState();
  const [frame] = React.useState({
    translate: [0, 0],
    width: 100,
    height: 100,
  });

  let isDrawing = false;

  useEffect(() => {
    setCanvasContext(canvasEle.current.getContext('2d'));
    setTarget(canvasEle.current);
  }, [canvasEle]);

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

  return (
    <div className="page-wrapper">
      <canvas
        className="canvas"
        width={canvasWidth}
        height={canvasHeight}
        ref={canvasEle}
        onMouseDown={onMouseDown.bind(this)}
        onMouseUp={onMouseUp.bind(this)}
        onMouseMove={onMouseMove.bind(this)}
      ></canvas>

      <Moveable
        target={target}
        resizable={true}
        keepRatio={false}
        throttleResize={0}
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        edge={false}
        zoom={1}
        origin={true}
        onResizeStart={({ setOrigin, dragStart }) => {
          setOrigin(['%', '%']);
          dragStart && dragStart.set(frame.translate);
        }}
        onResize={({ target, width, height, drag }) => {
          const beforeTranslate = drag.beforeTranslate;

          frame.translate = beforeTranslate;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
      />
    </div>
  );
};

export default Canvas;
