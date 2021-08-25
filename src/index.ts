import fastify from "fastify";

async function main() {
  const server = fastify();

  server.get("/", (req, reply) => {
    reply.send({ test: true });
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log("Server is ready!");
  });
}

main();
