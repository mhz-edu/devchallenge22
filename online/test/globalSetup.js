const connection = require('../src/db');

module.exports = {
  mochaGlobalSetup: async function () {
    await connection.dropCollection('users');
  },

  mochaGlobalTeardown: async function () {
    // await connection.dropCollection('users');
    await connection.close();
  },
};
