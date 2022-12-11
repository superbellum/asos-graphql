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
