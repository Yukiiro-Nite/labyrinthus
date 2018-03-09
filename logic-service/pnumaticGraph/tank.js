
class Tank {
  contents = [];
  capacity = 0;
  valves = {};
  constructor({ capacity }) {
    this.capacity = capacity;
  }
  getContentsVolume() {
    return this.contents.reduce((acc, content) => {
      acc += content.amount;
      return acc;
    }, 0);
  }
  getPressure() {
    return this.getContentsVolume() / this.capacity;
  }
  addValve(valve) {
    this.valves[Symbol(valve)] = valve;
  }
  removeValve(valve) {
    delete this.valves[Symbol(valve)];
  }
}