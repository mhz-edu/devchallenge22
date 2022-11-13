const User = require('../model/people');

const postPeople = async (req, res, next) => {
  const id = req.body.id;
  const topics = req.body.topics;

  const user = new User({ id, topics, connections: {} });

  try {
    const saved = await user.save();
    res.status(201).json({ id: saved.id, topics: saved.topics });
  } catch (error) {
    next(error);
  }
};

const postConnections = async (req, res, next) => {
  const id = req.params.id;
  const connections = req.body;

  try {
    const user = await User.findOne({ id });
    Object.entries(connections).forEach(([personId, trust]) =>
      user.updateConnections(personId, trust)
    );
    const saved = await user.save();
    return res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

module.exports = { postPeople, postConnections };
