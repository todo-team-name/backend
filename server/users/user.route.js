const express = require('express')
const validate = require('express-validation')
const paramValidation = require('../../config/param-validation')
const userCtrl = require('./user.controller.js')
const expressJwt = require('express-jwt')
const config = require('../../config/env')

const router = express.Router(); // eslint-disable-line new-cap

router.route('/signup')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.signup);

router.route('/login')
  /** GET /api/users/ - Get user */
  .post(userCtrl.login)

router.route('/update')
  .post(expressJwt({ secret: config.jwtSecret }), userCtrl.update)

module.exports = router;
