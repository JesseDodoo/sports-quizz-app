import React, { useState, useEffect } from "react";
import { BackButton } from "../../components";
import { useNavigate as Navigate } from "react-router-dom";
import { getPlayers, getQuiz } from "../../actions";
import { useDispatch } from "react-redux";
import "./styles.css";

function Setup() {
  const goTo = Navigate();
  const [playerNumber, setPlayerNumber] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(10);
  const [playerName, setPlayerName] = useState([]);
  // const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [triviaType, setTriviaType] = useState("");
  const [mainPlayer, setMainPlayer] = useState("");

  useEffect(() => {
    let playerExists = getCookie("userId");
    if (playerExists) {
      fetchUser(playerExists);
      setPlayerNumber(1);
    }
  }, []);
  const dispatch = useDispatch();

  async function fetchUser(id) {
    const response = await fetch(`https://fpquizapp.herokuapp.com/scores/${id}`);
    let { username } = await response.json();
    setMainPlayer(username);
    let playerArray = [];
    playerArray.push({ playerName: username, score: 0 });
    setPlayerName(playerArray);
    dispatch({
      type: "SET_MAIN",
      payload: { playerName: username, id: id },
    });
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }
   
  playerName.length = playerNumber;
  console.log("playerName", playerName);
  console.log("number of questions", questionNumber);
  console.log("difficulty", difficulty);
  console.log("type", triviaType);
  console.log(" ");


  function playerCount(e) {
    setPlayerNumber(parseInt(e.target.value));
  }

  function renderPlayerInput() {
    let inputAreas = [];
    for (let i = 0; i < playerNumber; i++) {
      if (i == 0 && mainPlayer) {
        inputAreas.push(
          <input
            required
            type="text"
            className="nameInput"
            value={mainPlayer}
            key={i}
            onChange={getPlayerName}
            placeholder="enter player name"
          ></input>
        );
      } else {
        inputAreas.push(
          <input
            required
            type="text"
            className="nameInput"
            key={i}
            onChange={getPlayerName}
            placeholder="enter player name"
          ></input>
        );
      }
    }
    return inputAreas;
  }

  function getPlayerName() {
    let allPlayers = [];
    let playerNameInput = document.getElementsByClassName("nameInput");
    for (let i = 0; i < playerNumber; i++) {
      allPlayers[i] = { playerName: playerNameInput[i].value, score: 0 };
    }
    setPlayerName(allPlayers);
  }


  function getDifficulty(e) {
    setDifficulty(e.target.value);
  }

  function getTriviaType(e) {
    setTriviaType(e.target.value);
  }

  function questionCount(e) {
    if (playerNumber !== 0) {
      if (e.target.value % playerNumber !== 0) {
        console.log(`must be a multiple of ${playerNumber}`);
      } else {
        setQuestionNumber(parseInt(e.target.value));
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(getQuiz(questionNumber, difficulty, triviaType));
    dispatch(getPlayers(playerName));
    if (!mainPlayer) {
      try {
        let response = await fetch(`https://fpquizapp.herokuapp.com/scores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: playerName[0].playerName }),
        });
        let { id, username } = await response.json();
        setMainPlayer(username);
        dispatch({
          type: "SET_MAIN",
          payload: { playerName: username, id: id },
        });
        document.cookie = `userId=${id}; expires=Thu, 18 Dec 2050 12:00:00 UTC`;
      } catch (err) {
        console.log(err);
      }
    }
    goTo("/quiz");
  }

  return (
    <>
    <h1 className="header">Setup</h1>
      <form onSubmit={handleSubmit}>
        <label>Local or online?</label>

        <select required name="onlineOrLocal">
          <option value="">please select</option>
          <option value="online">Online</option>
          <option value="local">Local</option>
        </select>
        <label>How many players?</label>
        <select required onChange={playerCount} name="numberOfPlayers">
          <option value="">please select</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <div className="inputContainer">
          {!playerNumber ? null : renderPlayerInput()}
        </div>

       
        <select onChange={getDifficulty} name="trivia_difficulty">
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select onChange={getTriviaType} name="trivia_type">
          &gt;
          <option value="">Any Type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
        <input
          required
          onChange={questionCount}
          placeholder="Number of Questions"
          type="number"
        ></input>
        <button type="submit">PLAY</button>
      </form>

      <BackButton />
    </>
  );
}

export default Setup;
