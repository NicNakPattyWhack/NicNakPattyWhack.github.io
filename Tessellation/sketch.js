// save("SVG.svg")

// p5.disableFriendlyErrors = true;

let actionHistory = [];
let historyIndex = 0;
let tesselation;
let buttons = [];
let edgeButtons = [];
let sliders = [];
let vertices = [];
let itemSelectedType = null;
let pointSelected = null;
let lineSelected = null;
let buttonSelected = null;
let sliderSelected = null;
let saveSVGScreen;
let mouseOffset;
let currentSide = 0;
let upload = false;
let midPoint;
let printScale = 1;
let myFont;

function preload() {
  myFont = loadFont("Oswald-VariableFont_wght.ttf");
}

function setup() {
  // createCanvas(displayWidth, displayHeight);
  // createCanvas(displayHeight, displayWidth);
  if (windowWidth > windowHeight) {
    createCanvas(windowWidth, windowHeight);
    // saveSVGScreen = createGraphics(windowWidth, windowHeight, SVG);
  }
  else if (windowWidth < windowHeight) {
    createCanvas(windowHeight, windowWidth);
    // saveSVGScreen = createGraphics(windowHeight, windowWidth, SVG);
  }
  // frameRate(30)

  dim = min(width, height);
  // end = createVector((width - dim) / 2 + 150, (height - dim) / 2 + 150);

  // lines.push(new Line("line", end.x, end.y));

  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", end.x, end.y, 150, 200));
  // lines.push(new Line("line", end.x, end.y, 150, 200));

  tesselation = [
    {
      end: createVector((width - dim) / 2 + 150, (height - dim) / 2 + 150),
      lines: []
    },
    {
      end: createVector((width - dim) / 2 + 150, (height - dim) / 2 + 150),
      lines: []
    }
  ];

  buttons.push(new Button(width - 30, 30, 40, color(225, 225, 225), "line", false));
  buttons.push(new Button(width - 80, 30, 40, color(225, 225, 225), "curve", false));
  buttons.push(new Button(width - 130, 30, 40, color(255, 160, 160), "delete", false));
  buttons.push(new Button(width - 180, 30, 40, color(160, 255, 160), "upload", false));
  // buttons.push(new Button(width - 230, 30, 40, color(160, 160, 255), "full", false));
  buttons.push(new Button(30, 30, 40, color(255, 160, 160), "back", true));
  buttons.push(new Button(width - 230, 30, 40, color(160, 255, 160), "save", true));
  // buttons.push(new Button(width - 280, 30, 40, color(160, 160, 255), "print", true));
  buttons.push(new Button(width - 280, 30, 40, color(160, 160, 255), "undo", false));
  buttons.push(new Button(width - 330, 30, 40, color(160, 160, 255), "redo", false));


  edgeButtons.push(new edgeButton(width - 120, 80, width - 40, 80, 0));
  edgeButtons.push(new edgeButton(width - 40, 160, width - 120, 160, 0));
  edgeButtons.push(new edgeButton(width - 40, 80, width - 40, 160, 1));
  edgeButtons.push(new edgeButton(width - 120, 160, width - 120, 80, 1));

  sliders.push(new Slider(width - 150, 30, width - 40, 30, 0.5, 2, 0.1, 1, color(255, 80, 80), "scale", true));
  sliders.push(new Slider(width - 150, 60, width - 40, 60, 0, 3, 1, 1, color(80, 80, 255), "rotate", true));

  // vertices.push(createVector(150, 150));
  // vertices.push(createVector(dim - 150, 150));
  // vertices.push(createVector(150, dim - 150));
  // vertices.push(createVector(dim - 150, dim - 150));

  // for (let i = 0; i < 4; i++) {
  //   let angle = map(i, 0, 4, 0, TWO_PI) - PI * 3 / 4;
  //   let x = width / 2 + cos(angle) * 150;
  //   let y = height / 2 + sin(angle) * 150;

  //   vertices.push(createVector(x, y))
  // }

  vertices.push(
    createVector((width - dim) / 2 + 150, (height - dim) / 2 + 150)
  );
  vertices.push(
    createVector((width + dim) / 2 - 150, (height - dim) / 2 + 150)
  );
  vertices.push(
    createVector((width - dim) / 2 + 150, (height + dim) / 2 - 150)
  );
  vertices.push(
    createVector((width + dim) / 2 - 150, (height + dim) / 2 - 150)
  );

  midPoint = createVector(0, 0);
  for (let v of vertices) {
    midPoint.add(v);
  }
  midPoint.div(4);

  mouseOffset = createVector();
}

