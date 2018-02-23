const Graph = require('graphlib').Graph;
const { INPUT, OUTPUT, PROCESS_NODE } = require('./logicGraph/constants');
const LogicGraph = require('./logicGraph');

function createAndGraph() {
  const AND = new Graph();
  AND.setGraph('AND');

  AND.setNode(`${INPUT}0`, { type: 'in', state: false });
  AND.setNode(`${INPUT}1`, { type: 'in', state: false });
  AND.setNode(`${INPUT}2`, { type: 'in', state: false });
  AND.setNode(`${PROCESS_NODE}0`, { type: 'process' });
  AND.setNode(`${PROCESS_NODE}1`, { type: 'process' });
  AND.setNode(`${OUTPUT}0`, { type: 'out' });

  AND.setEdge(`${INPUT}0`, `${PROCESS_NODE}0`, {type: 'src'});
  AND.setEdge(`${PROCESS_NODE}0`, `${PROCESS_NODE}1`, {type: 'src'});
  AND.setEdge(`${PROCESS_NODE}1`, `${OUTPUT}0`, {type: 'src'});
  AND.setEdge(`${INPUT}1`, `${PROCESS_NODE}0`, {type: 'control'});
  AND.setEdge(`${INPUT}2`, `${PROCESS_NODE}1`, {type: 'control'});

  return AND;
}

function createOrGraph() {
  const OR = new Graph();

  OR.setNode('MAIN_IN', { type: 'in', value: false });
  OR.setNode('DATA_0', { type: 'in', value: false });
  OR.setNode('DATA_1', { type: 'in', value: false });
  OR.setNode('PROCESS_0', { type: 'process' });
  OR.setNode('PROCESS_1', { type: 'process' });
  OR.setNode('OUT_0', { type: 'out' });

  OR.setEdge('MAIN_IN', 'PROCESS_0');
  OR.setEdge('MAIN_IN', 'PROCESS_1');
  OR.setEdge('DATA_0', 'PROCESS_0');
  OR.setEdge('DATA_1', 'PROCESS_1');
  OR.setEdge('PROCESS_0', 'OUT_0');
  OR.setEdge('PROCESS_1', 'OUT_0');
  
  return OR;
}

function main(graph, value) {
  graph.node(MAIN_IN).value = value;
}

let logicGraph = new LogicGraph("testAnd", createAndGraph());
logicGraph.on('setNode', (name, value)  => {
  console.log(`setNode ${name}: ${JSON.stringify(value)}`);
});
logicGraph.on('setEdge', (v, w, value) => {
  console.log(`setEdge ${v} -> ${w}: ${JSON.stringify(value)}`);
});

logicGraph.start();

// edges aren't being set properly.. need to fix.