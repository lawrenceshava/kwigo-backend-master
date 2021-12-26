
const port = process.env.PORT || 4000;

const db = process.env.KWIGO ? 'kwigo-mongo' : 'camus.duckdns.org';
const redis = process.env.KWIGO ? 'kwigo-redis' : 'camus.duckdns.org';

const dbHost = db+':27017';
const redisHost = redis;
const dbName = 'kwigo'
const dbUser = 'backend';
const dbPassword = 'DB_PASSWORD';


module.exports =  {
   port: port,
   dbUrl: `mongodb://${dbUser}:${dbPassword}@${dbHost}/${dbName}`,
   dbHost: dbHost,
   redisHost: redisHost,
   redisPassword: dbPassword,
   dbUser: dbUser,
   dbPassword: dbPassword,
   googleAPIKey: 'GOOGLE_API_KEY'
}