function keyPressed() {
  if (key == "f") fullscreen(true);
}

function updateHistory() {
  background(255, 0, 0);
  frameRate(5);
  actionHistory.splice(historyIndex + 1, Infinity);
  actionHistory.push([
    {
      end: tesselation[0].end,
      lines: tesselation[0].lines
    },
    {
      end: tesselation[1].end,
      lines: tesselation[1].lines
    }
  ]);
  historyIndex++;
}

function draw() {
  background(255);

  push();
  noStroke();
  fill(0);
  text(historyIndex, 20, 20);
  text(actionHistory, 20, 40);
  pop();

  // noStroke();
  // fill(0);
  // text(mouseIsPressed, mouseX, mouseY - 20);

  // pointSelected = null;
  // lineSelected = null;
  // background(128 + 255 * noise(0, frameCount * 0.01), 128 + 255 * noise(10, frameCount * 0.01), 128 + 255 * noise(0, frameCount * 0.01));

  printScale = sliders[0].value;

  if (!upload) {
    push();
    stroke(0);
    strokeWeight(5);
    for (let v of vertices) {
      point(v);
    }
    pop();

    drawEverything(false);

    for (let edgeButton of edgeButtons) {
      edgeButton.display();
      edgeButton.hover();
    }
  } else {
    let x = [(width * 0.25), (width * 0.75), (width * 0.75), (width * 0.25)];
    let y = [(height * 0.25), (height * 0.25), (height * 0.75), (height * 0.75)];
    for (let i = 0; i < 4; i++) {
      push();
      translate(x[i], y[i]);
      scale(printScale * 0.5);
      rotate((PI / 2) * (i + sliders[1].value));

      translate(-midPoint.x, -midPoint.y);

      drawEverything(false);

      pop();
    }
  }

  for (let button of buttons) {
    if (upload == button.displayOnPrintScreen) button.display();
  }
  for (let slider of sliders) {
    if (upload == slider.displayOnPrintScreen) slider.display();
  }

  // text(pointSelected, 5, 20)
  // text(lineSelected, 5, 40)
}

function drawEverything(onlyTesselation) {
  let closest = 100;
  // pointSelected = null;
  // lineSelected = null;

  noFill();
  strokeWeight(2);
  // beginShape();
  // vertex(150, 150);
  for (let t of tesselation) {
    let lines = t.lines;
    for (let i in lines) {
      let x0 = vertices[0].x;
      let y0 = vertices[0].y;
      let x1 = lines[i].points[0].x;
      let y1 = lines[i].points[0].y;
      let x2;
      let y2;
      let x3;
      let y3;
      if (lines[i].type == "curve") {
        x2 = lines[i].points[1].x;
        y2 = lines[i].points[1].y;
        x3 = lines[i].points[2].x;
        y3 = lines[i].points[2].y;
      }

      x0 = i > 0 ? lines[i - 1].points[lines[i - 1].points.length - 1].x : x0;
      y0 = i > 0 ? lines[i - 1].points[lines[i - 1].points.length - 1].y : y0;

      if (!upload) {
        for (let offset of [0, dim - 300]) {
          for (let j in lines[i].points) {
            let x = lines[i].points[j].x;
            let y = lines[i].points[j].y;
            let d = currentSide == 0 ? dist(x, y, mouseX, mouseY - offset) : dist(x, y, mouseX - offset, mouseY);

            if (d < closest) {
              closest = d;
              lineSelected = lines[i];
              pointSelected = lines[i].points[j];
            }

            if (lines[i].type == "curve" && !onlyTesselation) {
              push();
              stroke(100, 64);
              strokeWeight(3);
              if (lines[i].side == 0) translate(0, offset);
              if (lines[i].side == 1) translate(offset, 0);
              line(x0, y0, x1, y1);
              line(x2, y2, x3, y3);
              pop();
            }
          }
        }
      }

      for (let offset of [0, dim - 300]) {
        push();
        stroke(0);
        strokeWeight(2);
        if (lines[i].side == 0) translate(0, offset);
        else translate(offset, 0);
        if (lines[i].type == "line") {
          line(x0, y0, x1, y1);
        } else if (lines[i].type == "curve") {
          bezier(x0, y0, x1, y1, x2, y2, x3, y3);
        }
        pop();
      }
    }
  }

  if (lineSelected != null && pointSelected != null && lineSelected.side == currentSide && !onlyTesselation) {
    for (let offset of [0, dim - 300]) {
      let d;
      push();
      if (currentSide == 0 && pointSelected.dist(createVector(mouseX, mouseY - offset)) < 20) {
        d = pointSelected.dist(createVector(mouseX, mouseY + offset)) < 20;
        translate(0, offset);
      } else if (currentSide == 1 && pointSelected.dist(createVector(mouseX - offset, mouseY)) < 20) {
        d = pointSelected.dist(createVector(mouseX + offset, mouseY)) < 20;
        translate(offset, 0);
      }

      if (d < 20) {
        strokeWeight(5);
        for (let p of lineSelected.points) {
          point(p.x, p.y);
        }

        translate(pointSelected);
        noStroke();
        fill(0, 128, 255, 64);
        circle(0, 0, 15);
        pop();
      }
    }
  }
}

