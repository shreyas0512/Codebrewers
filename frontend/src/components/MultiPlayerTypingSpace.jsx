import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Word from "./Word";
import wordclass from "../class/wordclass";
import { socket } from "../socket";

const MultiPlayerTypingSpace = () => {
  const [words, setWords] = useState([]);
  const [gameStart, setGameStart] = useState(true);
  const [WPM, setWPM] = useState(0);
  const [time, setTime] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const location = useLocation();
  const [game, setGame] = useState(location.state);
  let textlength = 40;
  const [ongoingWordIndex, setOngoingWordIndex] = useState(0);
  const [stat, setStat] = useState([]);
  const [index, setIndex] = useState(0);
  const [wordsAsArray, setWordsAsArray] = useState([]);
  const [playerDetails, setPlayerDetails] = useState({});
  const [message, setMessage] = useState("Start the Game");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let temp = [];
    location.state.words.forEach((item, index) => {
      temp.push(new wordclass(item.split(""), index));
    });
    location.state.players.forEach((item) => {
      if (item.name === localStorage.getItem("username")) {
        setPlayerDetails(item);
      }
    });
    setWordsAsArray(temp);
  }, [location]);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(textlength);

  const calculcateWPM = () => {
    setWPM(Math.round((correctWords / time) * 60));

    if (playerDetails && playerDetails._id)
      socket.emit("updateWordIndex", {
        playerId: playerDetails._id,
        gameId: game._id,
        WPM: WPM,
      });
  };

  // const timer = setInterval(() => {
  //   time += 1;
  //   calculcateWPM();
  // }, 4000);

  const checkInput = (letter) => {
    if (!gameStart) return;
    let lettersArray = wordsAsArray[ongoingWordIndex].word;
    if (letter == "Shift") return;

    //managing whitespace
    if (letter == " " || letter == "Tab" || letter == "Enter") {
      calculcateWPM();
      if (
        wordsAsArray[ongoingWordIndex].numdone ==
        wordsAsArray[ongoingWordIndex].word.length
      ) {
        let temp = wordsAsArray;
        temp[ongoingWordIndex].complete = true;
        setCorrectWords(correctWords + 1);

        setWordsAsArray(temp);
      }
      setTotalWords(totalWords + 1);
      if (totalWords % (textlength - 1) == 0 && totalWords != 0) {
        setStart(end);
        setEnd(end + textlength);
      }
      setOngoingWordIndex(ongoingWordIndex + 1);
      setIndex(0);
      return;
    }

    //error which is bigger than the size of input
    if (index > lettersArray.length) {
      if (letter == "Backspace") {
        let temp = wordsAsArray;
        let len = temp[ongoingWordIndex].error.length;
        temp[ongoingWordIndex].error = temp[ongoingWordIndex].error.substr(
          0,
          len - 1
        );
        setWordsAsArray(temp);
        setIndex(index - 1);
        return;
      }
      let temp = wordsAsArray;
      if (temp[ongoingWordIndex].error.length < 8) {
        temp[ongoingWordIndex].error += letter;
        setWordsAsArray(temp);
        setIndex(index + 1);
      }
    }
    //word completed
    else if (index == lettersArray.length) {
      if (letter == "Backspace") {
        let temp = wordsAsArray;

        if (temp[ongoingWordIndex].word[index - 1].color == 1) {
          temp[ongoingWordIndex].numdone -= 1;
        }
        temp[ongoingWordIndex].word[index - 1].color = 0;
        temp[ongoingWordIndex].index -= 1;

        setWordsAsArray(temp);
        setIndex(index - 1);
      } else {
        let temp = wordsAsArray;
        temp[ongoingWordIndex].error += letter;
        setWordsAsArray(temp);
        setIndex(index + 1);
      }
    } else {
      let neededLetter = lettersArray[index].letter;
      if (letter == "Backspace") {
        if (index == 0) {
          if (ongoingWordIndex == 0) return;
          if (wordsAsArray[ongoingWordIndex - 1].complete == true) return;
          let tempindex = wordsAsArray[ongoingWordIndex - 1].index;
          tempindex--;
          let temp = wordsAsArray;
          if (temp[ongoingWordIndex - 1].word[tempindex].color == 1) {
            temp[ongoingWordIndex - 1].numdone -= 1;
          }
          temp[ongoingWordIndex - 1].word[tempindex].color = 0;
          temp[ongoingWordIndex - 1].index -= 1;
          temp[ongoingWordIndex - 1].error = [];
          setIndex(tempindex);
          setOngoingWordIndex(ongoingWordIndex - 1);
          setWordsAsArray(temp);
          return;
        } else {
          let temp = wordsAsArray;
          if (temp[ongoingWordIndex].word[index - 1].color == 1) {
            temp[ongoingWordIndex].numdone -= 1;
          }
          temp[ongoingWordIndex].word[index - 1].color = 0;
          temp[ongoingWordIndex].index -= 1;
          temp[ongoingWordIndex].error = [];
          setWordsAsArray(temp);
          setIndex(index - 1);
        }
        return;
      }

      if (letter == neededLetter) {
        let temp1 = [...stat];
        temp1[index] = 1;
        setStat(temp1);
        let temp = wordsAsArray;
        temp[ongoingWordIndex].word[index].color = 1;
        temp[ongoingWordIndex].numdone += 1;
        temp[ongoingWordIndex].index += 1;
        setIndex(index + 1);
        setWordsAsArray(temp);
      } else {
        let temp2 = [...stat];
        temp2[index] = -1;
        setStat(temp2);
        let temp = wordsAsArray;
        temp[ongoingWordIndex].word[index].color = -1;
        temp[ongoingWordIndex].index += 1;
        setIndex(index + 1);
      }
    }
  };

  const startGame = () => {
    socket.emit("startTimer", {
      playerId: playerDetails._id,
      gameId: location.state._id,
    });
  };
  useEffect(() => {
    function onConnect() {
      console.log("Connect");
    }

    function onDisconnect() {
      console.log("Dis");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("timer", (data) => {
      setMessage(data.msg + " : " + data.countDown);
      if (data.msg == "Time Remaining") {
        setTime(game.time - data.countDown);
      }
    });
    socket.on("updateGame", (data) => setGame(data));
    socket.on("GameOver", () => {
      setGameOver(true);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const sortPlayer = (players) => {
    let temp = players;
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp.length - i - 1; j++) {
        if (temp[j].WPM < temp[j + 1].WPM) {
          let l = temp[j];
          temp[j] = temp[j + 1];
          temp[j + 1] = l;
        }
      }
    }
    return temp;
  };

  return (
    <div>
      <div>GameID : {game._id}</div>
      {!gameOver ? (
        <div>
          <div className="text-center">
            <div className="text-3xl ">{message}</div>
            <div className="text-xl">WPM: {WPM}</div>
          </div>
          <div
            className="mt-4 flex gap-4 justify-center items-center py-10 text-xl w-[1200px] flex-wrap "
            onKeyDown={(e) => checkInput(e.key)}
            tabIndex={0}
          >
            {wordsAsArray.map((item, indexOfElement) =>
              indexOfElement >= start && indexOfElement < end ? (
                <Word
                  error={item.error}
                  lettersArray={item.word}
                  curIndex={index}
                  isread={indexOfElement === ongoingWordIndex}
                />
              ) : (
                <></>
              )
            )}
          </div>
          <div className="flex mt-4 justify-center">
            {playerDetails.isGameLeader ? (
              <button className="" onClick={startGame}>
                Let the Game Begin
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="text-center mt-4">
            <div className="text-2xl mb-2">LeaderBoard</div>

            <div className="flex items-center flex-col justify-center">
              {game.players.map((item) => (
                <div className="flex gap-4">
                  <div>{item.name}</div>
                  <div>{item.WPM}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div className="text-2xl mb-2">LeaderBoard</div>

          <div className="flex items-center flex-col justify-center">
            {sortPlayer(game.players).map((item, index) => (
              <div className="flex gap-4">
                <div>{index + 1}</div>
                <div>{item.name}</div>
                <div>{item.WPM}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiPlayerTypingSpace;
