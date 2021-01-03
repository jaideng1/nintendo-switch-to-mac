const HID = require("node-hid");
const { Joycon, JoyconLeft, JoyconRight } = require("./joycons.js")
const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
var socketIO = require('socket.io');
var http = require('http');
var path = require('path');
var robot = require("robotjs");

var controllers = [];
var devices;
let productIds = [8198, 8199];

let updateInfo;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

var server = http.Server(app);
var io = socketIO(server);


function detectDevices() {
  devices = HID.devices()
  console.log("Devices connected: " + devices.length)
  console.log("Found devices with corresponding vendor id: " + devices.filter(device => device.vendorId === 1406).length);
  let joycons = devices.map(device => {
    return (productIds.includes(device.productId)) ? device : null;
  })
  joycons = joycons.filter(device => device != null);
  console.log("Joycons found: " + joycons.length);

  if (joycons.length === 0) {
    console.log("Closing program due to no controllers detected.")
    process.exit(1);
    return;
  }

  //console.log("Adding joycons might take a couple seconds... (Predicted: " + ((joycons.length - 1) * 3000) + "ms)")
  for (let i = 0; i < 1/*joycons.length*/; i++) {
    //setTimeout(function() {
      console.log("Added joycon: " + joycons[i].product);
      controllers.push(Joycon.getJoycon(joycons[i].path, joycons[i]))
    //}, 3000 * i);
  }
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

function typeButtons(b) {
  //I know this is really inefficent, i know i could have use switches
  //but i didn't want to loool
  try {
    if (b.b && mouseReleased) {
      robot.mouseToggle("down");
      mouseReleased = false;
    } else if (!b.b && !mouseReleased) {
      robot.mouseToggle("up");
      mouseReleased = true;
    }
  } catch (e) {}

  try {
    if (b.a && rightMouseReleased) {
      robot.mouseToggle("down", "right");
      rightMouseReleased = false;
    } else if (!b.a && !rightMouseReleased) {
      robot.mouseToggle("up", "right");
      rightMouseReleased = true;
    }
  } catch (e) {}

  try {
    let joycon = b.joycon;

    let mouse = robot.getMousePos();
    let xmod = 0;
    let ymod = 0;
    if (joycon.left) {
      ymod += MouseMove;
    }
    if (joycon.right) {
      ymod -= MouseMove;
    }
    if (joycon.up) {
      xmod -= MouseMove;
    }
    if (joycon.down) {
      xmod += MouseMove;
    }
    if (joycon.raw_dir == 45) {
      ymod = -MouseMove;
    }

    if (!b.sl) {
      robot.moveMouse(mouse.x + xmod, mouse.y + ymod);
    }
  } catch (e) {}

  try {
    if (b.sl) {
      let tgl = {
        w: null,
        a: null,
        s: null,
        d: null,
        dbtm: true
      }
      let joycon = b.joycon;
      if (joycon.raw_dir == 0) {
        tgl.w = true;
      } else if (joycon.raw_dir == 45) {
        tgl.w = true;
        tgl.a = true;
      } else if (joycon.raw_dir == 90) {
        tgl.a = true;
      } else if (joycon.raw_dir == 135) {
        tgl.a = true;
        tgl.s = true;
      } else if (joycon.raw_dir == 180) {
        tgl.s = true;
      } else if (joycon.raw_dir == 225) {
        tgl.s = true;
        tgl.d = true;
      } else if (joycon.raw_dir == 270) {
        tgl.d = true;
      } else if (joycon.raw_dir == 315) {
        tgl.d = true;
        tgl.w = true;
      } else if (joycon.raw_dir == -1) {
        if (keys.w) {
          robot.keyToggle("w", "up")
        }
        if (keys.a) {
          robot.keyToggle("a", "up")
        }
        if (keys.s) {
          robot.keyToggle("s", "up")
        }
        if (keys.d) {
          robot.keyToggle("d", "up")
        }
        keys = {
          w: false,
          a: false,
          s: false,
          d: false
        }
        tgl.dbtm = false;

      }

      if (tgl.dbtm) {
        if (tgl.w && !keys.w) {
          robot.keyToggle("w", "down")
        } else if (!(!!tgl.w) && keys.w) {
          robot.keyToggle("w", "up")
        }
        if (tgl.a && !keys.a) {
          robot.keyToggle("a", "down")
        } else if (!(!!tgl.a) && keys.a) {
          robot.keyToggle("a", "up")
        }
        if (tgl.s && !keys.s) {
          robot.keyToggle("s", "down")
        } else if (!(!!tgl.a) && keys.a) {
          robot.keyToggle("a", "up")
        }
        if (tgl.d && !keys.d) {
          robot.keyToggle("d", "down")
        } else if (!(!!tgl.a) && keys.a) {
          robot.keyToggle("a", "up")
        }
      }


      keys = {
        w: !!tgl.w,
        a: !!tgl.a,
        s: !!tgl.s,
        d: !!tgl.d,
      }


    }


  } catch (e) {}
  /*
  try {

  } catch (e) {}
  */

}


setTimeout(function() {
  detectDevices();
  updateInfo = setInterval(function() {
    // fs.writeFile('data.json', JSON.stringify({controllers: controllers}), (err) => {
    //   if (err) throw err;
    // })
    let b = [];
    for (let i = 0; i < controllers.length; i++) {
      typeButtons(controllers[i].buttons)
      b.push({
        name: controllers[i].name,
        buttons: controllers[i].buttons,
      })
      //b[i]["name"] = controllers[i].model.product;
    }
    io.sockets.emit('cdata', {
      joycons: b
    });

  }, 20);
}, 3000);

const PORT = 3000;

server.listen(PORT, () => {
  console.log('Starting server on port ' + PORT);
  console.log("Wait 3 seconds to load joycons...")
  console.log('')
  // console.log('     &&&&&&          &&&&&&      ')
  // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
  // console.log('&                            X  &')
  // console.log('&  X    /-\\              X      &')
  // console.log(' &     | & |           X   X   &')
  // console.log('  &     \\-/              X     &')
  // console.log('   &&&&&&&&&&&&&&&&&&&&&&&&&&&& ')

});
