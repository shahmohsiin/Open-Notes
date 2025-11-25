const bcrypt = require("bcryptjs")
const plain="yourpasswordhere"
const rounds = 12

const salt = bcrypt.genSaltSync(rounds);
const hashed = bcrypt.hashSync(plain,salt);
const file = new Blob([hashed],{type:"text/plain"})
console.log(hashed)