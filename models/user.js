const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    bloodgroup : {
        type : String,
        required : true
    },
    login : {
        type : Boolean,
        default : false
    },
    didDonate : {
        type : Boolean,
        default : false
    },
    didReceive : {
        type : Boolean,
        default : false
    }
},{timestamps : true});

const User = mongoose.model('user', userSchema);

module.exports = User;