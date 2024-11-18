// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { write } from "bun";
import topTokens from "../top-tokens.json";

const top10TokensPaths = topTokens
  .slice(0, 10)
  .flatMap((token) => [token.id, token.symbol]);

await write(
  "top10-tokens-paths.json",
  JSON.stringify(top10TokensPaths, null, 2)
);
