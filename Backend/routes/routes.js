const express = require("express");
const router = express.Router();

const {submitNotes}= require("../controller/NoteController")

router.post("/",submitNotes);

module.exports = router