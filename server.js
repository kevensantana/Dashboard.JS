const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.json({ success: false, message: 'Credenciais inválidas' });
    }
});

app.get('/user', (req, res) => {
    const token = req.headers['authorization'];
    console.log('Received token:', token);  // Log the received token

    if (token === 'fake-jwt-token') {
        res.json({ success: true, user: users[0] });
        console.log('User data sent:', users[0]);  // Log the user data being sent
    } else {
        res.json({ success: false });
        console.log('Invalid token');  // Log if the token is invalid
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
