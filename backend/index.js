const express = require('express')
const app = express()
const mongoose = require('mongoose')
const sockerio = require('socket.io') 
const cors = require("cors");
app.use(express.json());
app.use(cors());

const expressServer = app.listen(3001);
const io = sockerio(expressServer);
const Game = require('./models/Game');
const tempstring = "The quick brown fox jumps over the lazy dog";

mongoose.connect('mongodb+srv://tallycodebrewers:tallycodebrewers@cluster0.29jo4js.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("Not connected");
  });

  io.on('connect',(socket)=>{
    socket.on('create-game',async (nickName)=>{
        try{
            let game = new Game();
            game.words = tempstring.split(' ');
            let player = {
                socketId : socket.id,
                nickName : nickName,
                isGameLeader : true  
            }
            game.players.push(player);
            game = await game.save();

            const gameId = game._id.toString();
            socket.join(gameId);
            io.to(gameId).emit('updtaeGame',game);

        }
        catch(err)
        {
            console.log(err);
        }
    });
  });