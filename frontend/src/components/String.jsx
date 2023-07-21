import React, { useEffect, useState } from "react";
import Word from "./Word";
import wordclass from "../class/wordclass";
import { socket } from "../socket";

const String = ({
  words,
  gameStart,
  WPM,
  setWPM,
  time,
  totalWords,
  setTotalWords,
  correctWords,
  setCorrectWords,
}) => {
  let textlength = 40;
  const [ongoingWordIndex, setOngoingWordIndex] = useState(0);
  const [stat, setStat] = useState([]);
  const [index, setIndex] = useState(0);
  const [wordsAsArray, setWordsAsArray] = useState([]);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(textlength);

  const calculcateWPM = () => {
    setWPM(Math.round((correctWords / time) * 60));
    console.log(correctWords, time);
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
      console.log(totalWords);
      if (totalWords % (textlength - 1) == 0 && totalWords != 0) {
        setStart(end);
        setEnd(end + textlength);
        console.log(start, end);
      }
      setOngoingWordIndex(ongoingWordIndex + 1);
      setIndex(0);
      calculcateWPM();
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

  useEffect(() => {
    let wordsToArray = [];
    words.map((item, index) => {
      wordsToArray.push(new wordclass(item.split(""), index));
    });
    setWordsAsArray(wordsToArray);
  }, []);
  return (
    <div
      className="flex gap-4 justify-center items-center py-10 text-xl w-[1200px] flex-wrap "
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
  );
};

export default String;
