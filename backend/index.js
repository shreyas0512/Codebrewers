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
    socket.on('createGame',async (Name)=>{
        try{
            let game = new Game();
            game.words = tempstring.split(' ');
            let player = {
                socketId : socket.id,
                Name : Name,
                isGameLeader : true  
            }
            game.players.push(player);
            game = await game.save();

            const gameId = game._id.toString();
            socket.join(gameId);
            io.to(gameId).emit('updateGame',game);

        }
        catch(err)
        {
            console.log(err);
        }
    });
    socket.on('joinGame',async (data)=>{
        try{
            let game = await Game.findById(data.gameId);
            console.log(game.isOpen);
            console.log(game.players);
            if(game.isOpen){
                const gameId = game._id.toString();
                socket.join(gameId);
                let player = {
                    socketId : socket.id,
                    Name : data.Name,
                    isGameLeader : false
                }
                console.log(player);
                game.players.push(player);
                game = await game.save();
                io.to(gameId).emit('updateGame',game);
            }
        }
        catch(err)
        {
            console.log(err);
        }
    });
    socket.on('startTimer',async (data)=>{
        let countDown = 5;
        let game = await Game.findById(data.gameId);
        let player = game.players.id(data.playerId);
        if(player.isGameLeader){
            let timerId = setInterval(async()=>{
                if (countDown >= 0)
                {
                    io.to(data.gameId).emit('timer',{countDown:countDown,msg:"Starting in"});
                    countDown--;
                }
                else
                {
                    game.isOpen = false;
                    game = await game.save();
                    io.to(data.gameId).emit('updateGame',game);
                    startGameClock(data.gameId);
                    clearInterval(timerId);
                }
            },1000);
        }
    });
    socket.on('updateWordIndex',async (data)=>{
        let game = await Game.findById(data.gameId);
        let player = game.players.id(data.playerId);
        player.currentWordIndex = data.currentWordIndex;
        game = await game.save();
        io.to(data.gameId).emit('updateGame',game);
    });


    socket.on('endGame',async (data)=>{
        let game = await Game.findById(data.gameId);
        let player = game.players.id(data.playerId);
        player.WPM = data.WPM;
        player.accuracy = data.accuracy;
        game = await game.save();
        io.to(data.gameId).emit('updateGame',game);
  });
});

const startGameClock = async (gameId) => {
    let game = await Game.findById(gameId); 
    game.startTime = new Date().getTime();
    game = await game.save();
    let time = 60;
    let timerId = setInterval(async()=>{
        if (time >= 0)
        {
            const formattedTime = formatTime(time);
            io.to(gameId).emit('timer',{countDown:formattedTime,msg:"Time Remaining"});
            time--;
        }
        else
        {
            game.isOver = true;
            game = await game.save();
            io.to(gameId).emit('GameOver',game);
            clearInterval(timerId);
        }
    },1000);
}

const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}