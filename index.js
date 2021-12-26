const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const config = require('./config')

// GraphQL Definitions
const typeDefs = require('./schema');
const resolvers= require('./resolvers');

const auth = require('./auth');

// GraphQL datasources
const userDS = require('./datasources/user-ds');
const geoDS = require('./datasources/geo-ds');
const tripDS = require('./datasources/trip-ds');
const requireAuthDirective = require("./directives/requireAuthDirective");

// MongoDB Connection
mongoose.connect(config.dbUrl, {useNewUrlParser: true});

mongoose.connection.on('open', () => console.log('DB CONNECTION OK'));
mongoose.connection.on('error', (err) => console.log('DB CONNECTION ERROR ' + err));

// GraphQL server boot
const server = new ApolloServer({
  context: auth,      // Auth function
  typeDefs,
  resolvers,
  schemaDirectives: {
    requireAuth: requireAuthDirective
  },
  dataSources: () => ({
    userDS: userDS,
    geoDS:  geoDS,
    tripDS: tripDS
  })
});

server.listen(config.port).then(({url}) => {
  console.log(`\n\n 🚀     Server ready at ${url} \n\n`);
});
