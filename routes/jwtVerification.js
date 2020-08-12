const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {

  try {
    const accessToken = req.header('Access-Token').split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json('Invalid Authorization Token');
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json('Internal Server Error');
  }
}