const User = require('../model/people');

const postMessage = async (req, res) => {
  const {
    text,
    topics,
    from_person_id: fromId,
    min_trust_level: minTrust,
  } = req.body;
  try {
    let root = await User.findOne({ id: fromId });

    const result = {};
    const visited = [];
    const queue = [];

    visited.push(root.id);
    queue.push(
      ...root.getConnectionsByTrust(minTrust).map((subId) => [root.id, subId])
    );

    while (queue.length !== 0) {
      const [rootId, subId] = queue.shift();
      if (!visited.includes(subId)) {
        const currentPerson = await User.findOne({ id: subId });
        if (topics.every((topic) => currentPerson.topics.includes(topic))) {
          if (result[rootId]) {
            result[rootId].push(currentPerson.id);
          } else {
            result[rootId] = [currentPerson.id];
          }
          queue.push(
            ...currentPerson
              .getConnectionsByTrust(minTrust)
              .map((subId) => [currentPerson.id, subId])
          );
        }
        visited.push(subId);
      }
    }

    res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { postMessage };
