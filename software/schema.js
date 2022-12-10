const {gql} = require('apollo-server-express');
const Movie = require('./models/movie').Movies;

const typeDefs = gql`
  type Movie {
    id: ID!
    name: String
    producer: String
    rating: Float
  }
  
  type Query {
    getMovies: [Movie]
    getMovie(id: ID!): Movie
  }
  
  type Mutation {
    addMovie(name: String!, producer: String!, rating: Float!): Movie
    updateMovie(id: ID!, name: String, producer: String, rating: Float): Movie
  }
`

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

module.exports = {typeDefs, resolvers};
