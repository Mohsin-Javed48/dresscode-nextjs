const JWT = require("jsonwebtoken");

const secret = "Fuckyou";

function createTokenForUser(user) {
  const paylaod = {
    _id: user._id,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
  const token = JWT.sign(paylaod, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
