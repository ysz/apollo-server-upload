const PORT = Number(process.env.PORT) || 8080;
import * as express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const app = express();
import { GraphQLUpload } from "graphql-upload";

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Mutation {
    upload(file: Upload!): String!
  }
`;
const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    upload: async (parent: any, { file }: { file: any }, context) => {
      console.log("upload");

      const { createReadStream } = await file;
      console.log(file);

      return "foo";
    }
  }
};

const server = new ApolloServer({
  uploads: {
    // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  },
  typeDefs,
  resolvers
});
app.use(
  /*'/foo/graphql',*/
  /* graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}),*/
  server.getMiddleware({ path: "/foo/graphql" })
);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
});
