import React, { Component } from 'react';
import './App.scss';
import Navigation from './components/Navigation/Navigation';
import SideNav from './components/SideNav/SideNav';
import RightNav from './components/RightNav/RightNav';

import tools from './data/Tools';
import settings from './data/ActiveSettings';
import Canvas from './components/Canvas/Canvas';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: tools,
      settings: settings,
    };
  }
  setActiveTool = (toolId) => {
    let tools = this.state.tools;
    tools.forEach((tool) => {
      if (tool.id === toolId) {
        tool.isSelected = true;
      } else {
        tool.isSelected = false;
      }
    });
    this.setState({
      tools: tools,
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

  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <div className="container">
          <SideNav tools={this.state.tools} setActive={this.setActiveTool}></SideNav>

          <div className="mainContent">
            <Canvas brushSize={this.state.settings.brushSize}></Canvas>
          </div>

          <RightNav
            color={this.state.settings.activeColor}
            onColorChange={this.handleColorChange}
            brushSize={this.state.settings.brushSize}
            onBrushSizeChange={this.brushChange}
          ></RightNav>
        </div>
      </div>
    );
  }
}
