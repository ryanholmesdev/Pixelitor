import React from 'react';
import './Navigation.scss';
import { FiRotateCcw, FiRotateCw, FiUser } from 'react-icons/fi';
import { connect, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';

const Navigation = (props) => {
  const settings = useSelector((state) => state.settings);
  const layers = useSelector((state) => state.layers);
  const onExportImageClick = () => {
    let exportCanvasEle = document.createElement('canvas');
    exportCanvasEle.id = 'export-canvas-ele';
    exportCanvasEle.width = settings.canvasWidth;
    exportCanvasEle.height = settings.canvasHeight;

    const ctx = exportCanvasEle.getContext('2d');
    const layersOrdered = layers.reverse();

    let totalImages = layers.length;
    let totalLoaded = 0;

    layersOrdered.forEach((layer) => {
      const canvasData = layer.latestData;
      if (canvasData !== null) {
        let image = new Image();
        image.onload = function () {
          ctx.drawImage(image, 0, 0);
          totalLoaded++;
          if (totalLoaded === totalImages) {
            exportCanvasEle.toBlob(function (blob) {
              saveAs(blob, 'test-image.png');
            });
          }
        };
        image.src = canvasData;
      }
    });
  };
  return (
    <nav>
      <div>hg</div>
      <div>
        <div className="icons">
          <div className="icon">
            <FiRotateCcw color="7b8fa3" size="30px" style={{ margin: 'auto' }} />
          </div>
          <div className="icon">
            <FiRotateCw color="7b8fa3" size="30px" style={{ margin: 'auto' }} />
          </div>
        </div>
      </div>
      <div>
        <div className="save-options">
          <button className="button is-primary">Save</button>
          <button className="button is-primary" onClick={onExportImageClick}>
            Export image
          </button>
        </div>
        <button className="profile">
          <FiUser color="e3e3e3" size="30px" style={{ margin: 'auto' }} />
        </button>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings, layers: state.layers };
};

export default connect(mapStateToProps)(Navigation);
