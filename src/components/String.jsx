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
  const [end, setEnd] = useState(false);

  const checkInput = (letter) => {
    console.log(wordsAsArray, wordsAsArray[ongoingWordIndex].word.length);

    let lettersArray = wordsAsArray[ongoingWordIndex].word;
    if (letter == "Shift") return;
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
    if (index > lettersArray.length) {
      let temp = wordsAsArray;
      temp[ongoingWordIndex].error += letter;
      setWordsAsArray(temp);
    } else if (index == lettersArray.length) {
      if (letter == "Backspace") {
        let temp = wordsAsArray;
        if (temp[ongoingWordIndex].word[index - 1].color == 1)
          temp[ongoingWordIndex].numdone--;
        temp[ongoingWordIndex].word[index - 1].color = 0;
        temp[ongoingWordIndex].index -= 1;

        setWordsAsArray(temp);
        setIndex(index - 1);
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
          temp[ongoingWordIndex - 1].word[tempindex].color = 0;
          temp[ongoingWordIndex - 1].index -= 1;
          setIndex(tempindex);
          setOngoingWordIndex(ongoingWordIndex - 1);
          setWordsAsArray(temp);
          return;
        } else {
          let temp = wordsAsArray;
          if (temp[ongoingWordIndex].word[index - 1].color == 1)
            temp[ongoingWordIndex].numdone--;
          temp[ongoingWordIndex].word[index - 1].color = 0;
          temp[ongoingWordIndex].index -= 1;
          setWordsAsArray(temp);
          setIndex(index - 1);
        }

        // if (index == 0) return;
        // let temp = wordsAsArray;
        // console.log("PRE", temp);

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
        //   setIndex(index + 1);
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
      {end ? <div>End</div> : <></>}
    </div>
  );
};

export default String;
