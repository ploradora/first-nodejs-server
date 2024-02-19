import User from "./user";
import { Request, Response } from "express";

const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

export default class UserManagement {
  users: User[]

  constructor() {
    this.users = [];
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