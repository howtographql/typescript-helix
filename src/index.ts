import "graphql-import-node";
import { execute, parse } from "graphql";
import { schema } from "./schema";

async function main() {
  const myQuery = parse(`query { info }`);

  const result = await execute({
    schema,
    document: myQuery,
  });

  console.log(result);
}

main();
