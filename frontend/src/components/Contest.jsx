import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

function Contest() {
  const [time, setTime] = useState(30);
  const [difficulty, setDifficulty] = useState("Easy");
  const [gameId, setGameId] = useState(0);
  const navigate = useNavigate();

  const createGame = () => {
    console.log(time, difficulty);
    socket.emit("createGame", {
      difficultyLevel: difficulty,
      time: time,
      name: localStorage.getItem("username"),
    });
  };
  const enterGame = (data) => {
    console.log(data);
    navigate("/multiplayertypingspace", { state: data });
  };
  const joinGame = () => {
    socket.emit("joinGame", {
      gameId: gameId,
      name: localStorage.getItem("username"),
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
    socket.on("entergame", (data) => {
      enterGame(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <h2 className="text-white font-medium mt-12 text-3xl">Join a Contest</h2>
      <div className="flex w-screen items-center justify-center mt-8 ">
        <input
          className="bg-[#353535] h-10 px-1 w-1/2 rounded-md shadow-lg outline-none pl-2"
          type="text"
          placeholder="Enter Contest Code"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
        <button className="ml-4" onClick={joinGame}>
          Join
        </button>
      </div>
      <h3 className="text-5xl mt-12 font-bold">Or</h3>
      <div className="w-1/2 h-1/2 mt-8 shadow-lg rounded-md bg-[#353535] flex flex-col items-center">
        <h4 className="text-center mt-2 text-3xl font-medium pt-3">
          Create Your Own Contest
        </h4>
        <select
          className="bg-[#232323] h-10 px-1 w-1/2 rounded-md shadow-lg text-center outline-none pl-2 mt-8"
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          className="bg-[#232323] h-10 px-1 w-1/2 rounded-md shadow-lg text-center outline-none pl-2 mt-8"
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="30">30s</option>
          <option value="60">60s</option>
          <option value="120">120s</option>
        </select>
        <button
          className="mt-12 text-2xl font-bold bg-[#232323]"
          onClick={createGame}
        >
          + Create
        </button>
      </div>
    </div>
  );
}

export default Contest;
