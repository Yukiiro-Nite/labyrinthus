const Tank = require('./objects/tank');

const tests = {
  'Tank.put should put a whole element into the tank if it fits': () => {
    let tank = new Tank({size: 10});
    let element = {type: 'test', amount: 10};

    tank.put(element);

    return element.amount === 0 &&
        tank.getStoredAmount() === 10;
  },
  'Tank.put should put part of an element if only some fits': () => {
    let tank = new Tank({size: 10});
    let element = {type: 'test', amount: 15};

    tank.put(element);

    return element.amount === 5 &&
      tank.getStoredAmount() === 10;
  },
  'Tank.put should not do anything to an element if the tank is full': () => {
    let tank = new Tank({size: 10});
    let element = {type: 'test', amount: 10};
    let element2 = {type: 'test', amount: 10};

    tank.put(element);
    tank.put(element2);

    return element2.amount === 10 &&
      tank.getStoredAmount() === 10;
  },
  'Tank.take should return an element of type and amount requested if the take has it': () => {
    let tank = new Tank({size: 10});
    tank.put({type: 'test', amount: 10});

    let result = tank.take({type:'test', amount: 5});

    return result.amount === 5 &&
        result.type === 'test' &&
      tank.getStoredAmount() === 5;
  },
  'Tank.take should return normally even if it has to go over multiple elements in an inventory': () => {
    let tank = new Tank({size: 10});
    tank.put({type: 'test', amount: 5});
    tank.put({type: 'test', amount: 5});

    let result = tank.take({type:'test', amount: 7});

    return result.amount === 7 &&
      result.type === 'test' &&
      tank.getStoredAmount() === 3;
  },
  'Tank.take should return an element of type and partial amount requested if tank only has some': () => {
    let tank = new Tank({size: 10});
    tank.put({type: 'test', amount: 5});
    tank.put({type: 'test2', amount: 5});

    let result = tank.take({type:'test2', amount: 7});

    return result.amount === 5 &&
      result.type === 'test2' &&
      tank.getStoredAmount() === 5;
  },
  'Tank.take should return false if the tank has none of the requested type': () => {
    let tank = new Tank({size: 10});

    let result = tank.take({type:'test', amount: 7});

    return result.amount === 0 &&
      result.type === 'test' &&
      tank.getStoredAmount() === 0;
  }
};

function test(){
  return Object.keys(tests)
    .map(testName => ({testName, testResult: tests[testName]()}));
}

let results = test();

results.forEach( ({testName, testResult}) => console.log(`${testName} ${testResult ? 'passed!' : 'failed!'}`));

let resultAccumulation = results.reduce((testAccumulator, {testResult}) => {
  testAccumulator[testResult ? 'passed' : 'failed']++;
  return testAccumulator;
}, {passed: 0, failed: 0});

const numberOfTests = Object.keys(tests).length;

console.log(`Total Tests: ${numberOfTests}`);
console.log(`Tests passed: ${resultAccumulation.passed}`);
console.log(`Tests failed: ${resultAccumulation.failed}`);