import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User, Link } from "@prisma/client";

export const APP_SECRET = "this is my secret";

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
    me: User!
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
    me: (parent: unknown, args: unknown, context: GraphQLContext) => {
      if (context.currentUser === null) {
        throw new Error("Unauthenticated!");
      }

      return context.currentUser;
    },
  },
  Mutation: {
    post: (
      parent: unknown,
      args: { url: string; description: string },
      context: GraphQLContext
    ) => {
      if (context.currentUser === null) {
        throw new Error("Unauthenticated!");
      }

      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
          postedBy: { connect: { id: context.currentUser.id } },
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
    login: async (
      parent: unknown,
      args: { email: string; password: string },
      context: GraphQLContext
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error("No such user found");
      }

      const valid = await compare(args.password, user.password);

      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = sign({ userId: user.id }, APP_SECRET);

      return {
        token,
        user,
      };
    },
  },
  Link: {
    postedBy: async (parent: Link, args: unknown, context: GraphQLContext) => {
      if (!parent.postedById) {
        return null;
      }

      return context.prisma.link
        .findUnique({ where: { id: parent.id } })
        .postedBy();
    },
  },
  User: {
    links: (parent: User, args: unknown, context: GraphQLContext) =>
      context.prisma.user.findUnique({ where: { id: parent.id } }).links(),
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