function mousePressed() {
  itemSelectedType = null;
  lineSelected = null;
  pointSelected = null;
  buttonSelected = null;

  for (let button of buttons) {
    if (button.hover() && button.displayOnPrintScreen == upload) {
      itemSelectedType = "button";

      if (button.label == "line" || button.label == "curve") {
        updateHistory();

        addLine(button.label);
        lineType = button.label;
        return;
      } else if (button.label == "upload") {
        // resizeCanvas(windowWidth, windowWidth);
        upload = true;
        return;
      } else if (button.label == "delete") {
        updateHistory();

        for (let i = tesselation[currentSide].lines.length - 1; i >= 0; i--) {
          if (tesselation[currentSide].lines[i].side == currentSide) {
            tesselation[currentSide].lines.splice(i, 1);
            break;
          }
        }
        return;
      } else if (button.label == "full") {
        fullscreen(true);
        return;
      } else if (button.label == "save") {
        // noLoop();
        background(255);
        // resizeCanvas(window, 1000);
        let x = [(width * 0.25), (width * 0.75), (width * 0.75), (width * 0.25)];
        let y = [(height * 0.25), (height * 0.25), (height * 0.75), (height * 0.75)];
        for (let i = 0; i < 4; i++) {
          push();
          translate(x[i], y[i]);
          scale(printScale * 0.5);
          rotate((PI / 2) * (i + sliders[1].value));

          // translate(-midPoint.x, -midPoint.y);
          translate(-width / 2, -height / 2);

          drawEverything(false);

          pop();
        }
        saveCanvas("tesselation.png");
        console.log("SAVE");
        return;
      } else if (button.label == "print") {
        background(255);
        let x = [(width * 0.25), (width * 0.75), (width * 0.75), (width * 0.25)];
        let y = [(height * 0.25), (height * 0.25), (height * 0.75), (height * 0.75)];
        for (let i = 0; i < 4; i++) {
          push();
          translate(x[i], y[i]);
          scale(printScale * 0.5);
          rotate((PI / 2) * (i + sliders[1].value));

          translate(-midPoint.x, -midPoint.y);

          drawEverything(false);

          pop();
        }
        print();
        console.log("PRINT");
        return;
      } else if (button.label == "back") {
        // resizeCanvas(windowHeight, windowWidth)
        upload = false;
        return;
      } else if (button.label == "undo" && historyIndex > 0) {
        historyIndex--;
        tesselation = actionHistory[historyIndex];
      } else if (button.label == "redo" && historyIndex < actionHistory.length - 1) {
        historyIndex++;
        tesselation = actionHistory[historyIndex];
      }
      return;
    }
  }

  for (let i in sliders) {
    if (sliders[i].hover()) {
      itemSelectedType = "slider";

      sliderSelected = i;

      return;
    }
  }

  for (let edgeButton of edgeButtons) {
    if (edgeButton.hover()) {
      edgeButton.selected = true;
      currentSide = edgeButton.index;
    } else {
      edgeButton.selected = false;
    }
  }

  for (let button of buttons) {
    let d = dist(mouseX, mouseY, button.pos.x, button.pos.y);
    if (d < button.size / 2) {
      if (!upload) {

      }
    }
  }

  for (let edgeButton of edgeButtons) {
    if (edgeButton.hover()) {
      edgeButton.selected = true;
      currentSide = edgeButton.index;
    } else {
      edgeButton.selected = false;
    }
  }

  let nearestLine;
  let nearestPoint;
  let nearestDist = Infinity;
  for (let t of tesselation) {
    for (let l of t.lines) {
      for (let j in l.points) {
        let p = l.points[j];
        for (let offset of [0, dim - 300]) {
          let d;
          if (currentSide == 0) d = dist(p.x, p.y, mouseX, mouseY - offset);
          else if (currentSide == 1) d = dist(p.x, p.y, mouseX - offset, mouseY);

          if (d < nearestDist && d < 20) {
            itemSelectedType = "line";
            nearestLine = l;
            nearestPoint = p;
            nearestDist = d;
            if (currentSide == 0) mouseOffset.set(0, -offset);
            else if (currentSide == 1) mouseOffset.set(-offset, 0);

            break;
          }
        }
      }
    }
  }
  lineSelected = nearestLine;
  pointSelected = nearestPoint;
}

