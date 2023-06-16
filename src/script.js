/**
 * Initial & Definition
 */
// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define Size
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const SCALE = 2;
const MIDDLE_X = WIDTH / 2;
const MIDDLE_Y = HEIGHT / 2;

// Color setup
let imageData, r, g, b, a;
let selectedColor = "#ff00ffff";
let brightnessbarColor = "#ffffff";

// Selected rectangle no.
let selectedRectangle = 1;

// Draw Rectabgles
let rect_width = 100;
let rect_space = 20;
let rect_num = 4;

// Brightness slider active state
let isBrightnessSliderActive = false;

// Flag for recognize rectangle-select vs color-pick
let rect_pick_flag = false;

/**
 * Functions
 */

// Function to draw the color wheel
function drawColorWheel() {
  const radius = MIDDLE_Y / 2;
  const centerX = (MIDDLE_X / 3) * 2;
  const centerY = MIDDLE_Y;
  for (let angle = 0; angle < 360; angle++) {
    const startAngle = (angle * Math.PI) / 180;
    const endAngle = ((angle + 1.5) * Math.PI) / 180;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, "#FFFFFF");
    gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// Function to draw the color pick circle
function drawColorPickCircle(x, y) {
  const radius = MIDDLE_Y / 2;
  const centerX = (MIDDLE_X / 3) * 2;
  const centerY = MIDDLE_Y;
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  if (distance <= radius) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = selectedColor;
    ctx.fill();
  }
}

// Draw Init Rectangles
function drawInitialRectangles() {
  for (let i = 0; i <= rect_num - 1; i++) {
    ctx.beginPath();
    ctx.fillStyle = selectedColor;
    ctx.fillRect(
      rect_space + i * (rect_width + rect_space),
      rect_space,
      rect_width,
      rect_width
    );
    drawColorValue(i, selectedColor);
  }
}

// Fill-up selected Rectangle with picked color
function drawColorPickedRectangle(i) {
  ctx.beginPath();
  ctx.fillStyle = selectedColor;
  ctx.fillRect(
    rect_space + i * (rect_width + rect_space),
    rect_space,
    rect_width,
    rect_width
  );
  drawColorValue(i, selectedColor);
}

// Write color value below the rectangle
function drawColorValue(i, color) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  const x = rect_space + i * (rect_width + rect_space);
  const y = rect_space + rect_width + 20;
  const width = ctx.measureText(color).width + 20;
  ctx.fillRect(x, y, width, 20);
  ctx.fillStyle = "white";
  ctx.fillText(color, x + 5, y + 15);
}

// Update the picked-color
function updatePickedColor(x, y) {
  const radius = MIDDLE_Y / 2;
  const centerX = (MIDDLE_X / 3) * 2;
  const centerY = MIDDLE_Y;
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  if (distance <= radius) {
    imageData = ctx.getImageData(x, y, 1, 1);
    r = imageData.data[0];
    g = imageData.data[1];
    b = imageData.data[2];
    a = imageData.data[3];
    selectedColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${a
      .toString(16)
      .padStart(2, "0")}`;
    brightnessbarColor = selectedColor;
    console.log(`Color at (${x}, ${y}): ${selectedColor}`);
  }
  drawColorPickedRectangle(selectedRectangle - 1);
  drawBrightnessBar();
}

// Draw the brightness bar
function drawBrightnessBar() {
  const barX = MIDDLE_X + MIDDLE_X / 3 + MIDDLE_Y / 5 + 10; // Adjust this value to position the bar
  const barY = MIDDLE_Y - MIDDLE_Y / 3;
  const barHeight = (MIDDLE_Y / 3) * 2;
  const gradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
  gradient.addColorStop(0, brightnessbarColor);
  gradient.addColorStop(1, "black");
  ctx.fillStyle = gradient;
  ctx.fillRect(barX, barY, 20, barHeight);
  ctx.strokeStyle = "black";
  ctx.strokeRect(barX, barY, 20, barHeight);
}

// Adjust brightness
function adjustBrightness(r, g, b, a, brightnessFactor) {
  return [
    Math.round(r * brightnessFactor),
    Math.round(g * brightnessFactor),
    Math.round(b * brightnessFactor),
    a,
  ];
}

canvas.addEventListener("mousedown", function (event) {
  const barX = MIDDLE_X + MIDDLE_X / 3 + MIDDLE_Y / 5 + 10;
  const barY = MIDDLE_Y - MIDDLE_Y / 3;
  const barHeight = (MIDDLE_Y / 3) * 2;
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  if (
    mouseX >= barX &&
    mouseX <= barX + 20 &&
    mouseY >= barY &&
    mouseY <= barY + barHeight
  ) {
    isBrightnessSliderActive = true;
  }
});

canvas.addEventListener("mouseup", function () {
  isBrightnessSliderActive = false;
});

canvas.addEventListener("mousemove", function (event) {
  if (isBrightnessSliderActive) {
    const barY = MIDDLE_Y - MIDDLE_Y / 3;
    const barHeight = (MIDDLE_Y / 3) * 2;
    const mouseY = event.offsetY;
    const brightnessFactor = 1 - (mouseY - barY) / barHeight;
    const [newR, newG, newB, newA] = adjustBrightness(
      r,
      g,
      b,
      a,
      brightnessFactor
    );
    selectedColor = `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}${newA
      .toString(16)
      .padStart(2, "0")}`;
    drawColorPickedRectangle(selectedRectangle - 1);
  }
});

// Color Pick
canvas.addEventListener("click", function (event) {
  drawColorWheel();
  const x = event.offsetX;
  const y = event.offsetY;
  if (y >= 20 && y <= 120) {
    for (let i = 0; i <= rect_num - 1; i++) {
      if (
        x >= rect_space + i * (rect_width + rect_space) &&
        x <= rect_space + i * (rect_width + rect_space) + 100
      ) {
        selectedRectangle = i + 1;
        rect_pick_flag = true;
      }
    }
  }
  if (!rect_pick_flag) {
    updatePickedColor(x, y);
    drawColorPickCircle(x, y);
  }
  rect_pick_flag = false;
});

drawColorWheel();
drawInitialRectangles();
drawBrightnessBar();
