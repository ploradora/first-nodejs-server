const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const users = [];
const PORT = 3000;

app.use(bodyParser.json());

app.post('require', (req, res) => {
  const {firstName, lastName, email, password} = req.body;

  if(!firstName || !lastName || !email || !password) {
    return res.status(400).json({message: 'Please fiil all fields'})
  }

  if(users.find(user => user.mail === mail)) {
    return res.status(400).json({message: "This email already exists"})
  }

  const user = {
    firstName, 
    lastName, 
    email, 
    password
  }

  users.push(user);

  return res.status(201).json({message: "Successfully added user"})
})

app.get('users-list', (req, res) => {
  res.end(200).json(users);
})

