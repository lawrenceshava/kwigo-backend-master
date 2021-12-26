

var Token = require('../models/token')
var User = require('../models/user')

function checkToken(token) {
  return Token.findOne({token: token}).then((res) => {
    if(res) {
      return User.findOne({email: res.email});
    } else {
      return null;
    }
  })
}

module.exports = {
  checkToken: checkToken
}
