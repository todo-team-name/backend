const User = require('./user.model.js');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const config = require('../../config/env');

function sendBackUser(savedUser, res) {
  const token = jwt.sign({savedUser}, config.jwtSecret);
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
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save()
    .then(savedUser => sendBackUser(savedUser, res))
    .catch(e => next(e));
}

function login(req, res, next) {
  User.findOne({username: req.body.username}).then((candidateUser) => {
    return candidateUser.comparePasswords(req.body.password);
  }).then((candidateUser) => sendBackUser(candidateUser, res)).catch(() => {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
    return next(err);
  })
}

// todo implement this
function update(req, res, next) {
  return res.json({no: "u"});
}


module.exports = { signup, login, update };
