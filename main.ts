// Entry program for the make.fun bounty
// "post-x-promote-make-your-own-bounty-01" (Promote make.fun's
// make-your-own-bounty post on X). Node 22, standard library only,
// no network, no clock, deterministic.
//
// The entry itself is the X post named in POST.json at this
// repository's root: a public post from @boothlordd that links to
// make.fun's own announcement (https://x.com/makefunai/status/
// 2124915864336236646), carries the line "Make your own bounty on
// @makefunai: https://make.fun/sponsor/new", asks readers what they
// would put a bounty on, and carries the entrant's play code for
// this bounty. Its photo — a warm desk scene with make.fun's ghost
// mascot posting a bounty on a laptop, under the headline MAKE YOUR
// OWN BOUNTY — travels with the repository as post-image.jpg.
//
// This program's whole job is to hand the post's address to the
// house exactly as written: it reads POST.json from the bot
// directory, checks that it names a real X status URL, and copies
// it byte for byte into the output directory, together with the
// post's photo, so the gate can read the post back from X.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// On success it prints nothing and out/POST.json matches POST.json.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const postPath = join(botDir, "POST.json");

let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(postPath, "utf8")) as { url?: unknown };
} catch (err) {
  console.error(`could not read ${postPath}: ${(err as Error).message}`);
  process.exit(1);
}

if (
  typeof post.url !== "string" ||
  !/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(post.url)
) {
  console.error(`POST.json does not name an X status URL: ${String(post.url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(postPath, join(outputDir, "POST.json"));
copyFileSync(join(botDir, "post-image.jpg"), join(outputDir, "post-image.jpg"));
