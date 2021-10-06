const HID = require("node-hid");

class Dualshock {
  constructor(path, model) {
    this.device = new HID.HID(model.vendorId, model.productId);
    this.model = model;
    this.buttons;
    // this.device.on("data", (bytes) => {
    //   //console.log(bytes)
    //   this.buttons = this.onInput(bytes);
    //
    //   //console.log(this.buttons);
    // });

    this.name = this.model.product;
    this.packetn = 0;
  }
  onInput(b) {
    console.log(b);
  }
}

let mapping = {};

function getTypeAndStyle(dev) {
	if(dev.type != null) return [dev.type,dev.style]; const gk=Object.keys(mapping);
	for(let i=0,l=gk.length,m; i<l; i++) {
		m = mapping[gk[i]]; if(dev.vendorId == m.vendor) {
			if(typeof m.product == 'object') {
				const s = m.product, p = Object.keys(s);
				for(let a=0,b=p.length; a<b; a++) {
					if(dev.productId == p[a]) return [gk[i],s[p[a]]];
				}
			} else if(dev.productId == m.product) return [gk[i],null];
		}
	}
	return [false,null];
}

module.exports = { Dualshock };
