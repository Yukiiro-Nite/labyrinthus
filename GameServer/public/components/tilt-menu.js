AFRAME.registerComponent('tilt-menu', {
  init() {
    const menu = {
      isOpen: false,
      el: this.createMenu()
    };
    this.menu = menu;
    this.el.addEventListener('componentchanged', function(event){
      switch(event.detail.name){
        case 'position':
          break;
        case 'rotation':
          if(Math.abs(event.detail.newData.z) > 45) {
            // 1 == left, -1 == right on y axis
            if(menu.isOpen && event.detail.newData.z > 0){
              menu.isOpen = false;
              console.log('Closed menu');
            } else if(!menu.isOpen && event.detail.newData.z < 0){
              menu.isOpen = true;
              console.log(`Opened menu`);
            }
          }
          break;
      }
    });
  },
  tick(time, timeDelta) {
    if(this.menu.isOpen) {
      let position = this.el.getAttribute('position');
      position.z -= 2;
      this.menu.el.setAttribute('visible', true);
      this.menu.el.setAttribute('position', position);
    } else {
      this.menu.el.setAttribute('visible', false);
    }
  },
  createMenu() {
    const menu = document.createElement('a-box');
    menu.setAttribute('id','menu');
    menu.setAttribute('material', {color: '#000000', transparent: true, opacity: 0.5});
    this.el.sceneEl.appendChild(menu);

    return menu;
  }
});