function mouseReleased() {
  if (itemSelectedType == "line") updateHistory();

  itemSelectedType = null;
  lineSelected = null;
  pointSelected = null;
  buttonSelected = null;
  mouseOffset.set(0, 0);

  if (!upload) {
    for (let i in vertices) {
      let d = dist(pmouseX, pmouseY, vertices[i].x, vertices[i].y);
      if (d < 10) {
        currentSide = min(1, currentSide + 1);
      }
    }
  }
}

function mouseDragged() {
  if (itemSelectedType == "slider") {
    let slider = sliders[sliderSelected];
    let m = map(mouseX, slider.p1.x, slider.p2.x, slider.range[0], slider.range[1]);
    let d = (slider.range[1] - slider.range[0]);
    if (abs(slider.defaultValue - m) < d * 0.05) slider.value = slider.defaultValue;
    else slider.value = floor(constrain(m, slider.range[0], slider.range[1]) / slider.step) * slider.step;
  }

  if (!upload && itemSelectedType == "line") {
    if (pointSelected != null && lineSelected != null && lineSelected.side == currentSide) {
      pointSelected.set(mouseX + mouseOffset.x, mouseY + mouseOffset.y);
      for (let v of vertices) {
        let d = dist(v.x, v.y, mouseX + mouseOffset.x, mouseY + mouseOffset.y);
        if (d < 10) {
          pointSelected.set(v.x, v.y);
          return false;
        }
      }
    }
  }
}

function addLine(type) {
  if (pointSelected == null && lineSelected == null) {
    if (tesselation[currentSide].lines.length > 0) {
      let i = tesselation[currentSide].lines.length - 1;
      let j = tesselation[currentSide].lines[i].points.length - 1;
      tesselation[currentSide].end.set(tesselation[currentSide].lines[i].points[j]);
    }

    if (type == "line") {
      tesselation[currentSide].lines.push(new Line("line", currentSide, tesselation[currentSide].end.x + 50, tesselation[currentSide].end.y + 50));
    } else if (type == "curve") {
      tesselation[currentSide].lines.push(
        new Line(
          "curve",
          currentSide,
          tesselation[currentSide].end.x + 50,
          tesselation[currentSide].end.y - 50,
          tesselation[currentSide].end.x + 50,
          tesselation[currentSide].end.y + 50,
          tesselation[currentSide].end.x + 100,
          tesselation[currentSide].end.y
        )
      );
    }
  }
}

