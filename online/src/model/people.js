const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  topics: [String],
  connections: {
    type: Map,
    of: Number,
  },
});

userSchema.methods.getConnectionsByTrust = function (requiredTrust) {
  const result = [];
  this.connections.forEach((trust, personId) => {
    if (trust >= requiredTrust) {
      result.push(personId);
    }
  });
  return result;
};

userSchema.methods.updateConnections = function (personId, trustValue) {
  this.connections.set(personId, trustValue);
};

module.exports = mongoose.model('User', userSchema);
