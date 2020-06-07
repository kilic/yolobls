const BLS = artifacts.require('BLS');

const PRECOMPILE_G1_ADD = '0x000000000000000000000000000000000000000a';
const PRECOMPILE_G1_MUL = '0x000000000000000000000000000000000000000b';
const PRECOMPILE_G1_MULTIEXP = '0x000000000000000000000000000000000000000c';
const PRECOMPILE_G2_ADD = '0x000000000000000000000000000000000000000d';
const PRECOMPILE_G2_MUL = '0x000000000000000000000000000000000000000e';
const PRECOMPILE_G2_MULTIEXP = '0x000000000000000000000000000000000000000f';
const PRECOMPILE_PAIRING = '0x0000000000000000000000000000000000000010';
const PRECOMPILE_MAP_G1 = '0x0000000000000000000000000000000000000011';
const PRECOMPILE_MAP_G2 = '0x0000000000000000000000000000000000000012';

const csv = require('csvtojson');
const chai = require('chai');
const assert = chai.assert;
const truffleAssert = require('truffle-assertions');

contract('BLS Precompiles', (accounts) => {
  let bls;
  before(async function () {
    bls = await BLS.new();
  });
  async function test(adr, outLen, op) {
    const vectors = await csv().fromFile(`./test/test_vectors/${op}.csv`);
    if (process.env.npm_config_slow) {
      for (v of vectors) {
        let tx = await bls.test(adr, '0x' + v.input, outLen);
        truffleAssert.eventEmitted(tx, 'Result', (event) => {
          return '0x' + v.result === event.output;
        });
      }
    } else {
      for (v of vectors) {
        let result = await bls.test.call(adr, '0x' + v.input, outLen);
        assert.equal('0x' + v.result, result);
      }
    }
  }
  it('g1 add', async () => {
    await test(PRECOMPILE_G1_ADD, 128, 'g1_add');
  });
  it('g1 mul', async () => {
    await test(PRECOMPILE_G1_MUL, 128, 'g1_mul');
  });
  it('g1 multiexp', async () => {
    await test(PRECOMPILE_G1_MULTIEXP, 128, 'g1_multiexp');
  });
  it('g2 add', async () => {
    await test(PRECOMPILE_G2_ADD, 256, 'g2_add');
  });
  it('g2 mul', async () => {
    await test(PRECOMPILE_G2_MUL, 256, 'g2_mul');
  });
  it('g2 multiexp', async () => {
    await test(PRECOMPILE_G2_MULTIEXP, 256, 'g2_multiexp');
  });
  it('pairing', async () => {
    await test(PRECOMPILE_PAIRING, 32, 'pairing');
  });
  it('g1 map', async () => {
    await test(PRECOMPILE_MAP_G1, 128, 'fp_to_g1');
  });
  it('g2 map', async () => {
    await test(PRECOMPILE_MAP_G2, 256, 'fp2_to_g2');
  });
});
