import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import String from "./components/String";

function App() {
  const [count, setCount] = useState(0);
  let checkString = ["lorem", "ipsum", "Polt"];
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
      <input className="w-full" />
      <div>
        <String words={checkString} />
      </div>
    </div>
  );
}

export default App;
