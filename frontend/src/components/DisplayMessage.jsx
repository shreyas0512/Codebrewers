import React, { useState, useEffect } from "react";
import { socket } from "../socket";
const DisplayMessage = ({ message, setMessage }) => {
  useEffect(() => {
    function onConnect() {
      console.log("Connect");
    }

    function onDisconnect() {
      console.log("Dis");
    }

    socket.on("connect", onConnect);
    socket.on("GameOver", () => setMessage("Game Over"));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return <div className="text-3xl">{message}</div>;
};

export default DisplayMessage;
