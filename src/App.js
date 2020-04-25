import React, { Component } from 'react';
import './App.scss';
import Navigation from './components/Navigation/Navigation';
import SideNav from './components/SideNav/SideNav';
import RightNav from './components/RightNav/RightNav';

import tools from './data/Tools';
import settings from './data/ActiveSettings';
import layers from './data/Layers';
import Canvas from './components/Canvas/Canvas';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: tools,
      settings: settings,
      activeToolName: tools[0].name,
      layers: layers,
    };
  }
  setActiveTool = (toolId) => {
    let tools = this.state.tools;
    let activeToolName = '';
    tools.forEach((tool) => {
      if (tool.id === toolId) {
        tool.isSelected = true;
        activeToolName = tool.name;
      } else {
        tool.isSelected = false;
      }
    });
    this.setState({
      tools: tools,
      activeToolName: activeToolName,
    });
  };
  handleColorChange = (newColor) => {
    let settings = this.state.settings;
    settings.activeColor = newColor.hex;
    this.setState({
      settings: settings,
    });
  };

  brushChange = (value) => {
    let settings = this.state.settings;
    settings.brushSize = parseInt(value);
    this.setState({
      settings: settings,
    });
  };

  updateLayer = (layers) => {
    this.setState({
      layers: layers,
    });
  };

  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <div className="container">
          <SideNav tools={this.state.tools} setActive={this.setActiveTool}></SideNav>

          <div className="main-content">
            <Canvas
              brushSize={this.state.settings.brushSize}
              color={this.state.settings.activeColor}
              activeToolName={this.state.activeToolName}
            ></Canvas>
          </div>

          <RightNav
            color={this.state.settings.activeColor}
            onColorChange={this.handleColorChange}
            brushSize={this.state.settings.brushSize}
            onBrushSizeChange={this.brushChange}
            layers={this.state.layers}
            updateLayers={this.updateLayer}
          ></RightNav>
        </div>
      </div>
    );
  }
}
