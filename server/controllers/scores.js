const Score = require("../models/Score");

async function all(req,res) {
    try {
        const scores = await Score.all();
        res.status(200).json(scores)
    } catch (error) {
        res.status(500).json({err})
    }
}

module.exports = {all}
