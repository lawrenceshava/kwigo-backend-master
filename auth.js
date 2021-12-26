var _ = require("lodash")
var { checkToken } = require('./datasources/token-ds');


module.exports = async({ req }) => {

  const token = (req.headers && req.headers.authorization) || '';

  if(token.length) {
      const user = await checkToken(token);

      if(user) {
        delete user.password
        return Object.assign({}, req, {user: user})
      }
  }
  
  return req;
}
