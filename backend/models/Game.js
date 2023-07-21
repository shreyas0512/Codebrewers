const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    currentWordIndex : {
        type : Number,
        default : 0
    },
    socketId : {
        type : String,
    },
    isGameLeader : {
        type : Boolean,
        default : false
    },
    WPM : {
        type : Number,
        default : 0
    },
    accuracy : {
        type : Number,
        default : 0
    },
    
    name : {
        type : String
    }
});

const GameSchema = new mongoose.Schema({
    words : [{type : String}],
    isOpen : {
        type : Boolean,
        default : true
    },
    isOver : {
        type : Boolean,
        default : false
    },
    startTime : {
        type : Number
    },
    difficultyLevel : {
        type : String,
        default : "Easy"
    },
    time : {
        type : Number,
        default : 60
    },
    players : [PlayerSchema]
});

module.exports = mongoose.model('Game', GameSchema);