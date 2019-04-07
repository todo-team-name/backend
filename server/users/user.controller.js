const User = require('./user.model.js');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const config = require('../../config/env');

function sendBackUser(savedUser, res) {
  savedUser = savedUser.toJSON()
  const forbiddenFruit = new Set(["_id", "password", "createdAt", "__v"])
  for (key in savedUser) {
    if (forbiddenFruit.has(key)) {
      savedUser[key] = undefined;
    }
  }

  console.log("SENDING BACK?")

  const token = jwt.sign({...savedUser}, config.jwtSecret);
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
  
  console.log("WHOOOOOOOHOOOO")
  console.log(req.body)
  console.log("WHOOOOOOOHOOOO")

  const userObj = {
    username: req.body.username,
    password: req.body.password,
    // points: req.body.points,
    // difficulty: req.body.difficulty, 
  }

  // if (req.body.game_info_andriod) {
  //   userObj["game_info_andriod"] = req.body.game_info_andriod;
  // } else if (req.body.game_info_react) {
  //   userObj["game_info_react"] = req.body.game_info_react;
  // }
  
  const user = new User(userObj);

  console.log("WHOOOOOOOO")
  console.log(userObj)
  
  user.save()
    .then(savedUser => sendBackUser(savedUser, res)).catch((err) => {
      console.log("FUUUUUU")
      console.log(err)
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
  User.findOneAndUpdate({username: req.user.username}, { $set: req.body })
    .then((candidateUser) => sendBackUser(candidateUser, res))
    .catch(() => {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
      return next(err);
    })
}


module.exports = { signup, login, update };
