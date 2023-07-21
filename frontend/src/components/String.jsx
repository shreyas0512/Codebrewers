import React, { useEffect, useState } from "react";
import Word from "./Word";
import wordclass from "../class/wordclass";

const String = ({ words }) => {
  const [ongoingWordIndex, setOngoingWordIndex] = useState(0);
  const [stat, setStat] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [wordsAsArray, setWordsAsArray] = useState([]);
  const [end, setEnd] = useState(false);

  const checkInput = (letter) => {
    let lettersArray = wordsAsArray[ongoingWordIndex].word;
    console.log(index, lettersArray.length, index > lettersArray.length);
    if (letter == "Shift") return;

    //managing whitespace
    if (letter == " " || letter == "Tab" || letter == "Enter") {
      if (
        wordsAsArray[ongoingWordIndex].numdone ==
        wordsAsArray[ongoingWordIndex].word.length
      ) {
        let temp = wordsAsArray;
        temp[ongoingWordIndex].complete = true;
        setWordsAsArray(temp);
      }
      setOngoingWordIndex(ongoingWordIndex + 1);
      setIndex(0);
      return;
    }

    //error which is bigger than the size of input
    if (index > lettersArray.length) {
      if (letter == "Backspace") {
        let temp = wordsAsArray;
        console.log("backend", temp[ongoingWordIndex].error);
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
      temp[ongoingWordIndex].error += letter;
      setWordsAsArray(temp);
      setIndex(index + 1);
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
          setIndex(tempindex);
          setOngoingWordIndex(ongoingWordIndex - 1);
          setWordsAsArray(temp);
          return;
        } else {
          let temp = wordsAsArray;
          console.log(temp[ongoingWordIndex].word, index);
          if (temp[ongoingWordIndex].word[index - 1].color == 1) {
            temp[ongoingWordIndex].numdone -= 1;
          }
          temp[ongoingWordIndex].word[index - 1].color = 0;
          temp[ongoingWordIndex].index -= 1;
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

  useEffect(() => {
    let wordsToArray = [];
    words.map((item, index) => {
      wordsToArray.push(new wordclass(item.split(""), index));
    });
    setWordsAsArray(wordsToArray);
  }, [words]);
  return (
    <div
      className="flex gap-4 p-10 text-xl"
      onKeyDown={(e) => checkInput(e.key)}
      tabIndex={0}
    >
      {wordsAsArray.map((item, indexOfElement) => (
        <Word
          error={item.error}
          lettersArray={item.word}
          curIndex={index}
          isread={indexOfElement === ongoingWordIndex}
        />
      ))}
    </div>
  );
};

export default String;