function inBox(x, y, minX, minY, maxX, maxY) {
  if (x > minX && y > minY && x < maxX && y < maxY) return true;
  return false;
}

class Line {
  constructor(type, side, x1, y1, x2, y2, x3, y3) {
    this.type = type;
    this.side = side;
    this.points = [createVector(x1, y1)];

    if (type == "curve") {
      this.points.push(createVector(x2, y2));
      this.points.push(createVector(x3, y3));
    }
  }

  hover(x, y, i) {
    let p = this.points[i];
    if (dist(x, y, p.x, p.y) < 10) {
      return true;
    }
    return false;
  }
}

class Button {
  constructor(x, y, size, col, label, displayOnPrintScreen) {
    this.pos = createVector(x, y);
    this.size = size;
    this.pressed = false;
    this.col = col;
    this.label = label;
    this.displayOnPrintScreen = displayOnPrintScreen;
  }

  hover() {
    if (dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.size / 2) return true;
    return false;
  }

  display() {
    let s = this.size;

    push();
    strokeCap(ROUND);
    strokeJoin(ROUND);
    translate(this.pos);
    scale(s);

    stroke(red(this.col) * 0.7, green(this.col) * 0.7, blue(this.col) * 0.7);
    strokeWeight(3 / s);
    fill(this.col);

    if (this.pressed) {
      fill(red(this.col) * 0.5, green(this.col) * 0.5, blue(this.col) * 0.5);
    }
    circle(0, 0, 1);

    if (this.label == "line") {
      stroke(64);
      strokeWeight(2 / s);
      line(0.2, -0.25, -0.2, 0.25);
      strokeWeight(5 / s);
      point(0.2, -0.25);
      point(-0.2, 0.25);
    } else if (this.label == "curve") {
      stroke(64);
      strokeWeight(2 / s);
      bezier(0.2, -0.25, -0.25, -0.1, 0.25, 0.2, -0.2, 0.25);
      strokeWeight(5 / s);
      point(0.2, -0.25);
      point(-0.25, -0.1);
      point(0.25, 0.2);
      point(-0.2, 0.25);
    } else if (this.label == "print") {
      stroke(0);
      strokeWeight(3 / s);
      line(-0.25, -0.2, 0.25, -0.2);
      line(-0.25, -0.2, -0.25, 0.2);
      line(0.25, -0.2, 0.25, 0.2);
      line(-0.25, 0.2, -0.15, 0.2);
      line(0.25, 0.2, 0.15, 0.2);
      line(-0.25, -0.1, 0.25, -0.1);
      rect(-0.15, 0.05, 0.3, 0.25);
      strokeWeight(1 / s);
      line(-0.05, 0.15, 0.05, 0.15);
      line(-0.05, 0.2, 0.05, 0.2);
    } else if (this.label == "upload") {
      stroke(0);
      strokeWeight(3 / s);
      beginShape();
      vertex(-0.1, -0.15);
      vertex(-0.2, -0.15);
      vertex(-0.2, 0.25);
      vertex(0.2, 0.25);
      vertex(0.2, -0.15);
      vertex(0.1, -0.15);
      endShape();
      line(0, 0.05, 0, -0.35);
      line(0, -0.35, -0.1, -0.25);
      line(0, -0.35, 0.1, -0.25);
    } else if (this.label == "delete") {
      stroke(0);
      strokeWeight(3 / s);
      noFill();
      rect(-0.2, -0.2, 0.4, 0.5);
      line(-0.25, -0.2, 0.25, -0.2);
      arc(0, -0.2, 0.1, 0.1, -PI, 0);
      strokeWeight(2 / s);
      line(-0.1, -0.1, -0.1, 0.2);
      line(0, -0.1, 0, 0.2);
      line(0.1, -0.1, 0.1, 0.2);
    } else if (this.label == "full") {
      stroke(0);
      strokeWeight(3 / s);
      line(-0.25, -0.25, -0.15, -0.25);
      line(0.25, -0.25, 0.15, -0.25);
      line(-0.25, 0.25, -0.15, 0.25);
      line(0.25, 0.25, 0.15, 0.25);
      line(-0.25, -0.25, -0.25, -0.15);
      line(-0.25, 0.25, -0.25, 0.15);
      line(0.25, -0.25, 0.25, -0.15);
      line(0.25, 0.25, 0.25, 0.15);
    } else if (this.label == "back") {
      stroke(0);
      strokeWeight(3 / s);
      line(-0.25, 0, 0.25, 0);
      line(-0.25, 0, 0, -0.25);
      line(-0.25, 0, 0, 0.25);
    } else if (this.label == "save") {
      stroke(0);
      strokeWeight(3 / s);
      beginShape();
      vertex(-0.2, 0.05);
      vertex(-0.2, 0.2);
      vertex(0.2, 0.2);
      vertex(0.2, 0.05);
      endShape();
      line(0, 0, 0, -0.25);
      line(0, 0.05, -0.1, -0.05);
      line(0, 0.05, 0.1, -0.05);
    } else if (this.label == "undo") {
      stroke(0);
      strokeWeight(3 / s);
      arc(0, 0, 0.4, 0.4, -HALF_PI, PI);
      line(-0.2, 0, -0.25, 0.05);
      line(-0.2, 0, -0.15, 0.05);
    }
    pop();
  }
}

