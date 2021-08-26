import { PrismaClient } from "@prisma/client";

export type GraphQLContext = {
  prisma: PrismaClient;
};
