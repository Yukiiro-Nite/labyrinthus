AFRAME.registerComponent('fire-light', {
  init() {
    this.fire = new Fire({ colorStayRate: 8 });
    this.fireColor = new THREE.Color();
  },
  tick(time, timeDelta) {
    this.fireColor.set(this.fire.getColor());
    this.el.setAttribute('light', {
      type: 'point',
      intensity: 0.5,
      distance: 30,
      decay: 2,
      color: `#${this.fireColor.getHexString()}`
    });
  }
});

function Fire(options) {
  let colorStayRate = options.colorStayRate || 4;
  let hue = randInt(30, 45);
  let lightness = 50;

  this.getColor = () => {
    if(!randInt(colorStayRate)){
      hue = randInt(30, 45);
      lightness = 50;
    } else {
      lightness--;
    }
    return `hsl(${hue}, 100%, ${ lightness > 0 ? lightness : 0 }%)`;
  }
}