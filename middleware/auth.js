const config = require('config'); // to get the secret token
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  //Get token
  const token = req.header('x-auth-token');

  //if there is not a token
  if (!token) {
    return res.status(401).json({ msg: 'There is no token' });
  }

  //verify the token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // console.log('decode ', decoded);
    //{ xyz: { id: '60b895f2bd62e049b59a1e02' },
    //iat: 1622709746,
    //exp: 1623069746 }

    req.user = decoded.xyz; // { id: '60b895f2bd62e049b59a1e02' }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' });
  }
};

module.exports = auth;
