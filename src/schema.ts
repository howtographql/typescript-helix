import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = `
  type Query {
    info: String
  }
`;

const resolvers = {
  Query: {
    info: () => "Test",
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
