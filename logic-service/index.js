const Graph = require('graphlib');
const MAIN_IN = "MAIN_IN";

function createAndGraph() {
  const AND = new Graph();
  AND.setGraph('AND');

  AND.setNode('MAIN_IN', { type: 'in', value: false });
  AND.setNode('DATA_0', { type: 'in', value: false });
  AND.setNode('DATA_1', { type: 'in', value: false });
  AND.setNode('PROCESS_0', { type: 'process' });
  AND.setNode('PROCESS_1', { type: 'process' });
  AND.setNode('OUT_0', { type: 'out' });

  AND.setEdge('MAIN_IN', 'PROCESS_0');
  AND.setEdge('PROCESS_0', 'PROCESS_1');
  AND.setEdge('PROCESS_1', 'OUT_0');
  AND.setEdge('DATA_0', 'PROCESS_0');
  AND.setEdge('DATA_1', 'PROCESS_1');

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

main();