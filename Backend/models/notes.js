const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
 message:{
    type:String,
    required:true
 }
,
 toPerson:{
   type:String,
   required:true
 },
 Date:{
  type:Date,
  default:Date.now,
 }
}, {timestamps:true})


const Notes = mongoose.model("Notes",noteSchema)
module.exports = Notes