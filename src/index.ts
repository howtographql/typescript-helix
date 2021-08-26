import fastify from "fastify";
import {
  getGraphQLParameters,
  processRequest,
  Request,
  renderGraphiQL,
} from "graphql-helix";
import { schema } from "./schema";
import { PrismaClient } from "@prisma/client";

async function main() {
  const server = fastify();
  const prisma = new PrismaClient();

  server.get("/graphql", (req, reply) => {
    reply.header("Content-Type", "text/html");
    reply.send(
      renderGraphiQL({
        endpoint: "/graphql",
      })
    );
  });

  server.post("/graphql", async (req, reply) => {
    const request: Request = {
      headers: req.headers,
      method: req.method,
      query: req.query,
      body: req.body,
    };

    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      request,
      schema,
      contextFactory: () => ({ prisma }),
      operationName,
      query,
      variables,
    });

    if (result.type === "RESPONSE") {
      reply.send(result.payload);
    } else {
      reply.send({ error: "Stream not supported at the moment" });
    }
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("Server is ready!");
  });
}

main();
