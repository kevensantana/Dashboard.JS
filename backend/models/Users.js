const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true},
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: "Não informado"},
  address: { type: String, default: "Não informado"},
  phone: { type: String, default: "Não informado"},
  balance: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true,
}).save().then(() => {
  console.log("Usuario cadastrado com sucesso")
}).catch((err) => {
  console.log("Erro ao cadastrar usuario: ", err)
})

module.exports = mongoose.model('Users', UserSchema);
