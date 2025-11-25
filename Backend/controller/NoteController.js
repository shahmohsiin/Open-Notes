
const Notes = require("../models/notes")

exports.submitNotes = async (req,res,next)=>{
    try{
        const {message,toPerson} = req.body

        if (!message || !toPerson) {
            return res.status(400).json({error:'ALL FIELDS ARE REQUIRED'});
        }
          const notes = Notes.create({message,toPerson})
    
    
    res.status(201).json({success:true,data:notes})    }

    catch(error){
res.status(400).json({success:false,error:error})
    }

  next();
    
};