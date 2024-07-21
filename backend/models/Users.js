const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  eAdmin:{type: Number, default: 0},
  email: { type: String, required: true, unique: true },
  age: { type: String, default: "Não informado"},
  address: { type: String, default: "Não informado"},
  phone: { type: String, default: "Não informado"},
  balance: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Users', UserSchema);
