//var ks = require('node-key-sender');

const names = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  A: "a",
  X: "x",
  B: "b",
  Y: "y",
  MINUS: "minus",
  PLUS: "plus",
  SS: "ss",
  HOME: "home",
  L: "l",
  ZL: "zl",
  R: "r",
  ZR: "zr",
  JD: "jd",
  JOYCON: "joycon",
}

let mode = 0;
var shortcuts = [{
  left: null,
  right: null,
  up: null,
  down: null,
  a: function() {
    console.log("click")
  },
  x: null,
  b: null,
  y: null,
  minus: null,
  ss: null,
  plus: null,
  home: null,
  l: null,
  zl: null,
  r: null,
  zr: null,
  jd: null,
  joycon: null,
}]

var buttonsDown = {
  left: false,
  right: false,
  up: false,
  down: false,
  a: false,
  x: false,
  b: false,
  y: false,
  minus: false,
  ss: false,
  plus: false,
  home: false,
  l: false,
  zl: false,
  r: false,
  zr: false,
  jd: false,
};

function getShortcuts() {
  return shortcuts;
}

function setShortcut(name, mode, func) {
  if (mode < 0 || mode >= shortcuts.length) return;
  if (shortcuts[mode][name] == null) return;
  shortcuts[mode][name] = func;
}

function onButtons(buttons) {
  if (!!buttons.left) {
    if (!!shortcuts[mode].left) {
      shortcuts[mode].left(buttons);
      buttonsDown.left = true;
    }
  } else if (buttonsDown.left) {
    buttonsDown.left = false;
  }
  if (!!buttons.right) {
    if (!!shortcuts[mode].right) {
      shortcuts[mode].right(buttons);
      buttonsDown.right = true;
    }
  } else if (buttonsDown.right) {
    buttonsDown.right = false;
  }
  if (!!buttons.up) {
    if (!!shortcuts[mode].up) {
      shortcuts[mode].up(buttons);
      buttonsDown.up = true;
    }
  } else if (buttonsDown.up) {
    buttonsDown.up = false;
  }
  if (!!buttons.down) {
    if (!!shortcuts[mode].down) {
      shortcuts[mode].down(buttons);
      buttonsDown.down = true;
    }
  } else if (buttonsDown.down) {
    buttonsDown.down = false;
  }
  if (!!buttons.a) {
    if (!!shortcuts[mode].a) {
      shortcuts[mode].a(buttons);
      buttonsDown.a = true;
    }
  } else if (buttonsDown.a) {
    buttonsDown.a = false;
  }
  if (!!buttons.x) {
    if (!!shortcuts[mode].x) {
      shortcuts[mode].x(buttons);
      buttonsDown.x = true;
    }
  } else if (buttonsDown.x) {
    buttonsDown.x = false;
  }
  if (!!buttons.b) {
    if (!!shortcuts[mode].b) {
      shortcuts[mode].b(buttons);
      buttonsDown.b = true;
    }
  } else if (buttonsDown.b) {
    buttonsDown.b = false;
  }
  if (!!buttons.y) {
    if (!!shortcuts[mode].y) {
      shortcuts[mode].y(buttons);
      buttonsDown.y = true;
    }
  } else if (buttonsDown.y) {
    buttonsDown.y = false;
  }
  if (!!buttons.minus) {
    if (!!shortcuts[mode].minus) {
      shortcuts[mode].minus(buttons);
      buttonsDown.minus = true;
    }
  } else if (buttonsDown.minus) {
    buttonsDown.minus = false;
  }
  if (!!buttons.ss) {
    if (!!shortcuts[mode].ss) {
      shortcuts[mode].ss(buttons);
      buttonsDown.ss = true;
    }
  } else if (buttonsDown.ss) {
    buttonsDown.ss = false;
  }
  if (!!buttons.plus) {
    if (!!shortcuts[mode].plus) {
      shortcuts[mode].plus(buttons);
      buttonsDown.plus = true;
    }
  } else if (buttonsDown.plus) {
    buttonsDown.plus = false;
  }
  if (!!buttons.home) {
    if (!!shortcuts[mode].home) {
      shortcuts[mode].home(buttons);
      buttonsDown.home = true;
    }
  } else if (buttonsDown.home) {
    buttonsDown.home = false;
  }
  if (!!buttons.l) {
    if (!!shortcuts[mode].l) {
      shortcuts[mode].l(buttons);
      buttonsDown.l = true;
    }
  } else if (buttonsDown.l) {
    buttonsDown.l = false;
  }
  if (!!buttons.zl) {
    if (!!shortcuts[mode].zl) {
      shortcuts[mode].zl(buttons);
      buttonsDown.zl = true;
    }
  } else if (buttonsDown.zl) {
    buttonsDown.zl = false;
  }
  if (!!buttons.r) {
    if (!!shortcuts[mode].r) {
      shortcuts[mode].r(buttons);
      buttonsDown.r = true;
    }
  } else if (buttonsDown.r) {
    buttonsDown.r = false;
  }
  if (!!buttons.zr) {
    if (!!shortcuts[mode].zr) {
      shortcuts[mode].zr(buttons);
      buttonsDown.zr = true;
    }
  } else if (buttonsDown.zr) {
    buttonsDown.zr = false;
  }
  if (!!buttons.jd) {
    if (!!shortcuts[mode].jd) {
      shortcuts[mode].jd(buttons);
      buttonsDown.jd = true;
    }
  } else if (buttonsDown.jd) {
    buttonsDown.jd = false;
  }
  if (buttons.joycon != null) {
    if (!!shortcuts[mode].joycon) {
      shortcuts[mode].joycon(buttons);
    }
  }

  //Mode switchers
  //SL for previous mode, SR for next mode.
  if (!!buttons.sl) {
    mode--;
    if (mode < 0) {
      mode = shortcuts.length - 1;
    }
    modePushedDown = true;
  } else if (!buttons.sl && modePushedDown) {
    modePushedDown = false;
  }

  if (!!buttons.sr) {
    mode++;
    if (mode >= shortcuts.length) {
      mode = 0;
    }
    modePushedDown = true;
  } else if (!buttons.sr && modePushedDown) {
    modePushedDown = false;
  }
}

var modePushedDown = false;

module.exports.names = names;
module.exports.getShortcuts = getShortcuts;
module.exports.setShortcut = setShortcut;
module.exports.onButtons = onButtons;
