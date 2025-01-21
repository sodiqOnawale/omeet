import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type Profile {
    firstName: String!
		lastName: String!
		dateOfBirth: String!
		gender: String!
		bio: String
		photos: [String]!
		location: LOcation
  }

	type User {
		id: ID!
    email: String!
    username: String!
    profile: Profile!
    createdAt: String!
    updateAt: String!
	}

  type AuthPayLoad {
    token: String!
    user: User!
  }
    
  input LocationInout {
    type: String!
    coordinates: [Float!]!
  }

  input ProfileInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    bio: String!
    photos: [String!]
    location: LocationInput
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
    profile: ProfileInput
  }

  inputLoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User!
  }

  type Mutation {
    register(input: RegisterInput): AuthPayLoad!
    login(input: LoginInput!): AuthPayLoad!
  }
`;