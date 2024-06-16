const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Definir o esquema do usuário
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    email: String,
    password: String
});

// Criar o modelo do usuário
const User = mongoose.model('User', userSchema);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado ao MongoDB');
        migrateData();
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

// Função para ler o arquivo JSON e migrar os dados
function migrateData() {
    const filePath = path.join(__dirname, 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            process.exit(1);
        }

        const users = JSON.parse(data);

        // Inserir dados no MongoDB
        User.insertMany(users)
            .then(() => {
                console.log('Dados migrados com sucesso!');
                process.exit(0);
            })
            .catch(err => {
                console.error('Erro ao migrar dados:', err);
                process.exit(1);
            });
    });
}
