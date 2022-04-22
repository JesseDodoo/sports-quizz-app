const Score = require("../models/Score");

async function all(req,res) {
    try {
        const scores = await Score.all();
        res.status(200).json(scores)
    } catch (error) {
        res.status(500).json({err})
    }
}

async function byId(req, res) {
    try {
      const score = await Score.findById(req.params.id);
      res.status(200).json(score);
    } catch (err) {
      res.status(500).send({err});
    }
  }

  async function update(req, res) {
    try {
      const update = await Score.updateScore(req.body.id, req.body.score);
      res.status(200).json(update);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  async function createUser(req, res) {
      try {
        const newUser = await Score.newUser(req.body.username);
        res.status(201).json(newUser)
      } catch (error) {
          res.status(500).send(err)
      }
  }

  async function deleteUser(req,res) {
      try {
          const toRemove = await Score.findById(req.params.id)
          const removeUser = await toRemove.delete()
          res.status(200).json(removeUser)
      } catch (error) {
        res.status(500).send(error);
      }
  }

module.exports = {all, byId, update, createUser, deleteUser}
