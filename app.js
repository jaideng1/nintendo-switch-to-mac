const HID = require("node-hid");
const { Joycon, JoyconLeft, JoyconRight } = require("./joycons.js")
const kt = require("./keytyper.js");
//const { Dualshock } = require("./dualshock.js");
const fs = require("fs");
const { app, BrowserWindow } = require('electron');
var http = require('http');
var path = require('path');


var controllers = [];
var devices;
const nintendoVendorId = 1406;
const nintendoProductIds = [8198, 8199];
const playstationVendorId = 1356;
const playstationProductIds = [2508];

let updateInfo;


function detectDevices() {
  devices = HID.devices()
  console.log(devices);
  console.log("Devices connected: " + devices.length)
  console.log("Found devices with Nintendo's corresponding vendor id: " + devices.filter(device => device.vendorId === nintendoVendorId).length);
  console.log("Found devices with Playstation's corresponding vendor id: " + devices.filter(device => device.vendorId === playstationVendorId).length);
  let joycons = devices.map(device => {
    return (nintendoProductIds.includes(device.productId) && device.vendorId === nintendoVendorId) ? device : null;
  })
  joycons = joycons.filter(device => device != null);
  console.log("Joycons found: " + joycons.length);

  let dualshocks = devices.map(device => {
    return (playstationProductIds.includes(device.productId) && device.vendorId === playstationVendorId) ? device : null;
  })
  dualshocks = dualshocks.filter(device => device != null);
  console.log("Unforunately, Macs do not seem to support dualshocks (i have no clue why lol)")

  if (joycons.length === 0 && dualshocks.length === 0) {
    console.log("Closing program due to no controllers detected.")
    try {app.quit()} catch(e) {process.exit(1);}
    return;
  }

  //console.log("Adding joycons might take a couple seconds... (Predicted: " + ((joycons.length - 1) * 3000) + "ms)")
  for (let i = 0; i < (joycons.length > 0) ? 1 : 0/*joycons.length*/; i++) {
    //setTimeout(function() {
      console.log("Added joycon: " + joycons[i].product + ", connection finallized in 1000ms.");
      setTimeout(function() {
        controllers.push(Joycon.getJoycon(joycons[i].path, joycons[i]))
      }, 1000);
    //}, 3000 * i);
  }
  // for (let j = 0; j < (dualshocks.length > 0) ? 1 : 0; j++) {
  //   console.log("Added dualshock: " + dualshocks[j].product);
  //   //controllers.push(new Dualshock(dualshocks[j].path, dualshocks[j]))
  //   ds.open(dualshocks[j])
  // }
  console.log("TODO: Able to add in multiple joycons.")

  // console.log(joycons[0])
  // console.log(controllers[0].device);

}

let mouseReleased = true;
let rightMouseReleased = true;

const MouseMove = 20;

let keys = {
  w: false,
  a: false,
  s: false,
  d: false
}



function createWindow () {
  const win = new BrowserWindow({
    width: 530,
    height: 300,
    //transparent: true,
    // frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('public/index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

setTimeout(function() {
  detectDevices();
  updateInfo = setInterval(function() {
    let b = [];
    for (let i = 0; i < controllers.length; i++) {
      kt.onButtons(controllers[i].buttons)
      b.push({
        name: controllers[i].name,
        buttons: controllers[i].buttons,
      })
      //b[i]["name"] = controllers[i].model.product;
    }
    fs.writeFile(__dirname + "/public/data.json", JSON.stringify({controllers: b}), (err) => {
      if (err) throw err;
    })
  }, 20);
}, 3000);
