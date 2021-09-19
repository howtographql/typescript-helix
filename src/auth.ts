import { PrismaClient, User } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { JwtPayload, verify } from "jsonwebtoken";

export const APP_SECRET = "this is my secret";

export async function authenticateUser(
  prisma: PrismaClient,
  request: FastifyRequest
): Promise<User | null> {
  if (request.headers.authorization) {
    const token = request.headers.authorization.split(" ")[1];
    const tokenPayload = verify(token, APP_SECRET) as JwtPayload;
    const userId = tokenPayload.userId;

    return await prisma.user.findUnique({ where: { id: userId } });
  }

  return null;
}
