// save("SVG.svg")

// p5.disableFriendlyErrors = true;

let lines = [];
let buttons = [];
let vertices = [];
let end;
let pointSelected = null;
let lineSelected = null;
let buttonSelected = false;
let currentSide = "NS";
let runPrint = false;

function setup() {
  // createCanvas(displayWidth, displayHeight);
  // createCanvas(displayHeight, displayWidth);
  createCanvas(windowWidth, windowHeight);
  // frameRate(30)

  dim = min(width, height);
  end = createVector((width - dim) / 2 + 150, (height - dim) / 2 + 150);

  // lines.push(new Line("line", end.x, end.y));

  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", 200, 100, 200, 200, 100, 150));
  // lines.push(new Line("curve", end.x, end.y, 150, 200));
  // lines.push(new Line("line", end.x, end.y, 150, 200));

  buttons.push(new Button(width - 30, 30, 40, color(225, 225, 225), "line"));
  buttons.push(new Button(width - 80, 30, 40, color(225, 225, 225), "curve"));
  buttons.push(new Button(width - 130, 30, 40, color(255, 160, 160), "delete"));
  buttons.push(new Button(width - 180, 30, 40, color(160, 255, 160), "print"));
  buttons.push(new Button(width - 230, 30, 40, color(160, 160, 255), "full"));
  // buttons.push(new Button(width - 280, 30, 40, color(160, 160, 255), "save"));

  // vertices.push(createVector(150, 150));
  // vertices.push(createVector(dim - 150, 150));
  // vertices.push(createVector(150, dim - 150));
  // vertices.push(createVector(dim - 150, dim - 150));
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
}

function keyPressed() {
  if (key == "f") fullscreen(true);
}

function draw() {
  background(255);

  if (!runPrint) {
    push();
    strokeWeight(5);
    for (let v of vertices) {
      point(v);
    }
    pop();

    drawEverything();

    for (let button of buttons) {
      button.display();
    }
  } else {
    push();
    for (let i = 0; i < 4; i++) {
      push();
      let x = [0, dim, 0, dim];
      let y = [0, dim, dim, 0];

      scale(0.5);
      translate(x[i] + dim / 2, y[i] + dim / 2);
      rotate((PI / 2) * i);
      translate(-dim / 2, -dim / 2);
      drawEverything();
      pop();
    }
    pop();
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
      for (let j in lines[i].points) {
        let x = lines[i].points[j].x;
        let y = lines[i].points[j].y;
        let d = dist(x, y, mouseX, mouseY);

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
      if (lines[i].side == "NS") translate(0, n);
      else translate(-n, 0);
      if (lines[i].type == "line") {
        line(x0, y0, x1, y1);
      } else if (lines[i].type == "curve") {
        bezier(x0, y0, x1, y1, x2, y2, x3, y3);
      }
      pop();
    }
  }
}

function mousePressed() {
  // function mouseReleased() {
  lineSelected = null;
  pointSelected = null;
  buttonSelected = false;

  console.log(mouseX, mouseY, pmouseX, pmouseY);
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
          lines.pop();
          return false;
        } else if (button.label == "full") {
          fullscreen(true);
          return false;
        }
      } else {
        if (button.label == "save") {
          return false;
        }
      }
    }

    for (let i in lines) {
      for (let j in lines[i].points) {
        let p = lines[i].points[j];
        let d = dist(mouseX, mouseY, p.x, p.y);
        if (d < 20) {
          lineSelected = i;
          pointSelected = j;
        }
      }
    }
  }
}

function mouseReleased() {
  if (!runPrint) {
    for (let i in vertices) {
      let d = dist(pmouseX, pmouseY, vertices[i].x, vertices[i].y);
      if (d < 10) {
        if (i == 0 || i == 2) {
          currentSide = "NS";
        } else {
          currentSide = "EW";
        }
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
        if (dist(v.x, v.y, mouseX, mouseY) < 10) {
          lines[lineSelected].points[pointSelected].set(v.x, v.y);

          return false;
        }
      }

      // let v = lines[lineSelected].points[pointSelected];
      // let d = dist(v.x, v.y, mouseX, mouseY);
      // if (d < 20)
      lines[lineSelected].points[pointSelected].set(mouseX, mouseY);

      return false;
    }
  }
}

function addLine(type) {
  if (pointSelected == null && lineSelected == null) {
    if (lines.length > 0) {
      let i = lines.length - 1;
      let j = lines[i].points.length - 1;
      end.set(lines[i].points[j]);
    }

    if (type == "line") {
      lines.push(new Line("line", currentSide, end.x + 50, end.y + 50));
    } else if (type == "curve") {
      lines.push(
        new Line(
          "curve",
          currentSide,
          end.x + 50,
          end.y - 50,
          end.x + 50,
          end.y + 50,
          end.x + 100,
          end.y
        )
      );
    }
  }
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
  constructor(x, y, size, col, label) {
    this.pos = createVector(x, y);
    this.size = size;
    this.pressed = false;
    this.col = col;
    this.label = label;
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
    }
    pop();
  }
}
