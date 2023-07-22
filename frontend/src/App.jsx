import React from "react";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mode from "./components/Mode";
import Contest from "./components/Contest";
import SinglePlayerPlayGround from "./components/SinglePlayerPlayGround";
import MultiPlayerTypingSpace from "./components/MultiPlayerTypingSpace";

function App() {
  return (
    <div className="h-screen w-screen justify-center flex flex-col items-center">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/mode-select" element={<Mode />} />
          <Route path="/mode-select/contest" element={<Contest />} />
          <Route path="/singlePlayer" element={<SinglePlayerPlayGround />} />
          <Route
            path="/multiplayertypingspace"
            element={<MultiPlayerTypingSpace />}
          />
        </Routes>
      </Router>
    </div>
  );
}
{
  /* import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import String from "./components/String";
import SinglePlayerPlayGround from "./components/SinglePlayerPlayGround";

function App() {
  const [count, setCount] = useState(0);

  const [correct, setCorrect] = useState([]);
  useEffect(() => {
    let arr = [3];
    arr.forEach((item, index) => {
      arr[index] = 0;
    });
    setCorrect(arr);
  }, []);
  return (
    <div className="w-screen">
      <div>
        <SinglePlayerPlayGround />
      </div>
    </div>
  )
} */
}

export default App;
