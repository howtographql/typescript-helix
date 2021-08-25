import { execute, parse } from "graphql";
import { schema } from "./schema";

async function main() {
  const myQuery = `query { info }`;

  const result = await execute({
    schema,
    document: parse(myQuery),
  });

  console.log(result);
}

main();
