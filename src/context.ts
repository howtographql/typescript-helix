import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
};

export async function contextFactory(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}
