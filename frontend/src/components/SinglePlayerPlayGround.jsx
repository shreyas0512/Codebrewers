import React, { useState, useEffect } from "react";
import { socket } from "../socket";
import String from "./String";
import DisplayMessage from "./DisplayMessage";

function SinglePlayerPlayGround() {
  let string =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio tempor orci dapibus ultrices. Sed adipiscing diam donec adipiscing tristique risus nec. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Odio morbi quis commodo odio aenean sed. Et tortor consequat id porta. A arcu cursus vitae congue mauris rhoncus. Facilisis volutpat est velit egestas dui id ornare arcu odio. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique. Nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Varius duis at consectetur lorem donec massa sapien faucibus. Convallis posuere morbi leo urna molestie at elementum. Proin sed libero enim sed faucibus turpis in eu mi. In est ante in nibh mauris. Convallis tellus id interdum velit laoreet id. Magna fringilla urna porttitor rhoncus.";
  let checkString = string.split(" ");
  const [WPM, setWPM] = useState(0);
  const [message, setMessage] = useState("Start the Game");
  const [time, setTime] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);

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
        setTime(30 - data.countDown);
      }
    });

    socket.on("GameOver", () => setGameOver(true));
    socket.on("StartGame", () => {
      if (gameStart == false) setGameStart(true);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };
  const getRawSpeed = () => {
    return Math.round((totalWords / time) * 60);
  };
  const getAccuracy = () => {
    return Math.round((correctWords / totalWords) * 100);
  };
  return (
    <div>
      <DisplayMessage message={message} setMessage={setMessage} />
      <div>
        <div className="text-xl mt-2">{WPM} WPM</div>
      </div>

      {!gameOver ? (
        <div>
          <String
            words={checkString}
            gameStart={gameStart}
            WPM={WPM}
            setWPM={setWPM}
            time={time}
            totalWords={totalWords}
            setTotalWords={setTotalWords}
            correctWords={correctWords}
            setCorrectWords={setCorrectWords}
          />
          <button
            onClick={() =>
              socket.emit("createSinglePlayerGame", { key: "value" })
            }
          >
            Click
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-center gap-10 my-10 text-lg">
            <div>Raw: {getRawSpeed()} WPM</div>
            <div>Accuracy :{getAccuracy()}%</div>
          </div>
          <button
            onClick={() => {
              setWPM(0);
              setCorrectWords(0);
              setTotalWords(0);
              setGameOver(false);
              setMessage("Start the Game");
              setGameStart(false);
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default SinglePlayerPlayGround;
