import React, { useState, useEffect, useRef } from 'react';
import './CanvasDocument.scss';
import Moveable from 'react-moveable';
import Canvas from '../Canvas/Canvas';
import { connect, useDispatch } from 'react-redux';
import { updateSettings } from '../../actions/settings';
import { updateLayer as globalUpdateLayer } from '../../actions/layer';

const CanvasDocument = (props) => {
  const { settings, activeToolName } = props;
  const dispatch = useDispatch();
  const {
    canvasWidth,
    canvasHeight,
    minCanvasWidth,
    minCanvasHeight,
    maxCanvasWidth,
    maxCanvasHeight,
    canvasX,
    canvasY,
    color,
    brushSize,
  } = settings;
  const [canvasWrapperEle] = useState(React.createRef());
  const moveableEle = React.useRef();
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
    setMoveableBounds(getMoveableBound());
  }, [canvasWrapperEle]);

  useEffect(() => {
    if (moveableEle !== undefined) {
      moveableEle.current.moveable.updateRect();
    }
  }, [canvasWidth, canvasHeight, canvasX, canvasY]);

  const setIsUserAllowedToDraw = () => {
    const isAllowed =
      (activeToolName === 'Pen Tool' ||
        activeToolName === 'Line Tool' ||
        activeToolName === 'Circle Tool' ||
        activeToolName === 'Rectangle Tool' ||
        activeToolName === 'Eraser Tool') &&
      color !== ''
        ? true
        : false;
    setIsAllowedToDraw(isAllowed);
  };

  useEffect(setIsUserAllowedToDraw, [activeToolName, color]);

  const getMoveableBound = () => {
    const wrapper = pageWrapperEle.current;
    if (wrapper) {
      return { top: wrapper.offsetTop, left: wrapper.offsetLeft };
    } else {
      // use defaults.
      return { top: 20, left: 75 };
    }
  };

  const updateLayer = (layer) => {
    dispatch(globalUpdateLayer(layer));
  };

  const rgbToHex = (r, g, b) =>
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');

  const onEyePickerSelect = (e) => {
    const rect = canvasWrapperEle.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const visableLayers = props.layers.filter((layer) => layer.isVisible === true);
    let colorPicked = '';
    for (const layer of visableLayers) {
      if (layer.latestData) {
        const canvas = document.getElementById(`layer-canvas-${layer.id}`);
        const ctx = canvas.getContext('2d');
        const pxData = ctx.getImageData(mouseX, mouseY, 1, 1);
        let r, g, b;
        [r, g, b] = pxData.data;
        if (r !== 0 && g !== 0 && b !== 0) {
          // found a color...
          colorPicked = rgbToHex(r, g, b);
          break;
        }
      }
    }
    let newSettings = settings;
    newSettings.color = colorPicked;
    dispatch(updateSettings(newSettings));
  };

  return (
    <div className="page-wrapper" ref={pageWrapperEle}>
      <div
        ref={canvasWrapperEle}
        className={`canvas-wrapper ${isDraggingCanvas === true || isResizing === true ? 'active' : ''}`}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px`, left: `${canvasX}px`, top: `${canvasY}px` }}
        onClick={activeToolName === 'Eyedropper Tool' ? onEyePickerSelect : undefined}
      >
        {props.layers.map((layer) => {
          return (
            <Canvas
              key={layer.id}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              layer={layer}
              updateLayer={updateLayer}
              allowedToDraw={
                isAllowedToDraw === true && layer.isVisible === true && layer.isSelected === true ? true : false
              }
              selectedTool={activeToolName}
              brushSize={brushSize}
              color={color}
            ></Canvas>
          );
        })}
      </div>

      <Moveable
        ref={moveableEle}
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
          const width = Math.round(parseFloat(target.style.width.replace('px', '')));
          const height = Math.round(parseFloat(target.style.height.replace('px', '')));
          if (canvasWidth !== width || canvasHeight !== height) {
            let newSettings = settings;
            newSettings.canvasWidth = width;
            newSettings.canvasHeight = height;
            dispatch(updateSettings(newSettings));
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

const mapStateToProps = (state) => {
  return { layers: state.layers, settings: state.settings };
};

export default connect(mapStateToProps)(CanvasDocument);
