// save("SVG.svg")

// p5.disableFriendlyErrors = true;

let tesselation;
// let lines = [];
let buttons = [];
let edgeButtons = [];
let vertices = [];
// let end;
let pointSelected = null;
let lineSelected = null;
let buttonSelected = false;
let currentSide = 0;
let runPrint = false;
let midPoint;
let printScale = 1;
// adwdq
let myFont;

function preload() {
  myFont = loadFont("Oswald-VariableFont_wght.ttf")
}

function setup() {
  // createCanvas(displayWidth, displayHeight);
  // createCanvas(displayHeight, displayWidth);
  createCanvas(windowWidth, windowHeight);
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
  buttons.push(new Button(width - 180, 30, 40, color(160, 255, 160), "print", false));
  buttons.push(new Button(width - 230, 30, 40, color(160, 160, 255), "full", false));
  buttons.push(new Button(width - 30, 30, 40, color(255, 160, 255), "scale", true));


  edgeButtons.push(new edgeButton(width - 120, 80, width - 40, 80, 0));
  edgeButtons.push(new edgeButton(width - 40, 160, width - 120, 160, 0));
  edgeButtons.push(new edgeButton(width - 40, 80, width - 40, 160, 1));
  edgeButtons.push(new edgeButton(width - 120, 160, width - 120, 80, 1));

  // buttons.push(new Button(width - 280, 30, 40, color(160, 160, 255), "save"));

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
}

function keyPressed() {
  if (key == "f") fullscreen(true);
}

function draw() {
  background(255);
  // background(128 + 255 * noise(0, frameCount * 0.01), 128 + 255 * noise(10, frameCount * 0.01), 128 + 255 * noise(0, frameCount * 0.01));

  for (let button of buttons) {
    if (runPrint == button.displayOnPrintScreen) button.display();
  }

  if (!runPrint) {
    push();
    strokeWeight(5);
    for (let v of vertices) {
      point(v);
    }
    pop();

    drawEverything();

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
      rotate((PI / 2) * i);

      translate(-midPoint.x, -midPoint.y);

      drawEverything();

      pop();
    }
  }
}

function drawEverything() {
  let closest = 100;
  pointSelected = null;
  lineSelected = null;

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

      if (!runPrint) {
        for (let n of [0, dim - 300]) {
          for (let j in lines[i].points) {
            let x = lines[i].points[j].x;
            let y = lines[i].points[j].y;
            let d = currentSide == 0 ? dist(x, y, mouseX, mouseY - n) : dist(x, y, mouseX - n, mouseY);

            if (d < closest) {
              closest = d;
              lineSelected = i;
              pointSelected = j;
            }

            if (lines[i].type == "curve") {
              push();
              stroke(0, 32);
              strokeWeight(3);
              // point(lines[i].points[j]);

              line(x0, y0, x1, y1);
              line(x2, y2, x3, y3);
              pop();
            }
          }
        }

        if (lineSelected == i && pointSelected != null && closest < 20) {
          push();
          strokeWeight(5);
          for (let pt of lines[lineSelected].points) {
            point(pt.x, pt.y);
          }
          pop();

          push();
          translate(lines[lineSelected].points[pointSelected]);
          // strokeWeight(1);
          noStroke();
          fill(0, 128, 255, 64);
          circle(0, 0, 15);
          pop();
        }
      }
      // console.log(x0, y0)

      for (let n of [0, dim - 300]) {
        push();
        if (lines[i].side == 0) translate(0, n);
        else translate(n, 0);
        if (lines[i].type == "line") {
          line(x0, y0, x1, y1);
        } else if (lines[i].type == "curve") {
          bezier(x0, y0, x1, y1, x2, y2, x3, y3);
        }
        pop();
      }
    }
  }
}

