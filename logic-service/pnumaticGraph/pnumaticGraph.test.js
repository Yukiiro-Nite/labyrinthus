const PnumaticGraph = require('./index');

function generateGraph(obj, graph) {

}

const testGraph = new PnumaticGraph();

generateGraph({
  name: 'test',
  nodes: [
    { name: 'main_tank', value: {} },
    { name: 'control_tank_1', value: {} },
    { name: 'control_tank_2', value: {} },
    { name: 'output_tank', value: {} },
    { name: 'valve_1', value: {} },
    { name: 'valve_2', value: {} }
  ],
  edges: [
    { v: 'main_tank', w: 'valve_1', value: { dst: 'input'} },
    { v: 'valve_1', w: 'valve_2', value: { dst: 'input'} },
    { v: 'valve_2', w: 'output_tank', value: {} },
    { v: 'control_tank_1', w: 'valve_1', value: { dst: 'control'} },
    { v: 'control_tank_2', w: 'valve_2', value: { dst: 'control'} },
  ]
}, testGraph);