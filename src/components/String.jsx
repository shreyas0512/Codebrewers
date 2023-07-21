import React, { useEffect, useState } from "react";
import Word from "./Word";
import wordclass from "../class/wordclass";

const String = ({ words }) => {
  const [ongoingWordIndex, setOngoingWordIndex] = useState(0);
  const [stat, setStat] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  //   const lettersArray = words.split("");
  const [wordsAsArray, setWordsAsArray] = useState([]);

  const checkInput = (letter) => {
    let lettersArray = wordsAsArray[ongoingWordIndex].word;
    console.log(letter);
    if (letter == "Shift") return;
    if (letter == " " || letter == "Tab" || letter == "Enter") {
      setOngoingWordIndex(ongoingWordIndex + 1);
      setIndex(0);
      return;
    }
    if (index >= lettersArray.length) {
      let temp = wordsAsArray;
      temp[ongoingWordIndex].error += letter;
      setWordsAsArray(temp);
      console.log("HEre", temp);
    } else {
      let neededLetter = lettersArray[index].letter;
      if (letter == "Backspace") {
        let temp = wordsAsArray;
        temp[ongoingWordIndex].word[index - 1].color = 0;
        setWordsAsArray(temp);
        setIndex(index - 1);
        return;
      }

      if (letter == neededLetter) {
        let temp1 = [...stat];
        temp1[index] = 1;
        setStat(temp1);
        let temp = wordsAsArray;
        temp[ongoingWordIndex].word[index].color = 1;
        temp[ongoingWordIndex].index += 1;
        setIndex(index + 1);
        setWordsAsArray(temp);
        //   setIndex(index + 1);
      } else {
        let temp2 = [...stat];
        temp2[index] = -1;
        setStat(temp2);
        //   let temp = wordsAsArray;
        //   temp[ongoingWordIndex].color = -1;
        //   setWordsAsArray(temp);
        //   temp[ongoingWordIndex].index += 1;
        let temp = wordsAsArray;
        temp[ongoingWordIndex].word[index].color = -1;
        //   temp[ongoingWordIndex].index += 1;
        //   console.log(temp);
        setIndex(index + 1);
      }
    }

    // setWordsAsArray((prev) =>
    //   prev.map((item) =>
    //     item.id === ongoingWordIndex ? { ...item, index: item.index + 1 } : item
    //   )
    // );
  };
  useEffect(() => {
    let wordsToArray = [];
    words.map((item, index) => {
      wordsToArray.push(new wordclass(item.split(""), index));
    });
    setWordsAsArray(wordsToArray);
  }, [words]);
  //   useEffect(() => {
  //     console.log("HERE", wordsAsArray);
  //   }, [wordsAsArray]);
  return (
    <div
      className="flex gap-4"
      onKeyDown={(e) => checkInput(e.key)}
      tabIndex={0}
    >
      {wordsAsArray.map((item, index) => (
        <Word
          word={item}
          ongoingWordIndex={ongoingWordIndex}
          setOngoingWordIndex={setOngoingWordIndex}
          wordIndex={index}
          checkInput={checkInput}
          setStat={setStat}
          stat={stat}
          error={item.error}
          lettersArray={item.word}
        />
      ))}
    </div>
  );
};

export default String;
