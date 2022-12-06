const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    //user's id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  text: {
    //post
    type: String,
    required: true
  },
  name: {
    //name of user who post a post
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        //user who liked the post
        type: Schema.Types.ObjectId
      }
    }
  ],
  comments: [
    {
      //id of the user who commented on a post
      user: {
        type: Schema.Types.ObjectId
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
