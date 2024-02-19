import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor(firstName:string, lastName:string, email:string, password:string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;

  }
}

class UserManagement {
  users: User[];

  constructor() {
    this.users = []
  }
  async registerUser(req: Request, res: Response) {
    const {firstName, lastName, email, password} = req.body;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({errors:errors.array()})
    }
    
    if (this.users.find(user => user.email === email)) {
      return res.status(400).json({ errors: [{msg: 'Email already exists.'}] });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User(firstName, lastName, email, hashedPassword);
    
      this.users.push(newUser);
      
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch {
      console.error('Error hashing password:', errors);
      return res.status(500).json({ errors: [{msg:'Internal server error.' }]});
    }
  }
  async userLogin (req: Request, res: Response) {
    const {email} = req.body;
    const user = this.users.find(user => user.email === email);
  
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
  
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not allowed')
      }
    } catch {
      res.status(500).send();
    }
  }
  getUsers(req:Request, res: Response) {
    res.status(200).json(this.users)
  }
}
// const users: UserInterface[] = [];
const app: Express = express();
const port = process.env.PORT || 3000;
const userManagement = new UserManagement();

app.use(bodyParser.json());

app.post('/register', 
[
  body('firstName').notEmpty().withMessage('First name is required.'),
  body('lastName').notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
], (req: Request, res: Response) => userManagement.registerUser(req, res))

app.post('/login', (req: Request, res: Response) => userManagement.userLogin(req, res))

app.get('/users', (req: Request, res: Response) => {userManagement.getUsers(req, res)});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});