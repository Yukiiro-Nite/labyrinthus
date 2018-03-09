
class Valve {
  constructor({ defaultState, controlThreshold, controlCost, flowMin, flowMax, direction }) {
    this.state = defaultState;
    this.defaultState = defaultState;
    this.controlThreshold = controlThreshold;
    this.controlCost = controlCost;
    this.flowMin = flowMin;
    this.flowMax = flowMax;
    this.direction = direction;
  }
  connectTank(newTank, oldTank) {
    if(oldTank) {
      oldTank.removeValve(this);
    }
    if(newTank) {
      newTank.addValve(this);
    }
  }
  setInput(input) {
    this.connectTank(input, this.input);
    this.input = input;
  }
  setOutput(output) {
    this.connectTank(output, this.output);
    this.output = output;
  }
  setControl(control) {
    this.connectTank(control, this.control);
    this.control = control;
  }
  connect({ input, output, control }) {
    this.input = this.setInput(input);
    this.output = this.setOutput(output);
    this.control = this.setControl(control);
  }
  update() {

  }
}

// solve problem of adding a valve to a valve