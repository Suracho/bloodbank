const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hospitalSchema = new Schema({
    name : {
        type : String,
        required: true
    },
    address : {
        type : String,
        required: true
    },
    phone : {
        type : String,
        required : true
    },
    Apositive : {
        type : Number,
        required: true
    },
    Anegative : {
        type : Number,
        required: true
    },
    Bpositive : {
        type : Number,
        required: true
    },
    Bnegative : {
        type : Number,
        required: true
    },
    Opositive : {
        type : Number,
        required: true
    },
    Onegative : {
        type : Number,
        required: true
    },
    ABpositive : {
        type : Number,
        required: true
    },
    ABnegative : {
        type : Number,
        required: true
    },
},{timestamps : true})

const Hospital = mongoose.model('hospitals',hospitalSchema)

module.exports = Hospital