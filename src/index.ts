import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { authMiddleware } from './middleware/auth';

dotenv.config()

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 4000;

  //Applying Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      return {
        message: error.message,
        locations: error.locations,
        path: error.path
      }
    }
  });

  await server.start()

  //Applying middleware
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: authMiddleware
    })
  );

  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  });
};

startServer().catch((err) => {
  console.error('Error starting server:', err)
  process.exit(1);
})