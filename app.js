const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const users = [];

app.post('/register', (req, res) => {
  const {firstName, lastName, email, password} = req.body;
  const errors = {};
  
  if (!firstName) {
    errors.firstName = 'First name is required.';
  }
  if (!lastName) {
    errors.lastName = 'Last name is required.';
  }
  if (!email) {
    errors.email = 'Email is required.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  if (users.find(user => user.email === email) && !errors) {
    return res.status(400).json({ message: 'Email is already registered.'});
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
  res.end(200).json(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});