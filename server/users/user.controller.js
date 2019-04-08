const User = require('./user.model.js');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const config = require('../../config/env');

function cleanUser (savedUser) {
  const forbiddenFruit = new Set(["_id", "password", "createdAt", "__v"])
  for (key in savedUser) {
    if (forbiddenFruit.has(key)) {
      savedUser[key] = undefined;
    }
  }
  return savedUser;
}

function sendBackUser(savedUser, res) {
  const token = jwt.sign({username: savedUser.username}, config.jwtSecret);
  return res.json({
    token,
  });
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function signup(req, res, next) {

  const userObj = {
    username: req.body.username,
    password: req.body.password,
    points: req.body.points,
    difficulty: req.body.difficulty, 
  }

  // const userObj = req.body;

  const user = new User(userObj);
  
  user.save()
    .then(savedUser => sendBackUser(savedUser, res)).catch(() => {
      const err = new APIError('Authentication error', httpStatus.BAD_REQUEST);
      return next(err);
    })
}

function login(req, res, next) {
  User.findOne({username: req.body.username}).then((candidateUser) => {
    return candidateUser.comparePasswords(req.body.password);
  }).then((candidateUser) => sendBackUser(candidateUser, res)).catch(() => {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
    return next(err);
  })
}

// never do this in real life
function update(req, res, next) {
  User.findOneAndUpdate({username: req.user.username}, { $set: req.body }, {new: true})
    .then((candidateUser) => res.json(cleanUser(candidateUser)))
    .catch(() => {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
      return next(err);
    })
}


module.exports = { signup, login, update };
