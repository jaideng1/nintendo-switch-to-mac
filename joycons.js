const HID = require("node-hid");

// https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering
// also thanks to the switch-joy-con for a couple references

const Dir = {
  RIGHT: 0x00,
  DOWN_RIGHT: 0x01,
  DOWN: 0x02,
  DOWN_LEFT: 0x03,
  LEFT: 0x04,
  UP_LEFT: 0x05,
  UP: 0x06,
  UP_RIGHT: 0x07,
  NEUTRAL: 0x08
};

const LED_VALUES = {
  ONE: 1,
  TWO: 2,
  THREE: 4,
  FOUR: 8,
  ONE_FLASH: 16,
  TWO_FLASH: 32,
  THREE_FLASH: 64,
  FOUR_FLASH: 128,
};

const Inps = {
  a: 0x01,
  left: 0x01,
  x: 0x02,
  down: 0x02,
  b: 0x04,
  up: 0x04,
  y: 0x08,
  right: 0x08,
  minus: 0x01,
  plus: 0x02,
  home: 0x10,
  ss: 0x20, //Screenshot
  sl: 0x10,
  sr: 0x20,
  r: 0x40,
  l: 0x40,
  zr: 0x80,
  zl: 0x80,
  ljd: 0x04, //Left joycon down
  rjd: 0x08 //Right joycon down
}


class Joycon {
  constructor(path, model) {
    this.device = new HID.HID(path);
    this.model = model;
    this.buttons;
    this.device.on("data", (bytes) => {
      //console.log(bytes)
      this.buttons = this.onInput(bytes);

      //console.log(this.buttons);
    });

    this.name = this.model.product;
    this.packetn = 0;
    this.changeLED(LED_VALUES.ONE)
  }
  // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering#joy-con-status-data-packet
  // 0x19,0x01,0x03,0x08,0x00,0x92,0x00,0x01,0x00,0x00,0x69,0x2d,0x1f
  requestData(data, value) {
    var bytes = new Array(0x40).fill(0);

    bytes[0] = 0x01;
    bytes[10] = data;
    bytes[11] = value;

    this.packetn = (this.packetn + 0x1) //% 0x10;

    bytes[1] = this.packetn;
    this.device.write(bytes)
  }
  // i have no clue ;-;
  // controllerVibration() {
  //   var bytes = new Array(0x40).fill(0);
  //   // if (this instanceof JoyconLeft) {
  //   //   byte[0] = 0x04;
  //   //   byte[1] = 0x00;
  //   //   byte[2] = 0x21;
  //   // }
  //   bytes[0] = 0x01;
  //   this.packetn = (this.packetn + 0x1);
  //
  //   bytes[1] = this.packetn;
  //   bytes[10] = 0x01;
  //   bytes[11] = 0x01;
  //
  //   bytes[12] = 0x04;
  //   bytes[13] = 0x80;
  //   bytes[14] = 0x40;
  //   bytes[15] = 0xFC;
  //
  //   bytes[16] = 0xC8;
  //   bytes[17] = 0x80;
  //   bytes[18] = 0x71;
  //   console.log(bytes)
  //
  //   this.device.write(bytes)
  // }
  changeLED(bit) {
    this.requestData(0x30, bit)
  }
  onInput(bytes) {
    if (bytes[0] !== 0x3f) return;
    return { raw_bytes: bytes };
  }
  getJoyconInputs(b) {
    let fj = {
      up: false,
      down: false,
      left: false,
      right: false,
      raw_dir: -1
    }
    if (Boolean(b[3] === Dir.RIGHT)) {
      fj.right = true;
      fj.raw_dir = 0;
    }
    if (Boolean(b[3] === Dir.LEFT)) {
      fj.left = true;
      fj.raw_dir = 180;
    }
    if (Boolean(b[3] === Dir.UP)) {
      fj.up = true;
      fj.raw_dir = 90;
    }
    if (Boolean(b[3] === Dir.DOWN)) {
      fj.down = true;
      fj.raw_dir = 270;
    }
    if (Boolean(b[3] === Dir.DOWN_LEFT)) {
      fj.down = true;
      fj.left = true;
      fj.raw_dir = 225;
    }
    if (Boolean(b[3] === Dir.DOWN_RIGHT)) {
      fj.right = true;
      fj.down = true;
      fj.raw_dir = 315;
    }
    if (Boolean(b[3] === Dir.UP_LEFT)) {
      fj.left = true;
      fj.up = true;
      fj.raw_dir = 135;
    }
    if (Boolean(b[3] === Dir.UP_RIGHT)) {
      fj.left = true;
      fj.up = true;
      fj.raw_dir = 45;
    }
    return fj;
  }
  static getJoycon(path, model) {
    return (model.product === 'Joy-Con (R)') ? new JoyconRight(path, model) : new JoyconLeft(path, model);
  }
}

class JoyconRight extends Joycon {
  constructor(path, model) {
    super(path, model);
  }
  onInput(b) {
    if (b[0] !== 0x3f) return;
    return {
      a: Boolean(b[1] & Inps.a),
      x: Boolean(b[1] & Inps.x),
      b: Boolean(b[1] & Inps.b),
      y: Boolean(b[1] & Inps.y),
      plus: Boolean(b[2] & Inps.plus),
      home: Boolean(b[2] & Inps.home),
      sl: Boolean(b[1] & Inps.sl),
      sr: Boolean(b[1] & Inps.sr),
      r: Boolean(b[2] & Inps.r),
      zr: Boolean(b[2] & Inps.zr),
      jd: Boolean(b[2] & Inps.rjd),
      joycon: this.getJoyconInputs(b),

    }
  }
}

class JoyconLeft extends Joycon {
  constructor(path, model) {
    super(path, model);
  }
  onInput(b) {
    if (b[0] !== 0x3f) return;
    //console.log(b);
    return {
      left: Boolean(b[1] & Inps.left),
      right: Boolean(b[1] & Inps.right),
      up: Boolean(b[1] & Inps.up),
      down: Boolean(b[1] & Inps.down),
      minus: Boolean(b[2] & Inps.minus),
      ss: Boolean(b[2] & Inps.ss),
      sl: Boolean(b[1] & Inps.sl),
      sr: Boolean(b[1] & Inps.sr),
      l: Boolean(b[2] & Inps.l),
      zl: Boolean(b[2] & Inps.zl),
      jd: Boolean(b[2] & Inps.ljd),
      joycon: this.getJoyconInputs(b),

    }
  }
}

module.exports = { Joycon, JoyconLeft, JoyconRight };
