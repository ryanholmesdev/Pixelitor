class layer {
  id = null;
  name = '';
  order = null;
  isSelected = true;
  isVisible = true;
  opacity = 100;
  drawHistory = [];
  latestData = null;
  constructor(id, image = null) {
    this.id = id;
    this.image = image;
    this.order = id;
    this.name = `Layer ${id}`;
  }
}

class drawHistory {
  color = null;
  size = null;
  // pen tool, line tool etc
  drawType = null;
  startX = null;
  startY = null;
  mouseX = null;
  mouseY = null;
  timestamp = null;
  constructor(color, size, opacity, drawType, mouseX, mouseY, startX = null, startY = null) {
    this.color = color;
    this.size = size;
    this.drawType = drawType;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.startX = startX;
    this.startY = startY;
    this.timestamp = new Date().getTime();
  }
}

const layers = [new layer(0)];

export { layers, layer, drawHistory };
