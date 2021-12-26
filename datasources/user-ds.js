var bcrypt = require('bcryptjs');
var uuid   = require('uuid');

const saltRounds = 10;

var User = require('../models/user')
var Token = require('../models/token')

function getUserById(user_id) {
  return User.findOne({_id: user_id}).catch((err) => null)
}

function createUser(user) {
  return User.findOne({email: user.email}).then((res) => {    // Look if user exists
    if(res) return {existant: true};                     // If yes, return flag to resolver
    else { // Else create it
      return bcrypt.hash(user.password, saltRounds).then((pwd) => {
          user.password = pwd
          return User.create(user);
      });
    }
  });
}

function updateUser(user, modifs) {
  return User.updateOne({_id: user._id}, {$set: modifs})
}

function getUserByToken(token) {
  return Token.findOne({token: token}).then((res) => {
    if(res) return User.findOne({email: res.email});
    else return null;
  });
}

function login(email, password) {
  return User.findOne({email: email}).then((user) => {
    if (user) {
      return bcrypt.compare(password, user.password).then((res) => {
        if (res) {
          return Token.findOne({email: email}).then((res) => {
            if(res) {
              return {token: res.token};
            } else {
              let token = uuid.v4();
              Token.create({email: email, token: token});
              return {token: token};
            }
          })

        } else {
          return {msg: "Wrong password"};
        }
      })
    } else {
      return {msg: "Wrong username"};
    }
  })
}



module.exports = {

  getUserById: getUserById,
  getUserByToken: getUserByToken,
  createUser:  createUser,
  updateUser:  updateUser,
  login: login

}
