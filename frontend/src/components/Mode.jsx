import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Mode() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center h-screen w-screen items-center">
      <div className="bg-[#181818] h-3/4 w-1/2 rounded-md shadow-lg flex flex-col items-center justify-center">
        <Link to="/singlePlayer">
          <button className="text-white mb-16 bg-[#5e5e5f] w-64">
            Single Player
          </button>
        </Link>
        <button
          className="bg-[#5e5e5f] w-64"
          onClick={() => {
            navigate("contest");
          }}
        >
          Multi-Player Contest
        </button>
      </div>
    </div>
  );
}

export default Mode;
