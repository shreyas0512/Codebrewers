import React, { useEffect, useState } from "react";
import wordclass from "../class/wordclass";

const Word = ({
  word,
  ongoingWordIndex,
  wordIndex,
  checkInput,
  setStat,
  stat,
  error,
  lettersArray,
}) => {
  // useEffect(() => {
  //   let length = [[...word].length];
  //   let arr = Array(length[0]).fill(0);
  //   setStat(arr);
  // }, [word]);

  return (
    <div className="flex">
      {lettersArray ? (
        lettersArray.map((item, index) => (
          <div
            className={`${
              item.color === 1
                ? "text-green-400 bg-red-100"
                : item.color === -1
                ? "text-red-400 bg-red-100"
                : "text-white"
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