function mousePressed() {
  // function mouseReleased() {
  lineSelected = null;
  pointSelected = null;
  buttonSelected = false;

  // console.log(mouseX, mouseY, pmouseX, pmouseY);
  for (let button of buttons) {
    let d = dist(mouseX, mouseY, button.pos.x, button.pos.y);
    if (d < button.size / 2) {
      if (!runPrint) {
        if (button.label == "line" || button.label == "curve") {
          addLine(button.label);
          lineType = button.label;
          return false;
        } else if (button.label == "print") {
          runPrint = true;
          buttonSelected = true;
          return false;
        } else if (button.label == "delete") {
          for (let i = tesselation[currentSide].lines.length - 1; i >= 0; i--) {
            if (tesselation[currentSide].lines[i].side == currentSide) {
              tesselation[currentSide].lines.splice(i, 1);
              break;
            }
          }
          return false;
        } else if (button.label == "full") {
          fullscreen(true);
          return false;
        }
      } else {
        if (button.label == "save") {
          return false;
        }
        if (button.label == "scale") {
          let nextPrintScale = 0;
          if (printScale == 0.2) nextPrintScale = 0.25;
          if (printScale == 0.25) nextPrintScale = 0.3;
          if (printScale == 0.3) nextPrintScale = 0.35;
          if (printScale == 0.35) nextPrintScale = 0.4;
          if (printScale == 0.4) nextPrintScale = 0.5;
          if (printScale == 0.5) nextPrintScale = 0.75;
          if (printScale == 0.75) nextPrintScale = 1;
          if (printScale == 1) nextPrintScale = 0.2;
          printScale = nextPrintScale;
          return false;
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

    for (let t of tesselation) {
      let lines = t.lines;
      for (let i in lines) {
        for (let j in lines[i].points) {
          for (let n of [0, dim - 300]) {
            let p = lines[i].points[j];
            let d = currentSide == 0 ? dist(mouseX, mouseY - n, p.x, p.y) : dist(mouseX - n, mouseY, p.x, p.y);
            if (d < 20) {
              lineSelected = i;
              pointSelected = j;
            }
          }
        }
      }
    }
  }
}

function mouseReleased() {
  if (!runPrint) {
    for (let i in vertices) {
      // for (let n of [0, dim - 300]) {
      // let d = currentSize == 0 ? dist(pmouseX, pmouseY - n, vertices[i].x, vertices[i].y) : dist(pmouseX - n, pmouseY, vertices[i].x, vertices[i].y);
      // }
      // let d = dist(pmouseX, pmouseY, vertices[i].x, vertices[i].y);
      let d = dist(pmouseX, pmouseY, vertices[i].x, vertices[i].y);
      if (d < 10) {
        // if (i == 0 || i == 2) {
        //   currentSide = "NS";
        // } else {
        //   currentSide = "EW";
        // }
        currentSide = min(1, currentSide + 1);
      }
    }
  }

  lineSelected = null;
  pointSelected = null;
  buttonSelected = false;
}

function mouseDragged() {
  if (!runPrint && !buttonSelected) {
    if (pointSelected != null && lineSelected != null) {
      for (let v of vertices) {
        for (let n of [0, dim - 300]) {
          // console.log(n)
          // for (let N = 0; N <= 1; N++) {
          //   let n = [0, dim - 300][N];
          let d = dist(v.x, v.y, mouseX, mouseY);
          if (d < 10) {
            tesselation[currentSide].lines[lineSelected].points[pointSelected].set(v.x, v.y);
            // tesselation[currentSide].lines[lineSelected].points[pointSelected].set(mouseX, mouseY - n);
            return false;
          }
        }
      }

      // if (tesselation[currentSide].lines.length > 0) {
      let v = tesselation[currentSide].lines[lineSelected].points[pointSelected];
      // }
      for (let n of [0, dim - 300]) {
        let d = currentSide == 0 ? dist(v.x, v.y, mouseX, mouseY - n) : dist(v.x, v.y, mouseX - n, mouseY);
        if (currentSide == 0) {
          tesselation[currentSide].lines[lineSelected].points[pointSelected].set(mouseX, mouseY - n);
        } else if (currentSide == 1) {
          tesselation[currentSide].lines[lineSelected].points[pointSelected].set(mouseX - n, mouseY);
        }

        return false;
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
    // if (this.type == "line") this.points = [createVector(x1, y1)];

    console.log(type);
    if (type == "curve") {
      this.points.push(createVector(x2, y2));
      this.points.push(createVector(x3, y3));
    }
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
    } else if (this.label == "scale") {
      textAlign(CENTER);
      textSize(0.5);
      textFont(myFont)
      fill(255);
      stroke(0)
      strokeWeight(0.1)
      text(printScale, 0, 0.2);
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
    // let angle = PI / 3;
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