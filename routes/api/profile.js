const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const middleware = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const config = require('config');
const request = require('request');

//router.get('/api/profile', (req, res) => res.send('Profile Route'));

router.get('/me', middleware, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return res.status(400).send('No profile found');
  }
  res.send(profile);
});

//Create a profile    /api/profile
//@route POST /api/profile
//@desc Create and Update a profile
//access  private
router.post(
  '/',
  [
    middleware,
    [check('status', 'Status should not be empty').not().isEmpty(), check('skills', 'Please provide your skills').not().isEmpty()]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check user already has profile or not
    const { company, website, location, status, skills, bio, githubusername, youtube, twitter, facebook, linkedin, instagram } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills.split(',').map((skill) => skill.trim());

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      //let profile = await Profile.findById(req.user.id);
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //if profile found update the profile
        profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
        return res.send(profile);
      }
      //if there is no profile, create it
      profile = new Profile(profileFields);
      //save it
      await profile.save();
      res.send(profile);
    } catch (err) {
      res.status(500).send('Error');
    }
  }
);

//@route GET /api/profile
//@desc get all profiles
//access  public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.send(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//@route GET /api/profile/user/:user_id
//@desc get a specific user's profile
//access  public

router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.send(profile);
  } catch (err) {
    console.error(err);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }

    res.status(500).json({ msg: 'Server Error' });
  }
});

//Delete a user
//@route DELETE /api/profile
//@desc delete a profile, user
//access  private

router.delete('/', middleware, async (req, res) => {
  try {
    //DELETE A PROFILE
    await Profile.findOneAndRemove({ user: req.user.id });
    //DELETE A USER
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User and Profile Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//Adding an experience
//@route PUT /api/profile/experience
//@desc adding an experience a profile
//access  private

router.put(
  '/experience',
  [
    middleware,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Compnay is required').not().isEmpty(),
      check('from', 'Starting date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } = req.body;

    // const newExperience = {};

    // if (title) newExperience.title = title;
    // if (company) newExperience.company = company;
    // if (location) newExperience.location = location;
    // if (from) newExperience.from = from;
    // if (to) newExperience.to = to;
    // if (current) newExperience.current = current;
    // if (description) newExperience.description = description;

    const newExperience = {
      title: title,
      company, //shortcut es:6
      location,
      from,
      to,
      current,
      description
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Delete an experience
//@route DELETE /api/profile/experience/:experienceid
//@desc delete an experience from a profile
//access  private

router.delete(
  '/experience/:experienceid',

  middleware,

  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      // profile.experience = profile.experience.filter((obj) => {
      //   return obj._id.toString() !== req.params.experienceid;
      // });   this works

      //Search the id to be deleted in an profile.experience array
      //let indexOfExperienceObjectToBeRemoved = profile.experience.map((item) => item.id).indexOf(req.params.experienceid);

      let indexOfExperienceObjectToBeRemoved = profile.experience.map((singlearray) => singlearray.id).indexOf(req.params.experienceid);
      //  Array extracted from  group of arrays ie profile.experice  => (singlearray => singlearray.id).indexOf(search id in an array)
      //console.log('index', indexOfExperienceObjectToBeRemoved);
      profile.experience.splice(indexOfExperienceObjectToBeRemoved, 1);

      await profile.save();
      res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Add a profile education
//@route PUT /api/profile/education
//@desc add a profile education
//access  private

router.put(
  '/education',
  [
    middleware,
    [
      check('school', 'School name is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'Starting date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    // const newExperience = {};

    // if (title) newExperience.title = title;
    // if (company) newExperience.company = company;
    // if (location) newExperience.location = location;
    // if (from) newExperience.from = from;
    // if (to) newExperience.to = to;
    // if (current) newExperience.current = current;
    // if (description) newExperience.description = description;

    const educationObj = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      //if you don't put await here, profile would be null and gives error
      let profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(educationObj);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//Delete an education
//@route DELETE /api/profile/experience/:educationid
//@desc delete an education from a profile
//access  private

router.delete(
  '/education/:educationid',

  middleware,

  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education = profile.education.filter((obj) => {
        return obj._id.toString() !== req.params.educationid;
      });

      //   Search the id to be deleted in an profile.education array
      //  let indexOfExperienceObjectToBeRemoved = profile.experience.map((item) => item.id).indexOf(req.params.experienceid);

      //  let indexOfExperienceObjectToBeRemoved = profile.experience.map((singlearray) => singlearray.id).indexOf(req.params.experienceid);
      //  Array extracted from  group of arrays ie profile.experice  => (singlearray => singlearray.id).indexOf(search id in an array)
      //   console.log('index', indexOfExperienceObjectToBeRemoved);
      //  profile.experience.splice(indexOfExperienceObjectToBeRemoved, 1);

      await profile.save();
      res.send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=14&sort=created:asc
    &client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
      }
      if (response.statusCode !== 200) {
        res.status(404).json({ msg: 'No github profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});

module.exports = router;
