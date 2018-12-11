AFRAME.registerSystem('networked-system', {
  schema: {},
  init: function () {
    // this.updatableAttrs = {
    //   position: true,
    //   rotation: true
    // };
    // this.threshold = 0.01;
    // this.entities = {};
    // this.entityData = {};
    // this.networkedEntities = {};
    this.socket = io();

    // this.socket.on('addEntity', this.addNetworkedEntity);
    // this.socket.on('update', this.updateEntity);
    // this.socket.on('removeEntity', this.removeNetworkedEntity);
  }
  // tick: function () {
  //   Object.keys(this.entities)
  //     .map(id => {
  //       const entity = this.entities[id];
  //       const position = entity.getAttribute('position');
  //       const rotation = entity.getAttribute('rotation');
  //       return {
  //         id: entity.id,
  //         type: entity.type,
  //         position,
  //         rotation,
  //         positionChanged: this.vectorChanged(position, entity.id, 'position'),
  //         rotationChanged: this.vectorChanged(rotation, entity.id, 'rotation')
  //       }
  //     })
  //     .filter(({positionChanged, rotationChanged}) => positionChanged || rotationChanged)
  //     .forEach(({ id, type, position, rotation}) => {
  //       const updateObj = { id, type, position, rotation };
  //       this.socket.emit('update', updateObj);
  //     })
  // },
  // pause: function () {},
  // play: function () {},
  // addEntity(entity) {
  //   this.entities[entity.id] = entity;
  //   this.socket.emit('addEntity', entity);
  // },
  // updateEntity(entity) {
  //   const entityEl = this.networkedEntities[entity.socketId][entity.id];
  //   Object.keys(entity)
  //     .map(key => ({key, value: entity[key]}))
  //     .filter(({key}) => this.updatableAttrs[key])
  //     .forEach(({key, value}) => entityEl.setAttribute(key, value));
  // },
  // removeEntity(entity) {
  //   delete this.entities[entity.id];
  //   this.socket.emit('removeEntity', entity);
  // },
  // addNetworkedEntity(entity) {
  //
  // },
  // removeNetworkedEntity(entity) {
  //
  // },
  // vectorChanged(vector, id, type) {
  //   if(!this.entityData[id]) {
  //     this.entityData[id] = {};
  //   } else if(!this.entityData[id][type]) {
  //     this.entityData[id][type] = {
  //       x: 0,
  //       y: 0,
  //       z: 0
  //     };
  //   }
  //   const oldData = this.entityData[id][type];
  //   if(Math.abs(oldData.x - vector.x) > this.threshold ||
  //     Math.abs(oldData.y - vector.y) > this.threshold ||
  //     Math.abs(oldData.z - vector.z) > this.threshold) {
  //     this.entityData[id][type] = vector;
  //     return true;
  //   }
  //   return false;
  // }
});