class edgeButton {
  constructor(x1, y1, x2, y2, index) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);
    this.index = index;
    this.selected = false;
    this.hovered = false;
  }

  hover() {
    let d = this.p1.dist(this.p2);
    let angle = atan2(this.p2.x - this.p1.x, this.p2.y - this.p1.y);
    let x = mouseX - this.p1.x;
    let y = mouseY - this.p1.y;
    if (inBox(x * cos(angle) - y * sin(angle), x * sin(angle) + y * cos(angle), -5, 5, 5, d - 5)) {
      this.hovered = true;
      return true;
    } else {
      this.hovered = false;
      return false;
    }
  }

  display() {
    push();
    stroke(0, 100);
    strokeWeight(3);
    if (this.hovered) {
      strokeWeight(5);
    }
    if (this.index == currentSide) {
      stroke(255, 64, 0, 100);
      strokeWeight(5);
    }
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    stroke(0);
    strokeWeight(5);
    point(this.p1);
    point(this.p2);
    pop();
  }
}

class Slider {
  constructor(x1, y1, x2, y2, minVal, maxVal, step, defaultValue, col, label, displayOnPrintScreen) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);
    this.range = [minVal, maxVal];
    this.defaultValue = defaultValue;
    this.step = step;
    this.value = defaultValue;
    this.col = col;
    this.label = label;
    this.displayOnPrintScreen = displayOnPrintScreen;
  }

  hover() {
    if (inBox(mouseX, mouseY, this.p1.x - 5, this.p1.y - 5, this.p2.x + 5, this.p2.y + 5)) return true;
    return false;
  }

  display() {
    push();
    stroke(128, 100);
    strokeWeight(5);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    stroke(64);
    strokeWeight(3);
    point(p5.Vector.lerp(this.p1, this.p2, map(this.defaultValue, this.range[0], this.range[1], 0, 1)));
    // point(p5.Vector.lerp(this.p1, this.p2, 0.5));
    stroke(red(this.col), green(this.col), blue(this.col), 100);
    strokeWeight(15);
    point(p5.Vector.lerp(this.p1, this.p2, map(this.value, this.range[0], this.range[1], 0, 1)));
    stroke(this.col);
    strokeWeight(5);
    point(p5.Vector.lerp(this.p1, this.p2, map(this.value, this.range[0], this.range[1], 0, 1)));
    // noStroke();
    stroke(64);
    strokeWeight(1);
    strokeJoin(ROUND);
    fill(64);
    let label = "";
    if (this.label == "scale") label = "SCALE";
    if (this.label == "rotate") label = "RTOATE";
    textFont(myFont);
    textSize(16);
    textAlign(LEFT);
    text(`${round(this.value, 1)}`, this.p2.x + 10, this.p2.y + 6);
    textAlign(RIGHT);
    text(`${label}`, this.p1.x - 10, this.p1.y + 6);
    pop();
  }
}