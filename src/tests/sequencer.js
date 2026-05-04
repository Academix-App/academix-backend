const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const order = [
      "auth.test.js",
    ];

    return tests.sort((a, b) => {
      const ia = order.findIndex(o => a.path.endsWith(o));
      const ib = order.findIndex(o => b.path.endsWith(o));
      return ia - ib;
    });
  }
}

module.exports = CustomSequencer;
