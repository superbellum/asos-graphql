# GraphQL demo app

## Dependencies

- graphql
- apollo-server-express
- express
- mongoose
- cors
- body-parser

## Schema

```graphql
type Movie {
  id: ID
  name: String
  producer: String
  rating: Float
}
```

```graphql
type Query {
  getMovies: [Movie]
  getMovie(id: ID!): Movie
}
  
type Mutation {
  addMovie(name: String!, producer: String!, rating: Float!): Movie
  updateMovie(id: ID!, name: String, producer: String, rating: Float): Movie
}
```

## Examples

### Get movies

```graphql
query GetMovies {
  getMovies {
    id,
    name
  }
}
```

### Get movie by ID

#### Operation

```graphql
query GetMovie($getMovieId: ID!) {
  getMovie(id: $getMovieId) {
    id,
    producer,
    rating,
    name
  }
}
```

#### Variables

```json
{
  "getMovieId": "639470d132b9c06658f12c88"
}
```

### Add movie

```graphql
mutation AddMovie {
  addMovie(name: "GraphQL Movie", producer: "Facebook", rating: 4.5) {
    id
    name
    rating
    producer
  }
}
```

### Update movie

#### Operation

```graphql
mutation UpdateMovie($updateMovieId: ID!, $name: String, $producer: String, $rating: Float) {
  updateMovie(id: $updateMovieId, name: $name, producer: $producer, rating: $rating) {
    id,
    name,
    producer
  }
}
```

#### Variables

```json
{
  "updateMovieId": "639470d132b9c06658f12c88",
  "name": "Google film 5",
  "producer": "Google",
  "rating": 1.5
}
```

### Architecture

GraphQL is a popular API architecture implemented in many frameworks using different programming languages.
The most important thing that a GraphQL API backend has to define is the schema, consisting of the object types and the operations upon them.

For our demo purposes and simplicity's sake, we have chosen for a simple Javascript implementation powered by the notorious Node.js framework.
Node.js allows us to fire up a complete backend software without much effort.
The main code resides in the `index.js` file, where we:
- define our dependencies and import them to our project
```javascript
const express = require('express');
const mongoose = require('mongoose');
const schema = require('./schema');
const bodyParser = require('body-parser');
const cors = require('cors');
const {ApolloServer} = require('apollo-server-express');
```
- set up a connection to a local database instance
```javascript
const connect = mongoose.connect("mongodb://127.0.0.1:27017/moviesdb", {useNewUrlParser: true});
connect.then((db) => {
  console.log('Connected correctly to server!');
}, (err) => {
  console.log(err);
});
```
- create the GraphQL definition using the Apollo server library
```javascript
const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers
});
```
- create the app instance with some custom configuration
```javascript
const app = express();
app.use(bodyParser.json());
app.use('*', cors());
server.start().then(r => {
  server.applyMiddleware({app});
})
app.listen({port: 4000}, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));

```

The Apollo server instance uses the GraphQL type definitions and the resolver implementations from `schema.js`.
Our type definitions include the object types
(basically of only one object called **Movie**) and the operations that can be called upon these objects (**queries** and **mutations**).

Our single entity can be found in `models/movie.js` and has the following definition:
```javascript
const movieSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  producer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
```

We're defining 2 queries for retrieving a list of all the movies in our database, as well as retrieving a single movie entity by ID.
We also have 2 mutations for introducing a new movie to our system, as well as modifying an existing one.
```graphql
type Query {
  getMovies: [Movie]
  getMovie(id: ID!): Movie
}
  
type Mutation {
  addMovie(name: String!, producer: String!, rating: Float!): Movie
  updateMovie(id: ID!, name: String, producer: String, rating: Float): Movie
}
```

The way our system translates the aforementioned operations is defined and implemented by a single resolver, which can be found in the same file:
```javascript
const resolvers = {
  Query: {
    getMovies: async (parent, args) => {
      return Movie.find({});
    },

    getMovie: async (parent, args) => {
      return Movie.findById(args.id);
    }
  },
  Mutation: {
    addMovie: async (parent, args) => {
      let movie = new Movie({
        name: args.name,
        producer: args.producer,
        rating: args.rating,
      });
      return movie.save();
    },

    updateMovie: async (parent, args) => {
      return Movie.findOneAndUpdate(
        {
          _id: args.id
        },
        {
          $set: {
            name: args.name,
            producer: args.producer,
            rating: args.rating,
          }
        }, {new: true}, (err, Movie) => {
          if (err) {
            console.log('Something went wrong when updating the movie');
          }
        }
      );
    }
  }
}
```
The resolver communicates with our database for retrieving and altering the data within according to the operation(s) requested by the user.

**Note:** the dependencies and their versions are located in the `package.json` file.