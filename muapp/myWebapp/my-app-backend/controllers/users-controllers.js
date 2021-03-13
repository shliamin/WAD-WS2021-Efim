const { uuid } = require('uuidv4');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Efim Shliamin',
    login: 'normalo',
    password: 'normalo'
  }
];

const getUsers = (req,res,next) => {
  res.json({users: DUMMY_USERS});
};

const signup = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {name,email,password,contacts} = req.body;

  let existingUser;
  try {
   existingUser = await User.findOne({ email: email});
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  if(existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    contacts
  });

  try{
    await createdUser.save();
  } catch(err){
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = (req,res,next) => {
  const {login, password} = req.body;

  const identifiedUser = DUMMY_USERS.find(u=>u.login === login);
  if (!identifiedUser || identifiedUser.password !==password){
    throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
  }

  res.json({message: 'Logged in!'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
