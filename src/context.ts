import { PrismaClient, User } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { authenticateUser } from "./auth";

const prisma = new PrismaClient();

export type GraphQLContext = {
  prisma: PrismaClient;
  currentUser: User | null;
};

export async function contextFactory(
  request: FastifyRequest
): Promise<GraphQLContext> {
  return {
    prisma,
    currentUser: await authenticateUser(prisma, request),
  };
}
