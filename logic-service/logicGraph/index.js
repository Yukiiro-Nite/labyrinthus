const EmitterGraph = require('emitter-graph');
const { INPUT, OUTPUT, PROCESS_NODE } = require('./constants');

class LogicGraph extends EmitterGraph {
  getInputs() {
    return this.findNodes(({name}) => name.startsWith(INPUT));
  }
  setInput(data) {
    data.forEach((state, index) => {
      let nodeName = `${INPUT}${index}`;
      let node = this.node(nodeName);
      this.setNode(nodeName, { ...node, state })
    })
  }
  getOutputs() {
    return this.findNodes(({name}) => name.startsWith(OUTPUT))
  }
  getOutputState() {
    return this.getOutputs()
      .sort((a,b) => a.name.localeCompare(b.name))
      .map(({value}) => value.state);
  }
  updateNode(node) {
    const predecessors = node.predecessors || this.predecessors(node.name);
    const edges = predecessors.map(name => this.edge(name, node.name));
    if( edges.length > 0 ) {
      switch (true) {
        case node.name.startsWith(INPUT):
        case node.name.startsWith(OUTPUT):
          this.setNode(node.name, {
            ...node.value,
            state: edges.reduce((acc, edge) => acc || edge.state, false)
          });
          break;
        case node.name.startsWith(PROCESS_NODE):
          let edgeState = edges.reduce((acc, edge) => {
            acc[edge.type] = acc[edge.type] || edge.state;
            return acc;
          }, {});
          this.setNode(node.name, {
            ...node.value,
            state: edgeState.control && edgeState.src
          });
          break;
      }
    }
  }
  updateOutput(node) {
    const successors = node.successors || this.successors(node.name);
    const outEdges = successors.map(name => ({ v: node.name, w: name, value: this.edge(node.name, name) }));
    const nodeState = this.node(node.name).state;
    outEdges.forEach((edge) => this.setEdge(edge.v, edge.w, { ...edge.value, state: nodeState }));
  }
  start() {
    this.running = true;
    let inputs = this.getInputs();
    this.step(inputs);
  }
  stop() {
    clearTimeout(this.nextStep);
    this.running = false;
  }
  step(nodes) {
    // Each 'step' in the run has 3 phases
    // phase 1: update current node state by checking input edges
    // phase 2: update output edges with the internal state
    // phase 3: call step with unique list of successors
    nodes = nodes.map(({ name, value }) => ({
      name,
      value,
      successors: this.successors(name),
      predecessors: this.predecessors(name)
    }));

    nodes.forEach(node => {
      this.updateNode(node);
      this.updateOutput(node);
    });

    let uniqueSuccessors = Array.from(new Set(
      nodes.reduce((acc, {successors}) => acc.concat(successors), [])
    )).map((name) => ({name, value: this.node(name)}));

    if (uniqueSuccessors.length > 0 && this.running) {
      this.nextStep = setTimeout(() => this.step(uniqueSuccessors), 0);
    } else if (uniqueSuccessors.length === 0) {
      this.running = false;
    }
  }
}

module.exports = LogicGraph;
