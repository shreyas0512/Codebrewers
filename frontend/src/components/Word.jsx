import React, { useEffect, useState } from "react";
import wordclass from "../class/wordclass";

const Word = ({ error, lettersArray, curIndex, isread }) => {
  return (
    <div className="flex ">
      {lettersArray ? (
        lettersArray.map((item, index) => (
          <div
            className={`${
              item.color === 1
                ? "text-green-400"
                : item.color === -1
                ? "text-red-400"
                : "text-white"
            } ${
              curIndex === index && isread
                ? "border-l transition border-10"
                : ""
            }}`}
          >
            {item.letter}
          </div>
        ))
      ) : (
        <></>
      )}
      <div className="text-red-400">{error}</div>
    </div>
  );
};

export default Word;
