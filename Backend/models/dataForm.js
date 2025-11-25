const mongoose = require("mongoose");

const userData = new mongoose.schema({
    name:{
        type:String,
        required: true
    },
    message:{
        type:String,
        required:true
    }
})

const form = mongoose.model("message", userData)
module.exports= form