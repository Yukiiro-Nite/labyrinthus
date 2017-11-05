AFRAME.registerSystem('networked-entity', {
  schema: {},
  init: function () {
    this.threshold = 0.01;
    this.entities = {};
    this.entityData = {};
    this.networkedEntities = {};
    this.socket = io('http://yukiironite.me:3005');

    this.socket.on(update, this.updateEntity);
  },
  tick: function () {
    Object.keys(this.entities)
      .map(id => {
        const entity = this.entities[id];
        const position = entity.getAttribute('position');
        const rotation = entity.getAttribute('rotation');
        return {
          position,
          rotation,
          positionChanged: this.vectorChanged(position, entity.id, 'position'),
          rotationChanged: this.vectorChanged(rotation, entity.id, 'rotation')
        }
      })
      .filter(({positionChanged, rotationChanged}) => positionChanged || rotationChanged)
      .forEach(({position, rotation}) => {
        const updateObj = { position, rotation };
        this.socket.emit('update', updateObj);
      })
  },
  pause: function () {},
  play: function () {},
  addEntity(entity) {
    this.entities[entity.id] = entity;
  },
  updateEntity(updateObj) {

  },
  removeEntity(entity) {
    delete this.entities[entity.id];
  },
  addNetworkedEntity() {

  },
  removeNetworkedEntity() {

  },
  vectorChanged(vector, id, type) {
    if(!this.entityData[id]) {
      this.entityData[id] = {};
    } else if(!this.entityData[id][type]) {
      this.entityData[id][type] = {
        x: 0,
        y: 0,
        z: 0
      };
    }
    const oldData = this.entityData[id][type];
    if(Math.abs(oldData.x - vector.x) > this.threshold ||
      Math.abs(oldData.y - vector.y) > this.threshold ||
      Math.abs(oldData.z - vector.z) > this.threshold) {
      this.entityData[id][type] = vector;
      return true;
    }
    return false;
  }
});