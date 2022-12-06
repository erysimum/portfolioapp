const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

//router.get('/api/auth', (req, res) => res.send('Auth Route'));

// GET   /api/auth     (load with token)

router.get('/', middleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.json({ err });
  }
});

// POST /api/auth     login user

router.post(
  '/',

  [check('email', 'Please provide valid email').isEmail(), check('password', 'Please provide a password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check user already exits or not
    const { email, password } = req.body;
    try {
      let user = null;
      user = await User.findOne({ email }); //this let variable is very imp here if it's a new user
      //the value of user could be null
      if (!user) {
        //if there is no user with that credential
        return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
      }
      //match password if user is there in db

      const isMatch = await bcrypt.compare(password, user.password);
      //console.log('isMatch', isMatch);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credential' }] });
      }

      //Json web token
      const payload = {
        xyz: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
