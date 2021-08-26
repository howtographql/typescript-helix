import { PrismaClient, User } from "@prisma/client";

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: User | null;
};
