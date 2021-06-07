const {expect} = require('chai');

const {hello} = require('../src');

describe('hello', function () {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello('World')).to.equal('Hello World!');
  });
});
