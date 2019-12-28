const requireProxy = require('require-proxy-mock');
const sinon = require('sinon');

const _ = exports;

_.mock = (mocks) => {
  beforeEach(() => {
    unmock = mock(mocks);
  });
  afterEach(() => {
    unmock();
  });
  return mocks;
}

_.consoleMock = sinon.spy(console);
beforeEach(() => {
  for (const method in _.consoleMock) {
    _.consoleMock[method].resetHistory();
  }
});

function mock(mocks) {
  const globalMocks = {};
  const requireMocks = {};
  for (const label in mocks) {
    if (global[label]) {
      globalMocks[label] = mocks[label];
    } else {
      requireMocks[label] = mocks[label];
    }
  }
  const unmocks = [requireProxy.mock(requireMocks)];
  for (const label in globalMocks) {
    const original = global[label];
    global[label] = globalMocks[label];
    unmocks.push(() => {
      global[label] = original;
    });
  }
  return () => {
    for (const unmock of unmocks) {
      unmock();
    }
  };
}
