const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schema');
const bodyParser = require('body-parser');
const cors = require('cors');
const {ApolloServer} = require('apollo-server-express');

const connect = mongoose.connect("mongodb://127.0.0.1:27017/moviesdb", {useNewUrlParser: true});
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
