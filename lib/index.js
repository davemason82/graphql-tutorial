const app = require('express')();
const graphqlHTTP = require('express-graphql');
const pg = require('pg');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const ncSchema = require('../schema');
const { nodeEnv } = require('./util');
const pgConfig = require('../config/pg')[nodeEnv];

const pgPool = new pg.Pool(pgConfig);

const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);
  console.log(`Running in ${nodeEnv} mode...`);

  app.use('/graphql', graphqlHTTP({
    schema: ncSchema,
    graphiql: true,
    context: {
      pgPool,
      mPool
    }
  }));

  const PORT = process.env.port || 3000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
