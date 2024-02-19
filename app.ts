import UserManagement from './users';

import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const bodyParser = require('body-parser');
const { body } = require('express-validator');

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