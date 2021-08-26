import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export const APP_SECRET = "this is my secret";

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
    signup(email: String!, password: String!, name: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }

  type Link {
    id: ID!
    description: String!
    url: String!
    postedBy: User
  }

  type AuthPayload {
    token: String
    user: User
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    links: [Link!]!
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
    signup: async (
      parent: unknown,
      args: { email: string; password: string; name: string },
      context: GraphQLContext
    ) => {
      const password = await hash(args.password, 10);
      const user = await context.prisma.user.create({
        data: { ...args, password },
      });
      const token = sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user,
      };
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
