const fs = require("fs")
const { app } = require('electron');

var buttons = [];
var name = "";

setInterval(() => {
  fs.readFile(__dirname + "/data.json", (err, dt) => {
    if (err) throw err;
    let data;
    try {
      data = JSON.parse(dt)
    } catch (e) {return;}
    if (data.controllers == null) return;
    if (data.controllers[0] == null) return;
    if (data.controllers[0].name == null) return;
    name = data.controllers[0].name;
    if (data.controllers[0].buttons == null) return;
    buttons = data.controllers[0].buttons;
  })
}, 100)

function setup() {
  createCanvas(500, 230);
}


function draw() {
  background(0)
  stroke(255)
  textSize(25);
  text(name,50,20);
  fill(249, 106, 90)
  line(50, 100-50, 325, 100-50);
  arc(100, 101-50, 100, 149-50, HALF_PI, PI)
  arc(275, 101-50, 100, 149-50, 0, HALF_PI)
  line(100, 175-50, 275, 175-50);
  noStroke();
  fill(255)
  rect(100, 101-50, 175, 74);
}

function closePrg() {
  app.close()
}
