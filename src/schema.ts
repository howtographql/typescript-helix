import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent: unknown, args: unknown, context: GraphQLContext) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: (
      parent: unknown,
      args: { url: string; description: string },
      context: GraphQLContext
    ) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
