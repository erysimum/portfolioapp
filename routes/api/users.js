const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
//router.get('/api/users', (req, res) => res.send('User Route'));

router.post(
  '/',

  [
    check('name', 'Name should not be empty').not().isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'Password should not be less than 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // {  //send these errors to the client
    //   "errors": [
    //     {
    //       "location": "body",
    //       "msg": "Invalid value",
    //       "param": "username"
    //     }
    //   ]
    // }

    //Check user already exits or not
    const { name, email, password } = req.body;
    try {
      let user = null;
      user = await User.findOne({ email }); //this let variable is very imp here if it's a new user
      //the value of user could be null
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User Already Exists!' }] });
      }
      //Get user's gravatar
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
      //new instance of user
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // res.send('User Saved');

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
