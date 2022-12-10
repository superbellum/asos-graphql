const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schema');
const bodyParser = require('body-parser');
const cors = require('cors');
const {ApolloServer} = require('apollo-server-express');

// connect to mongodb
const connect = mongoose.connect("mongodb://localhost:27017/moviesdb", {useNewUrlParser: true});
connect.then((db) => {
  console.log('Connected correctly to server!');
}, (err) => {
  console.log(err);
});

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers
});

const app = express();
app.use(bodyParser.json());
app.use('*', cors());
server.start().then(r => {
  server.applyMiddleware({app});
})

app.listen({port: 4000}, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
