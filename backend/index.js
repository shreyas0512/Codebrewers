const express = require('express')
const {createTokens,validateToken}=require('./JWT')
const app = express()
const mongoose = require('mongoose')
const sockerio = require('socket.io') 
const cors = require("cors");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(cors());



const User = require('./models/User');
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
  
    if (!username || !password) {
      res.status(400).json({ error: 'Please provide both username and password' });
      return;
    }
  
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        const newUser = new User({
          username: username,
          password: hash,
        });
  
        return newUser.save();
      })
      .then((user) => {
        console.log(user); // For debugging purposes
        res.json(user); // Respond with the saved user data (without the hashed password)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Registration failed' });
      });
  });
    app.post('/login',(req,res)=>{
        const {username,password} = req.body;
        User.findOne({ username: username })
        .then((user) => {
          if (user) {
            bcrypt
              .compare(password, user.password)
              .then((result) => {
                if (result) {
                        const accessToken = createTokens(user);  
                        res.cookie('access-token',accessToken,{maxAge
                            : 60*60*24*30*1000,httpOnly:true});
                            
                  res.json({ message: 'Authentication successful' });

                } else {
                  res.status(401).json({ error: 'Authentication failed,Password is wrong ' });
                }
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'Authentication failed' });
              });
          } else {
            res.status(404).json({ error: 'Username not found' });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: 'Error checking username' });
        });
    });

    app.post('/getprofile',validateToken,(req,res)=>{
        res.json("validated");
    })


const expressServer = app.listen(3001, () => {
    console.log("Server is running on port 3001");}
    );
const io = sockerio(expressServer);
const Game = require('./models/Game');
const sentenceGenerator = require('./SentenceGenerator');

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
    socket.on('createGame',async (data)=>{
        try{
            let game = new Game();
            game.difficultyLevel = data.difficultyLevel;
            game.time = data.time;
            const sentences = await sentenceGenerator(data.difficultyLevel,data.time);
            game.words = sentences.split(' ');
            let player = {
                socketId : socket.id,
                name : data.name,
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
                    name : data.name,
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
    let time = game.time;
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