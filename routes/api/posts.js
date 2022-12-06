const express = require('express');
const router = express.Router();
const middleware = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');
const Post = require('../../models/Post');

//router.get('/api/posts', (req, res) => res.send('Posts Route'));
//Post a post- create a post
//@route post /api/posts
//@desc create a post
//access  private

router.post('/', [middleware, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //get the user but don't send the password

    //Doesn't work with findOne coz User collection has no field named user that's why
    //using findOne({user :req.user.id}) would yield null.
    // let user = await User.findOne({ user: req.user.id }).select('-password');  not work it gives null
    let user = await User.findById(req.user.id).select('-password'); // works because User collection has
    //automatic field _id

    const newPost = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar
    };
    const post = await new Post(newPost);
    await post.save();
    res.send(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//Get a post- get all post
//@route get /api/posts
//@desc get all post
//access  private

router.get('/', middleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //sort in latest one 1st

    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get('/:id', middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/:id
// @desc     DELETE post by ID
// @access   Private
router.delete('/:id', middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }

    // Check user whether user owns the post or not
    //post.user() returns=> Object to compare to req.user.id which returns String
    //post.user needs to convert to toString()
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/likes/:id
// @desc     PUT to likes the post
// @access   Private
//id => id of the post which the user is persing
router.put('/like/:id', middleware, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    //Check whether user has already liked the post or not
    if (post.likes.filter((obj) => obj.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();

    return res.json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put('/unlike/:id', middleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has not yet been liked
    if (post.likes.filter((obj) => obj.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // remove the like
    //ES6 arrow function with .filter, works too
    //post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);
    post.likes = post.likes.filter((obj) => obj.user.toString() !== req.user.id);

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route    POST api/posts/comment/:id
// @desc     comment a post
// @access   Private

router.post('/comment/:id', [middleware, [check('text', 'Comment is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let post = await Post.findById(req.params.id);
    let user = await User.findById(req.user.id).select('-password');
    const { text } = req.body;

    const newComment = {
      text: text,
      name: user.name,
      avatar: user.avatar,
      user: user._id
    };

    post.comments.unshift(newComment);
    await post.save();
    res.send(post.comments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//:id=> post id   comment_id=>comment_id
// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     comment a post
// @access   Private

router.delete('/comment/:id/:comment_id', middleware, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    // let user = await User.findById(req.user.id).select('-password');

    //pull out the comment
    //const comment = post.comments.find((obj) => obj._id.toString() === req.params.comment_id);//works too
    const comment = post.comments.find((obj) => obj.id === req.params.comment_id); //works too

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      // req.user.id gives String, therefore comment.user need to parse into toString
      return res.status(401).json({ msg: 'User not authorized' });
    }
    //Delete a comment
    //post.comments = post.comments.filter((obj) => obj._id.toString() !== req.params.comment_id); //works
    post.comments = post.comments.filter((obj) => obj.id !== req.params.comment_id);

    //post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id); //works

    await post.save();
    res.send(post.comments);
  } catch (err) {
    // console.log(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
