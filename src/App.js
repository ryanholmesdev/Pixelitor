import React, { Component } from 'react';
import './App.scss';
import Navigation from './components/Navigation/Navigation';
import SideNav from './components/SideNav/SideNav';
import RightNav from './components/RightNav/RightNav';
import tools from './data/Tools';
import CanvasDocument from './components/CanvasDocument/CanvasDocument';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: tools,
      activeToolName: tools[0].name,
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

  undo = () => {};

  keyDownHandler = (e) => {
    if (e.keyCode === 90 && e.ctrlKey) {
      this.undo();
    }
  };
  componentDidMount() {
    document.addEventListener('keydown', this.keyDownHandler);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  render() {
    return (
      <div className="App">
        <Navigation></Navigation>
        <div className="container">
          <SideNav tools={this.state.tools} setActive={this.setActiveTool}></SideNav>
          <div className="main-content">
            <CanvasDocument activeToolName={this.state.activeToolName}></CanvasDocument>
          </div>
          <RightNav></RightNav>
        </div>
      </div>
    );
  }
}
