const { init } = require("../dbConfig");
const { ObjectId } = require("mongodb");

class Score {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.score = data.score;
    }

    static all() {
        return new Promise(async (res, rej) => {
            try {
                const db = await init();
                const scoresData = await db.collection("scores").find().toArray();
                console.log(scoresData)
                let scores = scoresData.map(score => new Score(score))
                res(scores)
            } catch (error) {
                rej("error retireiving score" + error);
            }
        })
    }

    static findbyId(id) {
        return new Promise(async (res,rej) => {
            try {
                const db = await init();
                const scoresData = await db.collection("scores").findOne({_id: ObjectId(id)})
                let scoreByID = new Score(scoresData)
                res(scoreByID)
            } catch (error) {
                rej("error retireiving score by ID" + error);
            }
        })
    }

    static updateScore(id, update, username) {
        return new Promise(async (res,rej) => {
            try {
                const db = await init()
                const scoresData = await db.collection("scores").findOneAndUpdate(
                    {_id: ObjectId(id) },
                    {username: username},
                    {$inc: {score: update}}, 
                    {returnDocument: "after"}
                    );
                    let scoreUpdate = new Score(scoreUpdate)
                    res(scoreUpdate)
            } catch (error) {
                rej("error updateing score" + error);
            }
        })
    }

    static newUser(username) {
        return new Promise(async (res, rej) => {
            try {
                const db = await init();
                const user = await db.collection("scores").insertOne({username: username, score: 0});
                let createUser = await Score.findbyId(user.insertedId);
                res(createUser)
            } catch (error) {
                rej("error creating user" + error);
            }
        })
    }

    delete() {
        return new Promise(async (res, rej) => {
          try {
            const db = await init();
            await db.collection("scores").deleteOne({ _id: this.id });
            res(`${this.username} deleted`);
          } catch (error) {
            rej("Error deleting user");
          }
        });
      }

}

module.exports = Score;
