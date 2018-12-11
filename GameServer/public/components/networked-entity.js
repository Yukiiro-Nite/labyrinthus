AFRAME.registerComponent('networked-entity', {
  schema: {
    watch: {type: 'array', default: ['position', 'rotation']}
  },
  init: function () {
    this.state = {
      oldData: {}
    };
    this.data.watch.forEach(attrName => {
      this.state.oldData[attrName] = {...this.el.getAttribute(attrName)}
    });
    this.system = this.el.sceneEl.systems['networked-system'];
  },
  tick: function () {
    const threshold = 0.01;
    const changes = this.data.watch
      .map(attrName => ({attrName, attr: this.el.getAttribute(attrName)}))
      .filter(({attrName, attr}) => Object.entries(attr)
        .filter(([key, value]) => Math.abs(this.state.oldData[attrName][key] - value) > threshold)
        .length > 0
      );
    changes.forEach(({attrName, attr}) => {
      this.state.oldData[attrName] = {...attr};
    });

    if (changes.length > 0) {
      this.system.socket.emit('update', changes);
    }
  }
});
