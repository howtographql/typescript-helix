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

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
  Link: {
    id: (parent: any) => parent.id,
    description: (parent: any) => parent.description,
    url: (parent: any) => parent.url,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
