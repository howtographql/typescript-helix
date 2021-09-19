import "graphql-import-node";
import fastify from "fastify";
import {
  getGraphQLParameters,
  processRequest,
  Request,
  shouldRenderGraphiQL,
  renderGraphiQL,
} from "graphql-helix";
import { schema } from "./schema";
import { contextFactory } from "./context";

async function main() {
  const server = fastify();

  server.route({
    method: ["POST", "GET"],
    url: "/graphql",
    handler: async (req, reply) => {
      const request: Request = {
        headers: req.headers,
        method: req.method,
        query: req.query,
        body: req.body,
      };

      if (shouldRenderGraphiQL(request)) {
        reply.header("Content-Type", "text/html");
        reply.send(
          renderGraphiQL({
            endpoint: "/graphql",
          })
        );

        return;
      }

      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory: () => contextFactory(req),
        query,
        variables,
      });

      if (result.type === "RESPONSE") {
        reply.send(result.payload);
      } else if (result.type === "PUSH") {
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("Cache-Control", "no-cache,no-transform");
        reply.raw.setHeader("x-no-compression", 1);

        // If the request is closed by the client, we unsubscribe and stop executing the request
        req.raw.on("close", () => {
          result.unsubscribe();
        });

        // We subscribe to the event stream and push any new events to the client
        await result.subscribe((result) => {
          reply.raw.write(`data: ${JSON.stringify(result)}\n\n`);
        });
      }
    },
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:3000/`);
  });
}

main();
