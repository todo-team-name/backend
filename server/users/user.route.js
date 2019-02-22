import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from './user.controller.js';
import expressJwt from 'express-jwt';
const config = require('../../config/env');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/signup')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.signup);

router.route('/login')
  /** GET /api/users/ - Get user */
  .post(userCtrl.login)

router.route('/update')
  .post(expressJwt({ secret: config.jwtSecret }), userCtrl.update)

export default router;
