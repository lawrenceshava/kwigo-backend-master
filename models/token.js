var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
  token: String,
  email: String
},
{ collection: 'tokens' }
);

mongoose.model('Token', TokenSchema);

module.exports = mongoose.model('Token');
