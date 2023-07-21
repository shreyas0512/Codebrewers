import React from "react";
class wordclass {
  constructor(word, id) {
    this.id = id;
    this.index = 0;
    this.last = 0;
    let element = [];
    word.forEach((item) => {
      element.push({
        color: 0,
        letter: item,
      });
    });
    this.word = element;
    this.error = "";
  }
}

export default wordclass;
