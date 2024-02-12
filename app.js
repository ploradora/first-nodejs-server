const express = require('express');
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const users = [];

app.post('/register', 
[
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
],
(req, res) => {
  const {firstName, lastName, email, password} = req.body;
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()})
  }
  
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'Email is already exists.' });
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