import React, { useState, useEffect } from 'react';
import './Layer.scss';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Layer = (props) => {
  const { index, draggingIndex, allowDrag } = props;
  const { name, isVisible, isSelected } = props.layer;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingValue, setRenamingValue] = useState(name);
  const [isDraggingEnter, setisDraggingEnter] = useState(false);

  const toggleVisible = () => {
    let newLayer = props.layer;
    newLayer.isVisible = !isVisible;
    props.updateLayer(newLayer, index);
  };

  const renameLayer = () => {
    let newLayer = props.layer;
    newLayer.name = renamingValue;
    props.updateLayer(newLayer, index);
    setIsRenaming(false);
  };

  const layerKeyPress = (e) => {
    if (e.key === 'Enter') {
      renameLayer();
    }
  };

  const onDragStart = (index) => {
    props.setDraggingIndex(index);
  };

  // prevents n/a cursor from displaying.
  const onDragOver = (event) => {
    event.preventDefault();
    return false;
  };

  const onDragEnter = (targetIndex, e) => {
    if (targetIndex !== draggingIndex) {
      setisDraggingEnter(true);
    }
  };

  const onDragLeave = (event) => {
    setisDraggingEnter(false);
  };

  const onDrop = (targetIndex, event) => {
    if (targetIndex !== draggingIndex) {
      props.moveSelectedLayer(targetIndex, draggingIndex);
    }
  };

  const onDragEnd = (event) => {
    setisDraggingEnter(false);
    props.setDraggingIndex(null);
  };

  useEffect(() => {
    if (draggingIndex === null && isDraggingEnter === true) {
      setisDraggingEnter(false);
    }
  }, [draggingIndex, isDraggingEnter]);

  return (
    <div className={`layer ${isSelected ? 'active' : ''} ${isDraggingEnter ? 'drag-enter' : ''}`}>
      <div className="icon" onClick={toggleVisible}>
        {isVisible && <FiEye color="#3153e5" size="25px" style={{ margin: 'auto' }} />}
        {!isVisible && <FiEyeOff color="#788ca1" size="25px" style={{ margin: 'auto' }} />}
      </div>
      <div
        className={`layername-container ${draggingIndex !== null ? 'prevent-pointer' : ''}`}
        onClick={!isSelected ? () => props.selectLayer(index) : undefined}
        draggable={allowDrag ? 'true' : 'false'}
        onDragStart={allowDrag ? () => onDragStart(index) : undefined}
        onDragOver={allowDrag ? onDragOver.bind(this) : undefined}
        onDragEnter={allowDrag ? (e) => onDragEnter(index, e) : undefined}
        onDragLeave={allowDrag ? onDragLeave.bind(this) : undefined}
        onDrop={allowDrag ? (e) => onDrop(index, e) : undefined}
        onDragEnd={allowDrag ? onDragEnd : undefined}
      >
        {!isRenaming && <span onDoubleClick={() => setIsRenaming(true)}> {name}</span>}
        {isRenaming && (
          <input
            type="text"
            value={renamingValue}
            autoFocus
            onChange={(e) => setRenamingValue(e.target.value)}
            onKeyPress={layerKeyPress}
            onBlur={renameLayer}
          ></input>
        )}
      </div>
    </div>
  );
};

export default Layer;
