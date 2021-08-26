import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
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
