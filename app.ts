import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

interface UserInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const users: UserInterface[] = [];

app.post('/register', 
[
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
], async (req: Request, res: Response) => {

  const {firstName, lastName, email, password} = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()})
  }
  
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ errors: [{msg: 'Email already exists.'}] });
  }


  try {
     
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };
  
    users.push(newUser);
    
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch {
    console.error('Error hashing password:', errors);
    return res.status(500).json({ errors: [{msg:'Internal server error.' }]});
  }
})

app.post('/login', async (req: Request, res: Response) => {
  const {email} = req.body;
  const user = users.find(user => user.email === email);

  if(user == null) {
    return res.status(400).send('Cannot find user')
  }

  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not allowed')
    }
  } catch {
    res.status(500).send();
  }
})

app.get('/users', (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});