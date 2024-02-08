const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const users = [];

app.post('/register', (req, res) => {
  const {firstName, lastName, email, password} = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  const newUser = {
    firstName,
    lastName,
    email,
    password
  };

  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully.' });
})

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});