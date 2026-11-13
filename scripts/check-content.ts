import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { assessments, validateDefinition } from "../src/data/assessments";
for (const a of assessments) {
  validateDefinition(a);
  if (!a.source?.url || !a.source?.rights || !a.basis)
    throw Error("Missing source");
  for (const d of a.dimensions)
    if (!d.low || !d.high || !d.action) throw Error("Missing report content");
  console.log(
    `${a.id}: ${a.questions.length} questions, ${a.dimensions.length} dimensions, version ${a.version}`,
  );
}

const lockPath = new URL("../src/data/content-lock.json", import.meta.url);
const actual = Object.fromEntries(
  assessments.map((a) => {
    const { contentHash, ...content } = a;
    return [
      a.id,
      {
        version: a.version,
        scoringVersion: a.scoringVersion,
        reportVersion: a.reportVersion,
        hash: createHash("sha256")
          .update(JSON.stringify(content))
          .digest("hex"),
      },
    ];
  }),
);
if (process.argv.includes("--write"))
  writeFileSync(lockPath, JSON.stringify(actual, null, 2) + "\n");
else if (
  JSON.stringify(JSON.parse(readFileSync(lockPath, "utf8"))) !==
  JSON.stringify(actual)
)
  throw Error(
    "内容快照已变化，请复核版本、计分与文案后运行 pnpm exec tsx scripts/check-content.ts --write",
  );
