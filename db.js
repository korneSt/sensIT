var knex = require('knex')({
  client: 'mysql',
  connection: {
   host: 'eu-cdbr-azure-north-d.cloudapp.net',  // your host
   user: 'b81d267f8cb84b', // your database user
   password: '29b7a22d', // your database password
   database: 'pomiary'
  },
  pool: {
    idleTimeoutMillis: 60000,
    reapIntervalMillis: 2000
  }
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
    DB: bookshelf,
    Knex: knex
};