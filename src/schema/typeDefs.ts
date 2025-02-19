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
		photos: [String!]
		location: Location
  }

	type User {
		id: ID!
    email: String!
    username: String!
    profile: Profile!
    createdAt: String!
    updatedAt: String!
	}

  type AuthPayload {
    token: String!
    user: User!
  }
    
  input LocationInput {
    type: String!
    coordinates: [Float!]!
  }

  input ProfileInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    bio: String
    photos: [String!]
    location: LocationInput
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
    profile: ProfileInput!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User!
  }

  scalar Upload

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    uploadProfileImage(file: Upload!): String!
  }
`;