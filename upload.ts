const PORT = Number(process.env.PORT) || 8080;
import * as express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const app = express();
import { GraphQLUpload } from "graphql-upload";

const typeDefs = gql`
  type Query {
    hello: String
  }
  type File {
    id: String!
  }
  type Mutation {
    singleUpload(file: Upload!): File
  }
`;
const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    singleUpload: async (parent: any, { file }: { file: any }, context) => {
      console.log("upload");
      return { id: "foo" };

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
  resolvers,
  formatError: (err: any) => {
    console.log(err);

    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err;
  }
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
