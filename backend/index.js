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