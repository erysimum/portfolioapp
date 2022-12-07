const express = require('express');
//var cors = require('cors');

const connectDB = require('./config/db');
// const userRoute = require('../CLUSTER0/routes/api/users');
// const authRoute = require('../CLUSTER0/routes/api/auth');
// const profileRoute = require('../CLUSTER0/routes/api/profile');
// const postsRoute = require('../CLUSTER0/routes/api/posts');
const path = require('path');
const app = express();

//CONNECT TO DB
connectDB();

//Parse incoming json to object
//If not parsed, then request.body would be undefined
app.use(express.json());

//Routes
// app.use(userRoute);
// app.use(authRoute);
// app.use(profileRoute);
// app.use(postsRoute);

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('API runing..');
// });

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
