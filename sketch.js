// 2D Water Ripples
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/102-2d-water-ripple.html
// https://youtu.be/BZUdGqeOD0w
// https://editor.p5js.org/codingtrain/sketches/tYXtzNSl

// Algorithm: https://web.archive.org/web/20160418004149/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

let cols;
let rows;
let current; // = new float[cols][rows];
let previous; // = new float[cols][rows];

let dampening = 0.995;
let offset = 35;

// droplet array encoding the position of each droplet and its size
let droplets = [];

function setup() {
    // reset();
    // createCanvas(1420, 760);
    //   createcanvas(windowWidth-10, windowHeight-10);
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
  cols = width;
  rows = height;
  // The following line initializes a 2D cols-by-rows array with zeroes
  // in every array cell, and is equivalent to this Processing line:
  // current = new float[cols][rows];
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
}

function mouseClicked() {
    pushDroplet(mouseX, mouseY, 10);
}

function draw() {
    waterLevel = height-int(hour()/24*height+minute()/60*height/24-offset);
    background(255);
    ripple();
    // pause one ms
    // delay(1);
    updateDroplets();

    // triggerRipple() every second
    if (frameCount % 60 == 0) {
        //if on the minute
        if (second() == 0) {
            //push a large droplet
            pushDroplet(int(random(20, width - 10)), 0, 20);
        }
        else {
            pushDroplet(int(random(20, width - 10)));
        }
    }

    // show cursor position on canvas
    // fill(0);
    // noStroke();

    drawTickMarks();
 
}
function triggerRipple(x) {
    previous[x][waterLevel+5] = 2500;
}

function ripple() {
    loadPixels();
  for (let i = 1; i < cols - 1; i++) {
    for (let j = waterLevel; j < rows - 1; j++) {
      current[i][j] =
        (previous[i - 1][j] +
          previous[i + 1][j] +
          previous[i][j - 1] +
          previous[i][j + 1]) /
          2 - current[i][j];
      current[i][j] = current[i][j] * dampening;
      // Unlike in Processing, the pixels array in p5.js has 4 entries
      // for each pixel, so we have to multiply the index by 4 and then
      // set the entries for each color component separately.
      let index = (i + j * cols) * 4;
      pixels[index + 0] = current[i][j];
      pixels[index + 1] = current[i][j] + 200;
      pixels[index + 2] = 255;
    }
  }
  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}
function pushDroplet(x, y=0, s=10) {
    // create a new droplet at a random x location at the top of the canvas
    // set the size of the droplet to 1
    // add the droplet to the droplet array
    v = 0.2; //initial velocity
    droplets.push([x, y, s, v]);
}

function updateDroplets() {
    // update the position of each droplet
    // if the droplet hits the water surface, create a ripple at that location

    g = 0.1;
    for (let i = 0; i < droplets.length; i++) {
        // draw droplet
        fill(0,200,255);
        ellipse(droplets[i][0], droplets[i][1], droplets[i][2]);
        // update droplet position and velocity
        droplets[i][1] += droplets[i][3];
        droplets[i][3] += g;
        if (abs(droplets[i][1] - waterLevel) < 3) {
            triggerRipple(droplets[i][0]);
            // remove the droplet from the array
            droplets.splice(i, 1);
        }
        if (droplets[i][1] > waterLevel) {
            // pop(droplets[i]); // remove the droplet from the array
        }
    }
}

function drawTickMarks() {
    // draw tick marks for each hour on the left side of the canvas
    // 24 tick marks for 24 hours
    // tick marks should be evenly spaced
    // number each tick mark with the hour it represents

    for (let i = 0; i < 24; i++) {
        let tickHeight = height/24;
        let tickWidth = 10;
        let tickX = 0;
        let tickY = offset + i*tickHeight;
        stroke(0);
        strokeWeight(1);
        line(tickX, tickY, tickX+tickWidth, tickY);
        noStroke();
        fill(0);
        text(24-i, tickX+tickWidth+5, tickY+5);
    }
}

function spray(x, y=waterLevel, s=1, v=0.2) {
    // create a new droplet at a random x location at the top of the canvas
    // set the size of the droplet to 1
    // add the droplet to the droplet array
    droplets.push([x, y, s, v]);
}