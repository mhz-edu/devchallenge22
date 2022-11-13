const User = require('../model/people');

const postPath = async (req, res) => {
  const {
    text,
    topics,
    from_person_id: fromId,
    min_trust_level: minTrust,
  } = req.body;
  try {
    let root = await User.findOne({ id: fromId });

    const result = { from: fromId, path: [] };
    const visited = [];
    const queue = [];
    const prev = {};

    let target;

    visited.push(root.id);
    queue.push(
      ...root.getConnectionsByTrust(minTrust).map((subId) => [root.id, subId])
    );

    while (queue.length !== 0) {
      const [rootId, subId] = queue.shift();
      if (!visited.includes(subId)) {
        const currentPerson = await User.findOne({ id: subId });
        prev[currentPerson.id] = rootId;
        if (topics.every((topic) => currentPerson.topics.includes(topic))) {
          target = currentPerson.id;
          break;
        }
        visited.push(subId);
        queue.push(
          ...currentPerson
            .getConnectionsByTrust(minTrust)
            .map((subId) => [currentPerson.id, subId])
        );
      }
    }

    if (target) {
      do {
        result.path.push(target);
        target = prev[target];
      } while (target !== root.id);
      result.path.reverse();
    }

    res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { postPath };
