import "graphql-import-node";
import fastify from "fastify";
import { getGraphQLParameters, processRequest, Request } from "graphql-helix";
import { schema } from "./schema";

async function main() {
  const server = fastify();

  server.route({
    method: "POST",
    url: "/graphql",
    handler: async (req, reply) => {
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
        operationName,
        query,
        variables,
      });

      if (result.type === "RESPONSE") {
        reply.send(result.payload);
      } else {
        reply.send({ error: "Stream not supported at the moment" });
      }
    },
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:3000/`);
  });
}

main();
