const Promise = require('bluebird');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR  = 10;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var candidateUser = this;
  var savedPassword = candidateUser.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
      if (err || !isMatch) {
        reject(err);
      } else {
        resolve(candidateUser);
      }
    });
  })
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }
  console.log("aaa")
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    console.log("bbb")

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
